//const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = {
  async store(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(200).json({ message: "Required field missing" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(200).json({ message: "User not found" });
      }

      if (user && (await bcrypt.compare(password, user.password))) {
        const userResponse = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        };
        return jwt.sign({ user: userResponse }, config.SECRET, (err, token) => {
          return res.status(200).json({
            user: token,
            user_id: userResponse._id,
            role: userResponse.role,
          });
        });
        // return res.status(200).json(userResponse);
      } else {
        return res
          .status(200)
          .json({ message: "Email or Password does not match!" });
      }
    } catch (err) {
      throw Error(`Error while authenticating user ${err}`);
    }
  },
};
