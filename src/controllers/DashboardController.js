const Event = require("../models/Event");
const jwt = require("jsonwebtoken");
const config = require("../../config/config");
module.exports = {
  getAllEvents(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { sport } = req.params;
        const query = sport ? { sport } : {};

        const events = await Event.find(query);

        if (!events) {
          return res.status(400).json({
            success: false,
            message: `There are no events yet`,
          });
        }
        return res.status(200).json({
          success: true,
          authorization: authData,
          events: events,
        });
      }
    });
  },

  getEventsByUserId(req, res) {
    jwt.verify(req.token, config.SECRET, async (err, authData) => {
      if (err) {
        res.sendStatus(401).json({ message: "Unauthorized" });
      } else {
        const { user_id } = req.headers;

        try {
          const events = await Event.find({ user: authData.user._id });

          if (events) {
            return res
              .status(200)
              .json({ success: true, authorization: authData, events: events });
          }
        } catch (error) {
          return res.status(400).json({
            message: `We do have any events with the user_id ${user_id}`,
          });
        }
      }
    });
  },
};
