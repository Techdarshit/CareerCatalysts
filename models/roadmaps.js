const mongoose = require("mongoose");

const RoadmapSchema = new mongoose.Schema({
  careerPath: { type: String, required: true }, // e.g., "Web Development", "Data Science"
  levels: {
    beginner: [
      { topic: String, duration: String, completed: { type: Boolean, default: false } },
    ],
    intermediate: [
      { topic: String, duration: String, completed: { type: Boolean, default: false } },
    ],
    advanced: [
      { topic: String, duration: String, completed: { type: Boolean, default: false } },
    ],
  },
});

const Roadmap = mongoose.model("Roadmap", RoadmapSchema);
module.exports = Roadmap;
