const Project = require('../models/Project');
const cloudinary = require('../config/cloudinary'); 


// Add new project
exports.addProject = async (req, res) => {
  try {
    const { title, description, category, videoUrl, releaseYear } = req.body;
    let posterUrl = '';
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'cineverse/projects' });
      posterUrl = result.secure_url;
    }
    const project = new Project({ title, description, category, videoUrl, releaseYear, posterUrl });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Get one project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const { title, description, category, videoUrl, releaseYear } = req.body;
    let posterUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'cineverse/projects' });
      posterUrl = result.secure_url;
    }
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        videoUrl,
        releaseYear,
        ...(posterUrl && { posterUrl }),
      },
      { new: true }
    );
    if (!project) return res.status(404).json({ msg: 'Not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) return res.status(404).json({ msg: 'Not found' });
    res.json({ msg: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
