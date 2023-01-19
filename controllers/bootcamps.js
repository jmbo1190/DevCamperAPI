//  Convention for controller names is lowercase (and plural?)

const Bootcamp = require('../models/Bootcamp');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res
            .status(200)
            .json({ success: true, data: bootcamps });
    } catch (err) {
        res.status(400)   // Bad request
            .json({
                success: false,
            });
    }
};

// @desc    Get a single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
exports.getBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Return bootcamp ${req.params.id}` });
};

// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private
exports.createBootcamp = async (req, res, next) => {
    // console.log(req.body);
    try {
        const bootcamp = await Bootcamp.create(req.body)  // returns a promise like every mongoose method
                               // note: fields in the body but not in the model will be dropped automatically
        res.status(201).json({ 
            success: true, 
            data: bootcamp,
            msg: "Created new bootcamp" 
        });
    } catch (err) {
        res.status(400)   // Bad request
            .json({
                success: false,
            });
    }
    

};

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
exports.updateBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Update bootcamp ${req.params.id}` });
};

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = (req, res, next) => {
  res
    .status(200)
    .json({ success: true, msg: `Delete bootcamp ${req.params.id}` });
};
