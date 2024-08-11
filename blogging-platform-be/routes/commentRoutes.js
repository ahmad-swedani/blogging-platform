const express = require('express');

const commentController = require(`../controllers/commentController.js`);
const authController = require(`./../controllers/authController`);

const router = express.Router();

router
    .route('/:postId')
    .post(authController.protect, commentController.commentOnPost);

module.exports = router;
