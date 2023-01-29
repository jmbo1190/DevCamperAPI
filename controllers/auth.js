const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc    Register user
// @route   GET /api/v1/auth/register
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

