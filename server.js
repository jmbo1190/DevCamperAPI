const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db')

// load configuration
dotenv.config({ path: "./config/config.env" });

// Connect to database
connectDB();

// Middleware files
// const logger = require('./middleware/logger'); // Custom logger middleware
const morgan = require('morgan');              // Third party HTTP request logger middleware

// Route Files
const bootcamps = require('./routes/bootcamps');
const auth = require('./routes/auth');


// Errort Handler
const errorHandler = require('./middleware/error');

const app = express();

// Body Parser
app.use(express.json());

// Use Dev logging middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);  // the path specified here will be used as base/prefix 
                                          // for all routes defined in this router
app.use('/api/v1/auth', auth);


// Error Handler
app.use(errorHandler);

const PORT=process.env.PORT || 3000;

const server = app.listen(PORT, console.log(`Express server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`.yellow.bold));

// Unhandled promiss rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red)
    // Close server & exit process
    server.close(() => process.exit(1)); // exit with failure
});