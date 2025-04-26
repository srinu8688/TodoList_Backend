const express = require('express');
const router = express.Router();
const { register, login,updateProfile,deleteUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.put('/updateProfile',authMiddleware,updateProfile);
router.delete('/deleteUser',authMiddleware,deleteUser);

module.exports = router;
