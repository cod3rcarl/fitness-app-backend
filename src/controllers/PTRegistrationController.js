const PTRegistration = require("../models/PTRegistration");

module.exports = {
  async create(req, res) {
    const { user_id } = req.headers;
    const { sessionId } = req.params;
    const { date } = req.body;

    const registration = await PTRegistration.create({
      user: user_id,
      personalTrainer: sessionId,
      date: date,
    });

    await registration
      .populate("personalTrainer")
      .populate("user", "-password")
      .execPopulate();

    return res.status(200).json({
      success: true,
      data: registration,
    });
  },

  async getRegistration(req, res) {
    const { registration_id } = req.params;
    try {
      const registration = await PTRegistration.findById(registration_id);
      await registration
        .populate("personalTrainer")
        .populate("user", "-password")
        .execPopulate();

      return res.status(200).json({
        success: true,
        data: registration,
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `No registration with id ${registration_id}`,
      });
    }
  },
};
