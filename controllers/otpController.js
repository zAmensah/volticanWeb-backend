const User = require("../models/userModel");
const randomString = require("randomstring");

const { sendEmail } = require("../helpers/nodemailer");

exports.generateOTP = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user);
    const otp = randomString.generate({ charset: "numeric", length: 6 });

    const mailOptions = {
      from: '"VOLTICAN TEAM" <noreply@voltican.com>',
      to: user.email,
      subject: "OTP - Voltican Pass",
      html: `<p>Hello ${user.name.split(" ")[0].toString()}, </p>
              <p>This is verification code to view card. Please do not share this OTP.</p>
              <h1>${otp}</h1>
              <p>This OTP is only valid for 2 minutes</p>`,
    };

    user.otp = otp;

    sendEmail(mailOptions);
    await user.save();

    setTimeout(function () {
      user.otp = null;
      user.save();
    }, 120000);

    return res.json({
      success: true,
      message: "OTP successfully delievered. Please check mail",
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Error generating OTP. Please try again",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  try {
    const user = await User.findById(req.user);

    if (user.otp != otp) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid OTP. Please try again" });
    }

    user.otp = null;
    await user.save();

    return res.json({ success: true, message: "Verification Successful" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid OTP. Please try again" });
  }
};
