const catchAsync = require('../utils/catchAsync');
const Comment = require('../models/commentModel');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');

exports.commentOnPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.postId);
    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }
    const newComment = await Comment.create({
        content: req.body.comment,
        post: req.params.postId,
        author: req.user.id,
    });
    post.comments.push(newComment._id);
    await post.save();

    res.status(201).json({
        status: 'success',
        data: {
            comment: newComment,
        },
    });
});
