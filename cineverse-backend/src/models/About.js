const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: false },
  title: { type: String, required: false },
  photo: { type: String }, // Cloudinary link optional
}, { _id: false });

const AboutSchema = new mongoose.Schema({
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  story: { type: String },
  team: [TeamMemberSchema]
}, { timestamps: true });

module.exports = mongoose.model('About', AboutSchema);
