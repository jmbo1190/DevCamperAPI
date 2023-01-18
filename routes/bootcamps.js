const express = require("express");
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
} = require("../controllers/bootcamps");

const router = express.Router();

router.route("/").get(getBootcamps).post(createBootcamp);
//router.get("/", (req, res) => {
// res.status(200).json( { success: true, msg: 'Return all bootcamps' } ); // later on we will return data from database
//});
//router.post("/", (req, res) => {
// res.status(200).json( { success: true, msg: 'Create new bootcamp' } );
//});

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);
// router.get("/:id", (req, res) => {
// res.status(200).json( { success: true, msg: `Return bootcamp ${req.params.id}` } );
// });
// router.put("/:id", (req, res) => {
// res.status(200).json( { success: true, msg: `Update bootcamp ${req.params.id}` } );
// });
// router.delete("/:id", (req, res) => {
// res.status(200).json( { success: true, msg: `Delete bootcamp ${req.params.id}` } );
// });

module.exports = router;
