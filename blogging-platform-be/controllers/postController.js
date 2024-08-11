const catchAsync = require('../utils/catchAsync');
const Post = require('../models/postModel');
const AppError = require('../utils/appError');

exports.getAllPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find();

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts: posts,
        },
    });
});

exports.createPost = catchAsync(async (req, res, next) => {
    const { body } = req;
    body.author = req.user._id;
    const post = await Post.create(body);
    res.status(201).json({
        status: 'success',
        data: {
            post: post,
        },
    });
});

exports.getPost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            post: post,
        },
    });
});

exports.updatePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    if (String(post.author) !== req.user._id && req.user.role !== 'admin') {
        return next(
            new AppError('You are not allowed to update this post', 403),
        );
    }

    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    res.status(200).json({
        status: 'success',
        data: {
            post: updatedPost,
        },
    });
});

exports.deletePost = catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);

    if (!post) {
        return next(new AppError('No post found with that ID', 404));
    }

    if (req.user.role !== 'admin' && String(post.author) !== req.user._id) {
        return next(
            new AppError('You are not allowed to delete this post', 403),
        );
    }

    await post.remove();

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

exports.getMyPosts = catchAsync(async (req, res, next) => {
    const posts = await Post.find({ author: req.user._id });

    res.status(200).json({
        status: 'success',
        results: posts.length,
        data: {
            posts: posts,
        },
    });
});
