const Event = require("../models/Event");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");

module.exports = {
  createEvent(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { title, description, price, sport, date } = req.body;
        // const { user_id } = req.headers;

        const { location } = req.file;

        const user = await User.findById(authData.user._id);

        if (!user) {
          return res
            .status(400)
            .json({ success: false, message: `User does not exist` });
        }

        const event = await Event.create({
          title,
          description,
          price: parseFloat(price),
          user: authData.user._id,
          thumbnail: location,
          sport: sport,
          date: date,
          createdAt: Date.now(),
        });

        return res.status(200).json({ success: true, data: event });
      }
    });
  },
  getEventById(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { eventId } = req.params;

        const events = await Event.findById(eventId);
        if (!events) {
          return res.status(400).json({
            success: false,
            message: `This event does not exist, do you want to setup a new event?`,
          });
        }
        return res.status(200).json({
          success: true,
          Authorization: authData,
          events: events,
        });
      }
    });
  },

  deleteEvent(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { eventId } = req.params;
        try {
          await Event.findByIdAndDelete(eventId);

          return res.status(204).send();
        } catch (err) {
          return res.status(400).json({
            success: false,
            message: `This event does not exist`,
          });
        }
      }
    });
  },
};
