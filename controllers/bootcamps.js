//  Convention for controller names is lowercase (and plural?)

const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const path = require('path');


// @desc    Get all bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res
    .status(200)
    .json({ success: true, count: bootcamps.length, data: bootcamps });
});


// @desc    Get a single bootcamps
// @route   GET /api/v1/bootcamps/:id
// @access  Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ success: true, data: bootcamp });
});


// @desc    Create a new bootcamp
// @route   POST /api/v1/bootcamps
// @access  Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  // add User field to req.body
  req.body.user = req.user.id;

  // Check for previously published bootcamps by this user
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // Only let admins publish >1 bootcamp
  if (publishedBootcamp && !["admin"].includes(req.user.role)) {
    return next(
      new ErrorResponse(
        `User with id: ${req.user.id} has already published 1 bootcamp.`,
        400
      )
    );
  }

  const bootcamp = await Bootcamp.create(req.body); // returns a promise like every mongoose method
  // note: fields in the body but not in the model will be dropped automatically
  res.status(201).json({
    success: true,
    data: bootcamp,
    msg: "Created new bootcamp",
  });
});



// @desc    Update a bootcamp
// @route   PUT /api/v1/bootcamps/:id
// @access  Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {

  // Only find bootcamp but do not update before checking
  let bootcamp = await Bootcamp.findById(req.params.id);

  // Make sure a bootcamp with this ID exists
  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404)
    );

  // Make sure user is the bootcamp owner or an admin
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID: ${req.user.id} is not authorized to update bootcamp with ID: ${req.params.id}`,
        401
      )
    );
  }

  // Find and update bootcamp
  bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, 
    { new: true, runValidators: true });

  res.status(200).json({ success: true, data: bootcamp });
});


// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  //const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404)
    );


  // Make sure user is the bootcamp owner or an admin
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID: ${req.user.id} is not authorized to delete bootcamp with ID: ${req.params.id}`,
        401
      )
    );
  }

  bootcamp.remove();

  res.status(200).json({ success: true, data: {} });
});



// @desc    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @access  Private

exports.bootcampPhotoUpload = asyncHandler(async (req, res, next) => {
  let bootcamp = await Bootcamp.findById(req.params.id);
  if (!bootcamp)
    return next(
      new ErrorResponse(`No bootcamp found with id of ${req.params.id}`, 404)
    );


  // Make sure user is the bootcamp owner or an admin
  if (req.user.id !== bootcamp.user.toString() && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User with ID: ${req.user.id} is not authorized to update bootcamp with ID: ${req.params.id}`,
        401
      )
    );
  }

  // Make sure a file was provided
  if (! req.files) {
    return next(
      new ErrorResponse(`Please upload a file`, 400)
    );
  }

  const file = req.files.file;
  console.log(file);

  // Make sure the file is an image
  if (! file.mimetype.startsWith('image/')) {
    return next(
      new ErrorResponse(`Please upload an image file`, 400)
    );
  }

  // Check file size
  if (file.size > process.env.MAX_UPLOAD_FILE_SIZE) {
    return next(
      new ErrorResponse(`Please upload a file no bigger than ${process.env.MAX_UPLOAD_FILE_SIZE} bytes`, 400)
    );
  }

  // Create custom filename
  file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
  console.log('file.name: ', file.name);

  // Move file to destination folder
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, 
          async err => {
            if (err) {
              console.error(err);
              return next(
                new ErrorResponse(`Could not save uploaded file`, 500)
              );
            }

            bootcamp = await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: file.name })

            // EITHER return just the filename:
            // res.status(200).json({ success: true, data: file.name });
            // OR return the full bootcamp:
            res.status(200).json({ success: true, data: bootcamp });
            
          });

  
});

