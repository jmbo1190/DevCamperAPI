const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

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

        // Create Token
        const token = user.getSignedJwt(); // 'method' called on instantiated object (user)
                                           // (not 'static' called on class)

        res.status(200).json({ success: true, token });  // initial simple method
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

        if (! user) {
            return next(new ErrorResponse('Invalid credentials', 401));  // 401 : unauthorized
        }

        // check password
        const isMatch = await user.matchPassword(password);
        if (! isMatch) {
            return next(new ErrorResponse('Invalid credentials', 401));  // 401 : unauthorized
        }

        // Create Token
        const token = user.getSignedJwt(); // 'method' called on instantiated object (user)
                                           // (not 'static' called on class)

        res.status(200).json({ success: true, token });  // initial simple method
    }
);

