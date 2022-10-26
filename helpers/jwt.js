const jwt = require("jsonwebtoken");

// custom middleware of decode HTTP headers
module.exports = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.status(401).json({ message: "Not Authorized for this action" });
  }

  let token = req.headers["authorization"];

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
      if (err) {
        if (err.expiredAt < new Date()) {
          return res.status(403).json({
            message: "Token has expired. Please login again",
            token: null,
          });
        }
        res.json({
          success: false,
          message: "Cant authenticate token",
        });
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(403).json({
      success: false,
      message: "Token not provided",
    });
  }
};
