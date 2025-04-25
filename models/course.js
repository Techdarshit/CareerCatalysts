const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  careerPath: { type: String, required: true }, // Web Development, Data Science, etc.
  level: { type: String, required: true, enum: ["beginner", "intermediate", "advanced"] },
  name: { type: String, required: true }, // Course title
  link: { type: String, required: true }, // Course URL
});

const Course=mongoose.model("Course", courseSchema);
module.exports = Course;
