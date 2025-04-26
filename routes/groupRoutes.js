const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  createGroup,
  getGroups,
  updateGroup,
  getGroupById,
  deleteGroup
} = require('../controllers/groupController');

// All routes require authentication
router.post('/', authMiddleware, createGroup);       // Create a group
router.get('/', authMiddleware, getGroups);          // Get all groups for user
router.get('/:id', authMiddleware, getGroupById); 

router.put('/:id', authMiddleware, updateGroup);     // Update a group by ID
router.delete('/:id', authMiddleware, deleteGroup);  // Delete a group by ID
module.exports = router;
