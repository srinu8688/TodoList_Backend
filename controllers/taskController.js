

  
  const mongoose = require('mongoose');
  const Task = require('../models/Task');
  const Group = require('../models/Group');
  
  // Create a new task
  exports.createTask = async (req, res) => {
    const { taskName, dueDate, completionStatus, description } = req.body;
    const groupId = req.params.groupId;
  
    try {
      // Validate groupId
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
  
      // Validate group exists and belongs to the user
      const group = await Group.findOne({ _id: groupId, user: req.user._id });
      if (!group) {
        return res.status(404).json({ message: 'Group not found or unauthorized' });
      }
  
      // Validate required fields
      if (!taskName || !dueDate) {
        return res.status(400).json({ message: 'Task name and due date are required' });
      }
  
      // Validate completionStatus
      const validStatuses = ['incomplete', 'complete', 'abandoned', 'failed'];
      if (completionStatus && !validStatuses.includes(completionStatus)) {
        return res.status(400).json({ message: `Invalid completionStatus. Must be one of: ${validStatuses.join(', ')}` });
      }
  
      const newTask = new Task({
        taskName,
        dueDate: new Date(dueDate), // Ensure dueDate is a Date object
        completionStatus: completionStatus || 'incomplete', // Default to 'incomplete'
        description: description || '', // Default to empty string
        groupId,
        userId: req.user._id,
      });
  
      await newTask.save();
      res.status(201).json(newTask);
    } catch (err) {
      console.error('Create task error:', {
        message: err.message,
        stack: err.stack,
        requestBody: req.body,
        groupId,
      });
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };
  
  // Get tasks by group ID
  exports.getTasksByGroup = async (req, res) => {
    const { groupId } = req.params;
  
    try {
      // Validate groupId
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        return res.status(400).json({ message: 'Invalid group ID' });
      }
  
      // Verify group belongs to the user
      const group = await Group.findOne({ _id: groupId, user: req.user._id });
      if (!group) {
        return res.status(404).json({ message: 'Group not found or unauthorized' });
      }
  
      const tasks = await Task.find({ groupId });
      res.status(200).json(tasks);
    } catch (err) {
      console.error('Get tasks error:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };
  
  // Delete a task
  exports.deleteTask = async (req, res) => {
    const taskId = req.params.id;
  
    try {
      const task = await Task.findOneAndDelete({ _id: taskId, userId: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }
  
      res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
      console.error('Delete task error:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };
  
  // Update a task
  exports.updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { taskName, dueDate, completionStatus, description } = req.body;
  
    try {
      const task = await Task.findOne({ _id: taskId, userId: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized - or unauthorized' });
      }
  
      if (taskName !== undefined) task.taskName = taskName;
      if (dueDate !== undefined) task.dueDate = new Date(dueDate);
      if (completionStatus !== undefined) {
        const validStatuses = ['incomplete', 'complete', 'abandoned', 'failed'];
        if (!validStatuses.includes(completionStatus)) {
          return res.status(400).json({ message: `Invalid completionStatus. Must be one of: ${validStatuses.join(', ')}` });
        }
        task.completionStatus = completionStatus;
      }
      if (description !== undefined) task.description = description;
  
      await task.save();
  
      res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
      console.error('Update task error:', err.message);
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };
  
  // Delete tasks by group ID
  exports.deleteTasksByGroup = async (groupId) => {
    try {
      if (!mongoose.Types.ObjectId.isValid(groupId)) {
        console.error('Invalid groupId passed');
        return;
      }
  
      const result = await Task.deleteMany({ groupId: new mongoose.Types.ObjectId(groupId) });
      console.log(`${result.deletedCount} tasks deleted for groupId: ${groupId}`);
    } catch (err) {
      console.error('Error deleting tasks by group:', err.message);
    }
  };