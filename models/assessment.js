const mongoose = require("mongoose");

const assessmentSchema = new mongoose.Schema({
  careerPath: { type: String, required: true }, // Web Development, Data Science, etc.
  level: { type: String, enum: ["beginner", "intermediate", "advanced"], required: true },
  tests: [
    {
      testName: String, // e.g., "Test 1", "Test 2", "Test 3"
      questions: [
        {
          question: String,
          options: [String],
          correctAnswer: String,
        },
      ],
    },
  ],
});

const Assessment = mongoose.model("Assessment", assessmentSchema);
module.exports = Assessment;
