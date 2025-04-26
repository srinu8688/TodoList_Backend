
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskName: {
    type: String,
    required: true,
  },
  description:{
      type: String,
      default: ''
  },
  dueDate: {
    type: Date,
    required: true,
  },
  completionStatus: {
    type: String,
    enum: ['incomplete', 'complete', 'abandoned', 'failed'],
    default: 'incomplete',
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = Task;

