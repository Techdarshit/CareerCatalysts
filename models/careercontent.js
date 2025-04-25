const mongoose = require("mongoose");

const CareerPathSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "Web Development"
  roadmap: { type: String, required: true }, // URL to roadmap
  resources: [{ type: String }], // List of resource names
  courses: [
    {
      name: { type: String, required: true }, // Course name
      link: { type: String, required: true } // URL to course
    }
  ]
});

const CareerPath = mongoose.model("CareerPath", CareerPathSchema);

module.exports = CareerPath;
