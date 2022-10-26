const random = require("randomstring");
const axios = require("axios").create({
  baseUrl: process.env.PASSURL,
  headers: { Authorization: process.env.PASSAUTH },
});

const Card = require("../models/cardModel");

exports.addCard = async (req, res) => {
  let sidNo = random.generate({ charset: "number", length: 16 });

  try {
    const sidCheck = await Card.findOne({ sid: sidNo });

    if (sidCheck) {
      sidNo = random.generate({ charset: "number", length: 16 });
    }

    const response = await axios({
      url: "pass?passtemplate=3695819a-435a-4464-ae4c-b33cadf40033&zapierStyle=true",
      method: "post",
    });

    let card = new Card(req.body);
    card.sid = sidNo;

    await card.save();

    res.json({ success: true, message: "Card added successfully", card });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Error adding new card" });
  }
};

exports.userCard = async (req, res) => {
  try {
    const userCard = await Card.find({ user: req.user });

    res.json({ success: true, userCard });
  } catch (error) {
    return res.status(401).json({ success: false, message: "Error get card" });
  }
};
