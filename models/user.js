const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

let userschema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  careerPaths: [{
    path: { type: String, required: true },  // Career Path (e.g., "Web Development", "Data Science")
    courseProgress: {
      beginner: { type: Number, default: 0 },
      intermediate: { type: Number, default: 0 },
      advanced: { type: Number, default: 0 },
      completedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }] // Track completed course IDs
    }
    
  }],activeCareerPath: { type: String, default: null },badges: [
    {
      name: { type: String, required: true }, // Badge name
      description: { type: String, required: true }, // Badge description
      earnedAt: { type: Date, default: Date.now }, // When the badge was earned
    },
  ], attemptedAssessments: [{
    careerPath: String,
    level: String,
    testName: String,
    score: Number,
    hasRetested: { type: Boolean, default: false },
  }]
});

// Add passport-local-mongoose plugin
userschema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userschema);
