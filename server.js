const express = require('express');
const dotenv = require('dotenv');
const colors = require('colors');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');

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

// Cookie Parser
app.use(cookieParser());

// Use Dev logging middleware
// app.use(logger);
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// sanitize data  (prevent mongoDB injection)
app.use(mongoSanitize());

// set security headers
app.use(helmet());

// prevent XSS attacks
app.use(xssClean());

// global rate limiting
const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 100, // Limit each IP to max number of requests per `window` (here, per 10 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
app.use(limiter);

// Prevent http param pollution
app.use(hpp());

// Enable CORS to allow use as a public API
app.use(cors());

// Apply the rate limiting middleware to all requests
app.use(limiter)

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