const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'A post must have a title'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'A post must have content'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A post must have an author'],
        },
        categories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Category',
            },
        ],
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Comment',
            },
        ],
        likes: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Like',
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        coverUrl: {
            type: String,
            default:
                'https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

postSchema.virtual('numLikes').get(function () {
    return this.likes.length;
});

postSchema.virtual('numComments').get(function () {
    return this.comments.length;
});

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'name email avatarUrl',
    });
    next();
});

postSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'categories',
        select: 'name',
    });

    this.populate({
        path: 'comments',
        select: 'content author createdAt',
    });
    next();
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
