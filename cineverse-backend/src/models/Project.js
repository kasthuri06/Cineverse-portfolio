const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['Film', 'Ad', 'Short film', 'Music video', 'Other'],
    required: true,
  },
  posterUrl: { type: String }, // Cloudinary link
  videoUrl: { type: String },  // YouTube/Vimeo
  releaseYear: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
