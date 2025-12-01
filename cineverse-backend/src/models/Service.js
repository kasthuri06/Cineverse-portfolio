const mongoose = require('mongoose');

const ServiceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  iconUrl: { type: String }, // Cloudinary image optional
}, { timestamps: true });

module.exports = mongoose.model('Service', ServiceSchema);
