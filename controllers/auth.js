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

        // Ultimately we will send back a token
        // but right now we just want the user registered

        res.status(200).json({ success: true });  // initial simple method
    }
);

