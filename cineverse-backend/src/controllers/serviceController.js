const Service = require('../models/Service');
const cloudinary = require('../config/cloudinary'); 

// Add new service
exports.addService = async (req, res) => {
  try {
    const { title, description } = req.body;
    let iconUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'cineverse/services' });
      iconUrl = result.secure_url;
    }
    const service = new Service({ title, description, iconUrl });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all services
exports.getServices = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update service
exports.updateService = async (req, res) => {
  try {
    const { title, description } = req.body;
    let iconUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'cineverse/services' });
      iconUrl = result.secure_url;
    }
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        ...(iconUrl && { iconUrl }),
      },
      { new: true }
    );
    if (!service) return res.status(404).json({ msg: 'Not found' });
    res.json(service);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete service
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
