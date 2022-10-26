const router = require("express").Router();

const { testChannel } = require("../controllers/testController");

router.get("/test", testChannel);

module.exports = router;
