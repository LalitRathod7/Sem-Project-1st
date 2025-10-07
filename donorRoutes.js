const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  registerDonor,
  getDonorProfile,
  updateAvailability,
  getAvailableRequests
} = require('../controllers/donorController');

// Register donor (public)
router.post('/register', registerDonor);

// Protected routes (require authentication)
router.use(authenticateToken);

// Get donor profile
router.get('/profile', authorizeRoles('donor'), getDonorProfile);

// Update donor availability
router.put('/availability', authorizeRoles('donor'), updateAvailability);

// Get available blood requests for donor
router.get('/requests', authorizeRoles('donor'), getAvailableRequests);

module.exports = router;
