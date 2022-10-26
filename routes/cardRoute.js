const router = require("express").Router();

const JWT = require("../helpers/jwt");

const { addCard, userCard } = require("../controllers/cardController");

router.post("/add", addCard);

router.get("/user", JWT, userCard);

module.exports = router;
