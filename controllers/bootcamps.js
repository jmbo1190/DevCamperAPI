//  Convention for controller names is lowercase (and plural?)

const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
/*
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        // res.status(400).json({ success: false, });
        next(new ErrorResponse(err.message, 400));
    }
};
*/
exports.getBootcamps = asyncHandler(
    async (req, res, next) => {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    }
);

// @desc    Get a single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
/*
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            // return res.status(400).json({ success:false });  // correctly formatted id but not found
            return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        }
        res
            .status(200)
            .json({ success: true, data: bootcamp});
    } catch (err) {
        // res.status(400).json({ success:false });  // incorrectly formatted id
        // next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        next(err);        
    }
};
*/
exports.getBootcamp = asyncHandler(
    async (req, res, next) => {
        const bootcamp = await Bootcamp.findById(req.params.id);

        if (!bootcamp) {
            // return res.status(400).json({ success:false });  // correctly formatted id but not found
            return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        }
        res
            .status(200)
            .json({ success: true, data: bootcamp});
    }
);

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private

exports.createBootcamp = asyncHandler(
    async (req, res, next) => {
        // add User field to req.body
        req.body.user = req.user.id;

        // Check for previously published bootcamps by this user
        const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

        // Only let admins publish >1 bootcamp
        if (publishedBootcamp && ! ['admin'].includes(req.user.role) ) {
            return(next(new ErrorResponse(`User with id: ${req.user.id} has already published 1 bootcamp.`, 400)));
        }

        const bootcamp = await Bootcamp.create(req.body);  // returns a promise like every mongoose method
                               // note: fields in the body but not in the model will be dropped automatically
        res.status(201).json({ 
            success: true, 
            data: bootcamp,
            msg: "Created new bootcamp" 
        });
    }
);

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
/*
exports.updateBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
            );
            // if (!bootcamp) return res.status(400).json({ success:false });
            if (!bootcamp) return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
            res.status(200).json( { success: true, data: bootcamp });
    } catch (err) {
        // res.status(400).json({ success:false });
        // next(new ErrorResponse(err.message, 400));
        next(err);
    }
};
*/
exports.updateBootcamp = asyncHandler(
    async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
            );
            if (!bootcamp) return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
            res.status(200).json( { success: true, data: bootcamp });
    }
);
// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
/*
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        
            // if (!bootcamp) return res.status(400).json({ success:false });
            if (!bootcamp) return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        
            res.status(200).json( { success: true, data: {} });
    } catch (err) {
        // res.status(400).json({ success:false });
        // next(new ErrorResponse(`Failed to retrieve and delete a bootacamp with id: ${req.params.id}`, 400));
        next(err);
    }
};
*/
exports.deleteBootcamp = asyncHandler(
    async (req, res, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        if (!bootcamp) return next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        res.status(200).json( { success: true, data: {} });
    }
);
