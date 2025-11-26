const mongoose = require('mongoose');

const updateProfile = async (userModel, req, res) => {
  const User = mongoose.model(userModel);

  const reqUserName = userModel.toLowerCase();
  const userProfile = req[reqUserName];

  // 1. Security Check: Prevent changing the Demo Admin
  if (userProfile.email === 'admin@admin.com') {
    return res.status(403).json({
      success: false,
      result: null,
      message: "you couldn't update demo informations",
    });
  }

  // 2. Prepare basic updates (Text fields)
  let updates = {
    email: req.body.email,
    name: req.body.name,
    surname: req.body.surname,
  };

  // 3. === FIX: HANDLE FILE UPLOAD ===
  // We check if a file was sent in req.files
  if (req.files && req.files.photo) {
    const file = req.files.photo; // Get the file object
    
    // Create a unique filename (timestamp + original name)
    const fileName = new Date().getTime() + "_" + file.name;
    
    // Define where to save it (public/uploads/admin/filename.jpg)
    const uploadPath = `public/uploads/${reqUserName}/${fileName}`;

    try {
      // Move the file to the server folder
      await file.mv(uploadPath);
      
      // Add the new filename to the database updates
      updates.photo = fileName;
    } catch (err) {
      console.error("File upload failed:", err);
      // We continue even if image fails, to update text fields
    }
  }
  // ==================================

  // 4. Update the Database
  const result = await User.findOneAndUpdate(
    { _id: userProfile._id, removed: false },
    { $set: updates },
    {
      new: true, // return the new result instead of the old one
    }
  ).exec();

  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No profile found by this id: ' + userProfile._id,
    });
  }

  // 5. Send Response
  return res.status(200).json({
    success: true,
    result: {
      _id: result?._id,
      enabled: result?.enabled,
      email: result?.email,
      name: result?.name,
      surname: result?.surname,
      photo: result?.photo,
      role: result?.role,
    },
    message: 'Profile updated successfully',
  });
};

module.exports = updateProfile;