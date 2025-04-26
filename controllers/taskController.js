
const mongoose = require('mongoose');
const Task = require('../models/Task');
const Group = require('../models/Group');

// Create a new task
exports.createTask = async (req, res) => {
  const { taskName, dueDate, completionStatus,description } = req.body;
  const groupId = req.params.groupId;

  try {
    const newTask = new Task({
      taskName,
      dueDate,
      completionStatus,
      description,
      groupId,
      userId: req.user._id,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get tasks by group ID
exports.getTasksByGroup = async (req, res) => {
  const { groupId } = req.params;

  try {
    const tasks = await Task.find({ groupId });
    res.status(200).json(tasks);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server Error' });
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
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };

  exports.updateTask = async (req, res) => {
    const taskId = req.params.id;
    const { taskName, dueDate, completionStatus,description } = req.body;
  
    try {
      const task = await Task.findOne({ _id: taskId, userId: req.user._id });
  
      if (!task) {
        return res.status(404).json({ message: 'Task not found or unauthorized' });
      }
  
      if (taskName !== undefined) task.taskName = taskName;
      if (dueDate !== undefined) task.dueDate = dueDate;
      if (completionStatus !== undefined) task.completionStatus = completionStatus;
      if (description !== undefined) task.description = description;
  
      await task.save();
  
      res.status(200).json({ message: 'Task updated successfully', task });
    } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: 'Server Error' });
    }
  };


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


  
  