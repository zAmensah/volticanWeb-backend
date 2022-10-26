const router = require("express").Router();

const JWT = require("../helpers/jwt");

const {
  registerUser,
  loginUser,
  getProfile,
  editProfile,
} = require("../controllers/authController");

router.post("/register", registerUser);

router.post("/login", loginUser);

router.get("/profile", JWT, getProfile);

router.put("/user/edit", JWT, editProfile);

module.exports = router;
