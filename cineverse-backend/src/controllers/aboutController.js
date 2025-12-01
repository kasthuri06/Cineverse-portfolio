const About = require('../models/About');
const cloudinary = require('../config/cloudinary');




// GET /api/about
exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne();
    if (!about) {
      // Return empty structure instead of 404 for better UX
      return res.json({ 
        mission: '', 
        vision: '', 
        story: '', 
        team: [] 
      });
    }
    res.json(about);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// PUT /api/about (admin)
/*exports.updateAbout = async (req, res) => {
  try {
    const { mission, vision, story, team } = req.body;
    let updatedTeam = team || [];

    // If there are files (photos for team[]), handle Cloudinary uploads
    if (req.files && req.files.length && Array.isArray(updatedTeam)) {
      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const cld = await cloudinary.uploader.upload(file.path, { folder: 'cineverse/team' });
        if (updatedTeam[i]) updatedTeam[i].photo = cld.secure_url;
      }
    }*/
  exports.updateAbout = async (req, res) => {
        try {
          const { mission, vision, story } = req.body;
      
          // Validate required fields
          if (!mission || !vision) {
            return res.status(400).json({ msg: 'Mission and Vision are required' });
          }
      
          // team comes as JSON string from FormData - must parse it
          let updatedTeam = [];
          if (req.body.team) {
            try {
              // Always parse as string first (FormData sends everything as string)
              const teamData = typeof req.body.team === 'string' 
                ? JSON.parse(req.body.team) 
                : req.body.team;
              
              // Ensure it's an array
              if (!Array.isArray(teamData)) {
                console.error('Team data is not an array:', teamData);
                updatedTeam = [];
              } else {
                // Filter out empty team members and ensure proper structure
                updatedTeam = teamData
                  .filter(member => member && (member.name || member.title)) // Keep if has name or title
                  .map(member => ({
                    name: member.name || '',
                    title: member.title || '',
                    photo: member.photo || ''
                  }));
              }
            } catch (parseErr) {
              console.error('Error parsing team JSON:', parseErr);
              console.error('Team value received:', req.body.team);
              updatedTeam = [];
            }
          }
          
          // Ensure updatedTeam is definitely an array
          if (!Array.isArray(updatedTeam)) {
            console.error('updatedTeam is not an array, resetting to empty array');
            updatedTeam = [];
          }
      
          // Handle file uploads - files are sent in order for team members that need new photos
          if (req.files && req.files.length > 0 && Array.isArray(updatedTeam) && updatedTeam.length > 0) {
            // Upload files sequentially and assign to team members in order
            // Frontend only sends files for members that need new photos, so we assign them in order
            for (let fileIndex = 0; fileIndex < req.files.length && fileIndex < updatedTeam.length; fileIndex++) {
              const file = req.files[fileIndex];
              if (!file || !file.buffer) {
                console.warn(`File ${fileIndex} is missing or has no buffer`);
                continue;
              }
              try {
                // Use buffer for memory storage
                const cld = await new Promise((resolve, reject) => {
                  const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "cineverse/team" },
                    (error, result) => {
                      if (error) reject(error);
                      else resolve(result);
                    }
                  );
                  uploadStream.end(file.buffer);
                });
                // Assign photo to corresponding team member
                if (updatedTeam[fileIndex]) {
                  updatedTeam[fileIndex].photo = cld.secure_url;
                }
              } catch (uploadErr) {
                console.error(`Cloudinary upload error for file ${fileIndex}:`, uploadErr);
                // Continue with next file even if one fails
              }
            }
          }
      
          let about = await About.findOne();
          
          // Final safety check - ensure team is a proper array
          const finalTeam = Array.isArray(updatedTeam) ? updatedTeam : [];
          
          if (!about) {
              about = new About({ 
                mission, 
                vision, 
                story: story || '', 
                team: finalTeam
              });
          } else {
              about.mission = mission;
              about.vision = vision;
              about.story = story || '';
              // Use set to ensure Mongoose recognizes the change
              about.set('team', finalTeam);
          }
          
          // Validate before saving
          try {
            await about.validate();
          } catch (validationErr) {
            console.error('Validation error:', validationErr);
            return res.status(400).json({ msg: `Validation error: ${validationErr.message}` });
          }
          
          await about.save();
          res.json(about);
        } catch (err) {
          console.error('About update error:', err);
          res.status(500).json({ msg: err.message || 'Failed to update about section' });
        }
  };
