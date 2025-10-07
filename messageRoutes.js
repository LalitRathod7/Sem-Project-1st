const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/auth');

// Send a message
router.post('/', authMiddleware, messageController.sendMessage);

// Get messages between two users
router.get('/:user1/:user2', authMiddleware, messageController.getMessages);

// Mark message as read
router.put('/read/:id', authMiddleware, messageController.markAsRead);

module.exports = router;
