const mongoose = require("mongoose");

const PersonalTrainingSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
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
    video: {
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

PersonalTrainingSchema.virtual("thumbnail_url").get(function() {
  return `http://localhost:8000/files/${this.thumbnail}`;
});
PersonalTrainingSchema.virtual("video_url").get(function() {
  return `http://localhost:8000/files/${this.video}`;
});

module.exports = mongoose.model("PersonalTraining", PersonalTrainingSchema);
