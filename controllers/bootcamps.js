//  Convention for controller names is lowercase (and plural?)

const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = async (req, res, next) => {
    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
    } catch (err) {
        // res.status(400).json({ success: false, });
        next(new ErrorResponse(err.message, 400));
    }
};

// @desc    Get a single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public
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
        next(new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404));
        
    }
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
        //res.status(400).json({ success: false  });   // Bad request
        next(new ErrorResponse("Failed to create new bootcamp", 400));    
    }
    

};

// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private
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
            if (!bootcamp) return next(new ErrorResponse(`Failed to retrieve and update a bootacamp with id: ${req.params.id}`, 400));
        
            res.status(200).json( { success: true, data: bootcamp });
    } catch (err) {
        // res.status(400).json({ success:false });
        next(new ErrorResponse(err.message, 400));
    }
};

// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
        
            // if (!bootcamp) return res.status(400).json({ success:false });
            if (!bootcamp) return next(new ErrorResponse(`Failed to retrieve and delete a bootacamp with id: ${req.params.id}`, 400));
        
            res.status(200).json( { success: true, data: {} });
    } catch (err) {
        // res.status(400).json({ success:false });
        next(new ErrorResponse(`Failed to retrieve and delete a bootacamp with id: ${req.params.id}`, 400));
    }
};
