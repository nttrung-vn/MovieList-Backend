const express = require("express");
const movies = require("../controllers/movie.controller");
const auth = require("../middleware/auth");

const router = express.Router();

router.route("/").get(movies.findAll).post(movies.create);

router
  .route("/:id")
  .get(movies.findOne)
  .put(movies.update)
  .delete(movies.delete);

module.exports = router;
