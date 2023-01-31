const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/User");


// Protect routes

exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  /*  // Commented out for testing purposes
  else if (req.cookies.token) {
    token = req.cookies.token;
  }
  */

  // Make sure token exists
  if (! token) {
    return next(new ErrorResponse("Unauthorized to access this route", 401));
  }

  // Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded: ", decoded);

    req.user = await User.findById(decoded.id);

    console.log("req.user: ", req.user);

    next();
  } catch (err) {
    console.log("err: ", err);
    return next(new ErrorResponse("Unauthorized to access this route", 401));
  }

});
