const express = require("express");
const router = express.Router();

const users = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router.route("/register").post(users.register);
router.route("/login").post(users.login);

router.route("/favorite").get(auth, users.findAllFavorite);

router
  .route("/favorite/:id")
  .post(auth, users.addFavorite)
  .delete(auth, users.removeFavorite);

module.exports = router;
