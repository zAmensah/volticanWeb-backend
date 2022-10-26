const router = require("express").Router();

const JWT = require("../helpers/jwt");
const { generateOTP, verifyOTP } = require("../controllers/otpController");

router.post("/generate", JWT, generateOTP);

router.post("/verify", JWT, verifyOTP);

module.exports = router;
