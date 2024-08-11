// const fs = require('fs');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const AppError = require(`./utils/appError`);
const globalErrorHandler = require(`./controllers/errorController`);
const userRouter = require('./routes/userRoutes');
const categoryRouter = require('./routes/categoryRoutes');
const commentRouter = require('./routes/commentRoutes');
const postRouter = require('./routes/postRoutes');
const likeRouter = require('./routes/likeRoutes');

const app = express();
app.use(cors());

// 1) MIDDLEWARE
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// middleware
app.use(express.json());

// my middleware to return the ttrueime that was request the data
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.headers);
    next();
});

// 3) ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/categories', categoryRouter);
app.use('/api/v1/comments', commentRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/likes', likeRouter);

// Route to catch 404 errors
app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
