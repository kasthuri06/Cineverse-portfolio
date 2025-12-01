const Contact = require('../models/Contact');

// POST /api/contact
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const contact = new Contact({ name, email, message });
    await contact.save();
    res.status(201).json({ msg: 'Message sent', contact });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// GET /api/messages (admin)
exports.getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
