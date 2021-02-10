//const crypto = require("crypto");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
module.exports = {
  async createUser(req, res) {
    try {
      const { firstName, lastName, email, password } = req.body;

      const existentUser = await User.findOne({ email });

      if (!existentUser) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
          firstName,
          lastName,
          email,
          password: hashedPassword,
          createdAt: Date.now(),
        });
        return jwt.sign({ user: user }, config.SECRET, (err, token) => {
          return res.status(200).json({
            user: token,
            user_id: user._id,
            firstName: user.firstName,
            role: user.role,
          });
        });
      } else if (existentUser.email === email) {
        console.log("duplicate");
        res.json({
          success: false,
          message: `User with email ${email} already exists Do you want to login instead?,`,
        });
      }
    } catch (err) {
      throw Error(`Error while registering new user : ${err}`);
    }
  },

  async getUserById(req, res) {
    const { userId } = req.params;
    try {
      const user = await User.findById(userId);

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `User ID does not exist, do you want to register instead?`,
      });
    }
  },
  async getAllUsers(req, res) {
    try {
      const users = await User.find();

      if (users) {
        return res.status(200).json({
          success: true,
          data: users,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `There are no users yet`,
      });
    }
  },
};
