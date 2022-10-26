const randomString = require("randomstring");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const axios = require("axios");

const User = require("../models/userModel");
const Card = require("../models/cardModel");

exports.registerUser = async (req, res) => {
  const passUrl =
    `${process.env.PASSURL}` +
    "pass?passtemplate=3695819a-435a-4464-ae4c-b33cadf40033&zapierStyle=true";

  let initDate = new Date();
  let sanDate = new Date(initDate.setFullYear(initDate.getFullYear() + 4));

  let expireMonth = sanDate.getUTCMonth() + 1;
  if (expireMonth < 10) {
    expireMonth = "0" + expireMonth;
  }

  const shortDate = expireMonth + "/" + sanDate.getUTCFullYear();

  if (!req.body.name || !req.body.email || !req.body.password)
    return res
      .status(400)
      .json({ success: false, message: "field is required" });

  let employeeId = randomString.generate({ length: 8, charset: "numeric" });
  let sID = randomString.generate({ length: 16, charset: "numeric" });

  try {
    const userExist = await User.findOne({ email: req.body.email });
    const idExist = await User.findOne({ employee_id: employeeId });

    if (userExist)
      return res.status(401).json({
        success: false,
        message: "User with email already exist. Please try again or log in",
      });

    if (idExist) {
      employeeId = randomString.generate({ length: 8, charset: "numeric" });
    }

    let user = new User(req.body);
    user.employee_id = employeeId;
    user.last_loggin = Date.now();

    // console.log("Heeeee");
    // console.log(
    //   new Date(602957580000).toISOString().split("T")[0].replace(/-/g, "")
    // );

    // let dateString = Date(req.body.dob).toISOString();
    // .split("T")[0]
    // .replace(/-/g, "");
    // return console.log(dateString);

    // const cardID = dateString + `${sID}`;

    // console.log(cardID);

    const cardData = {
      Id: sID,
      Points: "50",
      Expiry: shortDate,
      Name: user.name,
    };

    const passCard = await axios.post(passUrl, cardData, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
        Authorization:
          "_Z-E%6gR&J0F&_FD3Oq3i5b=JCGv6pE2hdTdoF8Ptad7sU38BFn9_8VeOP-KVKlq0jydx-FjK_Lobkwi",
      },
    });

    let card = new Card({
      sid: sID,
      user: user._id,
      uri: passCard.data.uri,
      linkToPassFile: passCard.data.linkToPassFile,
      linkToPassPage: passCard.data.linkToPassPage,
      identifier: passCard.data.identifier,
      expire_long: sanDate,
      expire_short: shortDate,
    });

    user.card.push(card._id);

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await card.save();
    await user.save();

    return res.json({
      success: true,
      message: "Registration Successful",
      user,
      token,
      card,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Error registering. Please try again" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required" });
  if (!password)
    return res.status(400).json({ message: "Password is required" });

  try {
    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        success: false,
        message: `User with email ${email} not found`,
      });

    const isPassword = user.comparePassword(password);

    if (!isPassword)
      return res
        .status(401)
        .json({ success: false, message: "invalid email or password" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    user.last_loggin = Date.now();
    await user.save();

    return res.json({
      success: true,
      message: "Login Successful",
      token,
      user,
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error loggin in. Please try again",
    });
  }
};

exports.getProfile = async (req, res) => {
  const profile = await User.findById(req.user);
  res.json(profile);
};

exports.editProfile = async (req, res) => {
  try {
    let user = await User.findById(req.user);

    user = _.extend(user, req.body);
    await user.save();
    return res.json({
      success: true,
      message: "Update profile successful",
      user,
    });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Error editing profile" });
  }
};
