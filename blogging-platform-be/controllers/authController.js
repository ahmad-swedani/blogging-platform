const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
const accessTokenExpiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
const refreshTokenExpiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;

const signToken = id =>
    jwt.sign({ id }, accessTokenSecret, {
        expiresIn: accessTokenExpiresIn,
    });

const signRefreshToken = id =>
    jwt.sign({ id }, refreshTokenSecret, {
        expiresIn: refreshTokenExpiresIn,
    });

const createSendToken = (user, statusCode, res) => {
    const accessToken = signToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    res.status(statusCode).json({
        status: 'success',
        accessToken,
        refreshToken,
        user,
    });
};

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        passwordChangeAt: req.body.passwordChangeAt,
    });

    createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    // 1) Check if email and password exist

    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }

    // 2) Check user exists && password is correct

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    user.password = undefined;

    // 3) if everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
    // 1) getting token and check if it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    // console.log(token);

    if (!token) {
        return next(
            new AppError(
                'You are not logged in! Please log in to get access',
                401,
            ),
        );
    }

    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, accessTokenSecret);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new AppError(
                'The user belonging to this token dose no longer exist',
                401,
            ),
        );
    }

    // 4) check if user changed password after the token was issued
    if (await currentUser.changedPasswordAfter(decoded.iat)) {
        return next(
            new AppError(
                'User recently changed password! Please log in again.',
                401,
            ),
        );
    }

    //  GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

// this method for authorization to make who can delete the tour
exports.restrictTo =
    (...roles) =>
    (req, res, next) => {
        // roles ['admin', 'lead-guide'] role='user
        if (!roles.includes(req.user.role)) {
            return next(
                new AppError(
                    'you do not have permission to perform this action',
                    403,
                ),
            );
        }
        next();
    };

exports.forgotPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return next(new AppError(`There is no user with email address.`, 404));

    // 2) Generate the random reset tokens
    const resetToken = user.correctPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send the token to the user's email
    const resetURL = `${req.protocol}://${req.get(
        'host',
    )}/api/v1/users/resetPassword/${resetToken}`;

    const message = `Forgot Your Password? Submit a PATCH request with  new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget this password, please ignore this email.`;

    try {
        await sendEmail({
            email: user.email,
            subject: `Your password reset token (valid for 10 min)`,
            message,
        });
        res.status(200).json({
            status: 'success',
            message: `Token send to email`,
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(
            new AppError(
                `There was an error sending the email. Try again later.`,
            ),
            500,
        );
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If the token not expired, and there is user, set the new password
    if (!user) {
        return next(new AppError(`Token is invalid or has expired`, 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    // 3) Update ChangePasswordAt property for the user

    // 4) Log the user in, send JWT
    createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!user.correctPassword(req.body.password, user.password)) {
        return next(new AppError('Your Current password is wrong', 401));
    }
    // 3) If so, update password
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    await user.save();

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});

exports.refreshToken = catchAsync(async (req, res, next) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('Please provide a refresh token', 400));
    }

    const decoded = await promisify(jwt.verify)(
        refreshToken,
        refreshTokenSecret,
    );

    const user = await User.findById(decoded.id);

    if (!user) {
        return next(
            new AppError(
                'The user belonging to this token does no longer exist',
            ),
            401,
        );
    }

    const accessToken = signToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken: newRefreshToken,
    });
});
