const Registration = require("../models/Registration");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = {
  create(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const user_id = authData.user._id;
        const { eventId } = req.params;

        const registration = await Registration.create({
          user: user_id,
          event: eventId,
        });

        await registration
          .populate("event")
          .populate("user", "-password")
          .execPopulate();

        registration.owner = registration.event.user;
        registration.eventTitle = registration.event.title;
        registration.eventPrice = registration.event.price;
        registration.eventDate = registration.event.date;
        registration.userEmail = registration.user.email;
        registration.save();

        console.log(registration);
        const ownerSocket = req.connectedUsers[registration.event.user];
        if (ownerSocket) {
          req.io.to(ownerSocket).emit("registration_request", registration);
        }
        return res.status(200).json({
          success: true,
          data: registration,
        });
      }
    });
  },
  async getRegistration(req, res) {
    const { registration_id } = req.params;
    try {
      const registration = await Registration.findById(registration_id);
      await registration
        .populate("event")
        .populate("user", "-password")
        .execPopulate();
      return res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `No registraton with id ${registration_id}`,
      });
    }
  },

  getMyRegistrations(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        try {
          const registrationArr = await Registration.find({
            owner: authData.user._id,
          });
          if (registrationArr) {
            return res
              .status(200)
              .json({ success: true, registrations: registrationArr });
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  },

  deleteRegistration(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { registration_id } = req.params;
        try {
          await Registration.findByIdAndDelete(registration_id);

          return res.status(204).send();
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `This registration does not exist`,
          });
        }
      }
    });
  },
};
