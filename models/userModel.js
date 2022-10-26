const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { ObjectId } = mongoose.Schema;

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  employee_id: String,
  employee_level: { type: String, enum: ["entry", "executive", "senior"] },
  height: String,
  dob: String,
  phone: String,
  card: [{ type: ObjectId, ref: "Card" }],
  image: String,
  last_loggin: Number,
  otp: String,
  signature: String,
  created_at: { type: Date, default: Date.now },
});

userSchema.pre("save", function (next) {
  var user = this;

  if (!user.isModified("password")) return next();
  bcrypt.hash(user.password, 10, function (err, hash) {
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
