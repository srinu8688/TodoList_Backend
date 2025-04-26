const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { createTask, getTasksByGroup, updateTask, deleteTask,deleteTasksByGroup } = require('../controllers/taskController');

router.post('/group/:groupId', authMiddleware, createTask);
router.get('/:groupId', authMiddleware, getTasksByGroup);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

module.exports = router;

