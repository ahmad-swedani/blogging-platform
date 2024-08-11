const express = require('express');

const postController = require(`../controllers/postController.js`);
const authController = require(`./../controllers/authController`);

// ROUTES

const router = express.Router();

router
    .route('/')
    .get(postController.getAllPosts)
    .post(authController.protect, postController.createPost);

router
    .route('/my-posts')
    .get(authController.protect, postController.getMyPosts);

router
    .route('/:id')
    .get(authController.protect, postController.getPost)
    .patch(authController.protect, postController.updatePost)
    .delete(authController.protect, postController.deletePost);

module.exports = router;
