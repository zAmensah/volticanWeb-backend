const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const cardSchema = new mongoose.Schema({
  sid: String,
  user: { type: ObjectId, ref: "User" },
  uri: String,
  linkToPassFile: String,
  linkToPassPage: String,
  identifier: String,
  expire_long: Date,
  expire_short: String,
  points: { type: Number, default: 50 },
});

module.exports = mongoose.model("Card", cardSchema);
