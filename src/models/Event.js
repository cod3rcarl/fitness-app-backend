const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a coach"],
    },
    description: {
      type: String,
      required: [true, "Please add a description"],
    },
    price: {
      type: Number,
      required: [true, "Please add a price"],
    },
    thumbnail: {
      type: String,
    },
    sport: {
      type: String,
    },
    date: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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
EventSchema.virtual("thumbnail_url").get(function() {
  return this.thumbnail === undefined
    ? `http://localhost:8000/assets/background.jpg`
    : this.thumbnail;
});

module.exports = mongoose.model("Event", EventSchema);
