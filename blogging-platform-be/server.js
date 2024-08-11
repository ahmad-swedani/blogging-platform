const mongoose = require('mongoose');
const dotenv = require('dotenv');

// for catching Uncaught Exceptions (synchronous errors)
process.on('uncaughtException', err => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

// this command will read the variables from the file and save them nodeJs environment variables and the console just to see all nodeJs environment variables
dotenv.config({ path: './config.env' });
const app = require('./app');

const DB = process.env.MONGODB_URI;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => console.log('DB connection successful'))
    .catch(err => console.error('DB connection error:', err));

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
    console.log(`App running on port ${port}...`);
});

// for handling unhandled promise rejections (errors outside Express)
process.on('unhandledRejection', err => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.log(err.name, err.message);
    // close the server and exit
    server.close(() => {
        // exit the process
        process.exit(1);
    });
});
