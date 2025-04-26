const Group = require('../models/Group');
const {deleteTasksByGroup} = require('../controllers/taskController');
const mongoose = require('mongoose');
 
// Create a new group
exports.createGroup = async (req, res) => {
  const { name, description } = req.body;

  try {
    const newGroup = new Group({
      name,
      description,
      user: req.user._id,
    });

    await newGroup.save();
    res.status(201).json(newGroup);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all groups for the logged-in user
exports.getGroups = async (req, res) => {
  try {
    const groups = await Group.find({ user: req.user._id });
    res.status(200).json(groups);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};
// Get a specific group by ID for the logged-in user
exports.getGroupById = async (req, res) => {
    const groupId = req.params.id; // Retrieve the group ID from the request parameters
  
    try {
      // Find the group by its ID and check if it belongs to the logged-in user
      const group = await Group.findOne({ _id: groupId, user: req.user._id });
  
      // If the group is not found or doesn't belong to the user, return an error
      if (!group) {
        return res.status(404).json({ message: 'Group not found or unauthorized' });
      }
  
      // If the group is found, return the group details in the response
      res.status(200).json(group);
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };
  



 

// Update group name or description
exports.updateGroup = async (req, res) => {
  const groupId = req.params.id;
  const { name, description } = req.body;

  try {
    const group = await Group.findOne({ _id: groupId, user: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or unauthorized' });
    }

    if (name !== undefined) group.name = name;
    if (description !== undefined) group.description = description;

    await group.save();

    res.status(200).json({ message: 'Group updated successfully', group });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Delete a group and its associated tasks
exports.deleteGroup = async (req, res) => {
  const groupId = req.params.id;

  try {
    // Check if the group exists and belongs to the user
    const group = await Group.findOneAndDelete({ _id: groupId, user: req.user._id });

    if (!group) {
      return res.status(404).json({ message: 'Group not found or unauthorized' });
    }

    // Delete all tasks that belong to this group
    await deleteTasksByGroup(groupId); // Call task deletion helper

    res.status(200).json({ message: 'Group and associated tasks deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

