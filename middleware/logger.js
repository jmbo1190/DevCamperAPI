// Define simple custom logging middleware 
// @desc    Logs requests to console
const logger = (req, res, next) => {
    req.hello = "Hello World"; // setting a variable that will be available to all subsequent routes
    console.log("Middleware 'logger':");
    console.log(`  ${req.method} ${req.protocol}://${req.get('host')}${req.originalUrl}`)
    next(); // needed to move on to next middleware / route
};

module.exports = logger;
