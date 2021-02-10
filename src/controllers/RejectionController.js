const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = {
  rejection(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { registration_id } = req.params;

        try {
          const registration = await Registration.findById(registration_id);

          registration.approved = false;

          await registration.save();

          return res.status(200).json({
            success: true,
            data: registration,
          });
        } catch (error) {
          return res.status(400).json(error);
        }
      }
    });
  },
};
