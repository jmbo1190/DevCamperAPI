const colors = require("colors");
const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (error, req, res, next) => {
    let thrownError = { ...error}; // Use the spread operator to make a copy of the original error object 
    thrownError.message = error.message;  // this property is not copied automatically
    // console.log("thrownError.message:", thrownError.message);
    if (process.env.NODE_ENV === "development") {
        console.log("Caught error with the following own properties:".magenta);
        Object.entries(error).forEach(([key, value]) => console.log(colors.magenta("   error."+key+": "), colors.magenta(value)));
        console.log("Other properties:".red);
        console.log("error.name:\n".red, error.name.red);
        console.log("error.message:\n".red, error.message.red);
        console.log("error.stack:\n".red, error.stack.red);
        console.log("error object:\n", error);
        /*
        console.log("Caught error with the following string properties (own + inherited):".bgMagenta);
        for (const property in error) {
            console.log(("  error."+property+":").bgMagenta, colors.bgMagenta(error[property]));
        }
        */
    }
    
    // Handle Mongoose Bad ObjectId
    if (error.name === "CastError" && error.kind === "ObjectId") {
        // Customize the error
        //const message = `Resource not found with id of ${error.value}`;
        error = new ErrorResponse(`Resource not found with id of ${error.value}`, 404);
    } 

    // Handle Mongoose duplicate key
    if (error.code === 11000 && error.name === "MongoServerError") {
        error = new ErrorResponse(`Duplicate field value entered: ${JSON.stringify(error.keyValue)}`, 400);
    }

    // Handle Mongoose validation error
    if (error.name === "ValidationError") {
        const message = Object.values(error.errors).map(errval => errval.message);
        error = new ErrorResponse(message, 400);
    }
    
    // Send the error
    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || "Server Error",
    });
    
    
};


module.exports = errorHandler;
