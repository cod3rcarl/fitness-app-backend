const PersonalTraining = require("../models/PersonalTraining");
const User = require("../models/User");

module.exports = {
  async createPTSession(req, res) {
    const { title, description, price } = req.body;
    const { user_id } = req.headers;

    let filename;
    let videoFile;
    req.files.thumbnail === undefined
      ? (filename = null)
      : (filename = req.files.thumbnail[0].filename);
    req.files.video === undefined
      ? (videoFile = null)
      : (videoFile = req.files.video[0].filename);

    const user = await User.findById(user_id);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: `User does not exist` });
    }

    const event = await PersonalTraining.create({
      title,
      description,
      price: parseFloat(price),
      user: user_id,
      thumbnail: filename,
      video: videoFile,
      createdAt: Date.now(),
    });

    return res.status(200).json({ success: true, data: event });
  },
  async getAllSessions(req, res) {
    try {
      const sessions = await PersonalTraining.find({});
      if (sessions) {
        return res.status(200).json({
          success: true,
          data: sessions,
        });
      }
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `We don't have any sessions yet`,
      });
    }
  },

  async getSessionById(req, res) {
    const { sessionId } = req.params;

    const session = await PersonalTraining.findById(sessionId);
    if (!session) {
      return res.status(400).json({
        success: false,
        message: `This session doesn't exist, do you want to setup a new event?`,
      });
    }
    return res.status(200).json({
      success: true,
      data: session,
    });
  },
  async deleteSession(req, res) {
    const { sessionId } = req.params;
    try {
      await PersonalTraining.findByIdAndDelete(sessionId);

      return res.status(200).json({ success: true, data: {} });
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: `This session does not exist`,
      });
    }
  },
};
