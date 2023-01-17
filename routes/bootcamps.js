const express = require('express');
const router = express.Router();


router.get("/", (req, res) => {
    res.status(200).json( { success: true, msg: 'Return all bootcamps' } ); // later on we will return data from database
});

router.get("/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Return bootcamp ${req.params.id}` } ); 
});

router.post("/", (req, res) => {
    res.status(200).json( { success: true, msg: 'Create new bootcamp' } ); 
});

router.put("/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Update bootcamp ${req.params.id}` } ); 
});

router.delete("/:id", (req, res) => {
    res.status(200).json( { success: true, msg: `Delete bootcamp ${req.params.id}` } ); 
});


module.exports = router ;