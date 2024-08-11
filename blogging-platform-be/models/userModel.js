const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name'],
    },
    email: {
        type: String,
        required: [true, 'please provide an email'],
        unique: [true, 'A user must have a unique email'],
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email', //{VALUE} is the value of the field
        },
    },
    phoneNumber: {
        type: String,
        default: '0799999999',
    },
    avatarUrl: {
        type: String,
        default:
            'https://api-dev-minimal-v510.vercel.app/assets/images/avatar/avatar_25.jpg',
    },
    country: {
        type: String,
        default: 'Jordan',
    },
    address: {
        type: String,
        default: 'university street',
    },
    state: {
        type: String,
        default: 'Amman',
    },
    city: {
        type: String,
        default: 'Amman',
    },
    zipCode: {
        type: String,
        default: '11111',
    },
    about: {
        type: String,
        default: 'default about for all users',
    },
    socialLinks: {
        facebook: {
            type: String,
            default: '',
        },
        twitter: {
            type: String,
            default: '',
        },
        linkedin: {
            type: String,
            default: '',
        },
        instagram: {
            type: String,
            default: '',
        },
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        trim: true,
        select: false, //hides the password from the response
        validate: {
            validator: validator.isLength,
            message: 'Password must be at least 8 characters',
        },
    },

    passwordConfirm: {
        type: String,
        required: [true, 'Please confirm your password'],
        minlength: 8,
        trim: true,
        validate: {
            // this only works on CREATE and SAVE!!!
            validator: function (val) {
                return val === this.password;
            },
            message: 'Password and password confirm must match',
        },
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
        type: Boolean,
        default: true,
        select: false,
    },
});

userSchema.pre('save', async function (next) {
    // Only run this function if password was actually modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete passwordConfirm field
    this.passwordConfirm = undefined;
    next();
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password') || this.isNew) return next();

    this.passwordChangeAt = Date.now() - 1000;
    next();
});

userSchema.pre(/^find/, function (next) {
    // this points to the current query
    this.find({ active: { $ne: false } });
    next();
});

// instance methods to check if the password is correct compare bcrypt
userSchema.methods.correctPassword = async function (
    candidatePassword,
    userPassword,
) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

// instance methods to check if password changed after create token
userSchema.methods.changedPasswordAfter = async function (JWTTimestamp) {
    if (this.passwordChangeAt) {
        const changedTimestamp = parseInt(
            this.passwordChangeAt.getTime() / 1000,
            10,
        );
        // console.log(changedTimestamp, JWTTimestamp);
        return JWTTimestamp < changedTimestamp; // 100 < 200
    }

    // False means Not Changed
    return false;
};

// instance methods for reset password token
userSchema.methods.correctPasswordResetToken = function () {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    // console.log({ resetToken }, this.passwordResetToken);
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
