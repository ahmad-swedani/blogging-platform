const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
    {
        content: {
            type: String,
            required: [true, 'A comment must have content'],
        },
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
            required: [true, 'A comment must belong to a post'],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'A comment must have an author'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    },
);

commentSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'author',
        select: 'name email avatarUrl',
    });
    next();
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
