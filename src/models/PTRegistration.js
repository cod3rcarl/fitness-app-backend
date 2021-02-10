const mongoose = require("mongoose");

const PTRegistrationSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      required: [true, "Please add a date"],
    },
    approved: {
      type: Boolean,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    personalTrainer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PersonalTraining",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updated: Date,
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("PTRegistration", PTRegistrationSchema);
