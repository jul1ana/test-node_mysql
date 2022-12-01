const jwt = require("jsonwebtoken");
const { promisify } = require("util");
require("dotenv").config();

module.exports = {
  eAdmin: async function (req, res, next) {
    const authHeader = req.headers.authorization;
    const [bearer, token] = authHeader.split(" ");

    // validando token
    if (!token) {
      return res.status(400).json({
        error: true,
        message: "ERROR: Its necessary to login access the page!"
      });
    };

    try {
      const decoded = await promisify(jwt.verify)(token, process.env.SECRET);
      req.userId = decoded.id;

      return next();
    } catch (err) {
      return res.status(400).json({
        error: true,
        message: "ERROR: Its necessary to login access the page!"
      });
    }
  }
};