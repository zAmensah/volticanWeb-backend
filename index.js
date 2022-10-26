const express = require("express");
const cors = require("cors");

require("dotenv").config();

// initialize
const app = express();
require("./helpers/database");

// routes
const testRoute = require("./routes/testRoutes");
const authRoute = require("./routes/authRoute");
const cardRoute = require("./routes/cardRoute");
const otpRoute = require("./routes/otpRoutes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", testRoute);
app.use("/api/auth", authRoute);
app.use("/api/card", cardRoute);
app.use("/api/otp", otpRoute);

// server
app.listen(process.env.PORT || 7600, () => {
  console.log(`Server live on port ${process.env.PORT}`);
});
