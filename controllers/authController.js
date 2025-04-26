const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Group = require('../models/Group');
const Task = require('../models/Task');
// Register new user
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const payload = { userId: newUser._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Update user info (username, email, or password) after verifying current password
exports.updateProfile = async (req, res) => {
  const { currentPassword, newUsername, newEmail, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id); // Get user from token

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    // Update fields only if provided
    if (newUsername) user.username = newUsername;
    if (newEmail) user.email = newEmail;
    if (newPassword) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();
    res.status(200).json({ message: 'Profile updated successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const userId = req.user._id;
  
      // 1. Find all groups owned by this user
      
      const groups = await Group.find({ user: userId });
      console.log("Associated groups for user:", groups);
  
      // 2. For each group, delete its tasks
      
      for (const group of groups) {
        console.log(`Deleting tasks for group ${group._id}`);
        await Task.deleteMany({ groupId: group._id });
      }
  
      // 3. Delete the groups created by the user
      await Group.deleteMany({ user: userId });
      
  
      // 4. Finally, delete the user
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: 'User and all associated data deleted successfully' });
  
    } catch (err) {
      console.error('Delete user error:', err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };


  