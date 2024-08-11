const catchAsync = require('../utils/catchAsync');
const Like = require('../models/likeModel');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');

exports.toggleLike = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    let like = await Like.findOne({
        post: req.params.postId,
        user: req.user._id,
    });

    if (like) {
        await Like.findByIdAndDelete(like._id);
        return res.status(200).json({
            status: 'success',
            data: {
                like: null,
            },
        });
    }

    like = await Like.create({
        post: req.params.postId,
        user: req.user._id,
    });

    post.likes.push(like._id);
    await post.save();

    res.status(201).json({
        status: 'success',
        data: {
            like: like,
        },
    });
});
