const express = require('express');
const dotenv = require('dotenv');

// Route Files
const bootcamps = require('./routes/bootcamps.js')
// console.log(bootcamps);

dotenv.config({ path: "./config/config.env" });

const app = express();

// Define simple custom logging middleware 
const logger = (req, res, next) => {
    req.hello = "Hello World"; // setting a variable that will be available to all subsequent routes
    console.log("Middleware 'logger':");
    console.log(`  ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next(); // needed to move on to next middleware / route
};

// Actually use logger middleware
app.use(logger);

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);  // the path specified here will be used as base/prefix 
                                          // for all routes defined in this router


const PORT=process.env.PORT || 3000;

app.listen(PORT, console.log(`Express server running in ${process.env.NODE_ENV} mode on http://localhost:${PORT}`));

