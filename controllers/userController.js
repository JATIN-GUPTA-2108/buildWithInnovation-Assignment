import User from '../models/User.js';
import fsExtra from 'fs-extra';

export const updateUserProfile = async (req, res, next) => {
  try {
    const { name } = req.body;
    const userId = req.user.user_id;
    if (!name && !req.file) {
      return res.status(400).json({ success: false, message: 'Name or profile image is required for update.' });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    if (name) {
      user.name = name;
    }
    if (password) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);
      user.password = hashedPassword;
    }
    if (req.file) {
      if (user.profile_image) {
        await fsExtra.remove(user.profile_image);
      }

      const newProfileImagePath = req.filePath;
      user.profile_image = newProfileImagePath;
    }

    await user.save();

    return res.status(200).json({ success: true, message: 'User profile updated successfully.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to update user profile.' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const userDirectory = `file_uploads/${userId}`;
    await fsExtra.remove(userDirectory);

    await user.deleteOne();

    return res.status(200).json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ success: false, message: 'Failed to delete account.' });
  }
};


export const getUserDetails = async (req, res) => {
  try {
    const { userID } = req.user_id; // Assuming userId is sent as a route parameter

    // Find the user by ID
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }
    
    return res.status(200).json({ success: true, user });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Failed to fetch user details.' });
  }
};