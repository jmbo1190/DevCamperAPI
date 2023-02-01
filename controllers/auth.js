const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');
const bcrypt = require('bcryptjs');


// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(
    async (req, res, next) => {
        const { name, email, password, role } = req.body; // pull data from the request body

        // Create user
        const user = await User.create({
            name,
            email,
            password,   // password hashing implemented in separate middleware
            role
        });

        /*
        // Create Token
        const token = user.getSignedJwt(); // 'method' called on instantiated object (user)
                                           // (not 'static' called on class)

        res.status(200).json({ success: true, token });  // initial simple method
        */

        // Create and send back Token with a cookie
        sendTokenResponse(user, 200, res);
    }
);


// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(
    async (req, res, next) => {
        const { email, password } = req.body; // pull data from the request body

        // validate email and password
        if (! email || ! password) {
            return next(new ErrorResponse('Please provide an email and password', 400));
        }

        // check user in DB
        const user = await User.findOne({ email }).select('+password'); // also retrieve password

        // Generate a dummy hashed password to do a dummy comparison
        // in case the user is invalid
        // So credentials are checked in constant time
        // i.e. both an invalid user name or an invalid password take same processing time
        const dummysalt = await bcrypt.genSalt(10);
        const hashedDummyPassword = await bcrypt.hash("$dUmmY$", dummysalt);

        let hashedPassword ;
        if (! user) {
            //return next(new ErrorResponse('Invalid credentials', 401));  // 401 : unauthorized
            hashedPassword = hashedDummyPassword;
        } else {
            hashedPassword = user.password;
        }

        // check password
        // const isMatch = await user.matchPassword(password);  // response not in constant time
        const isMatch = await bcrypt.compare(password, hashedPassword);
        if (! isMatch || ! user) {
            return next(new ErrorResponse('Invalid credentials', 401));  // 401 : unauthorized
        }

        /*
        // Create and send back Token
        const token = user.getSignedJwt(); // 'method' called on instantiated object (user)
                                           // (not 'static' called on class)

        res.status(200).json({ success: true, token });  // initial simple method
        */

        // Create and send back Token with a cookie
        sendTokenResponse(user, 200, res);
    }
);



// @desc    Get the current logged in user
// @route   POST /api/v1/auth/me
// @access  Private (i.e. you need a token to access)
exports.getMe = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json(
        {
            success: true,
            data: user
        }
    )
});


// @desc    Forgot Password - need reset
// @route   POST /api/v1/auth/forgotpassword
// @access  Public 
exports.forgotPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne( { email: req.body.email });

    if (! user) {
        return next(new ErrorResponse(`No user registered with email: ${req.body.email}`, 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();  // method defined on the user itself

    // console.log('resetToken: ', resetToken);

    await user.save( { validateBeforeSave: false } );

    res.status(200).json(
        {
            success: true,
            data: user
        }
    )
});





// Get Token from Model, create Cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create Token
    const token = user.getSignedJwt();  // 'method' called on instantiated object (user)
                                        // (not 'static' called on class)
    const options = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 3600 * 1000),
        httpOnly: true  // We only want the cookie to be accessed from the client-side script
    }   

    if (process.env.NODE_ENV === "production") {
        options.secure = true;
    }
    
    // send cookie
    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({ success: true, token });
}
