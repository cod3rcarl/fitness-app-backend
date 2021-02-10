const mongoose = require("mongoose");
const moment = require("moment");

const RegistrationSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      default: moment().format("MMM Do YY"),
      required: [true, "Please add a date"],
    },
    approved: {
      type: Boolean,
    },
    owner: {
      type: String,
    },
    eventTitle: {
      type: String,
    },
    eventPrice: {
      type: String,
    },
    eventDate: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
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

module.exports = mongoose.model("Registration", RegistrationSchema);
