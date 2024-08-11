const express = require('express');

const likeController = require(`../controllers/likeController.js`);
const authController = require(`./../controllers/authController`);

const router = express.Router();

router
    .route('/:postId')
    .post(authController.protect, likeController.toggleLike);

module.exports = router;
