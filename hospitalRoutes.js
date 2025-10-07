const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  registerHospital,
  getHospitalProfile,
  createBloodRequest,
  getBloodRequests
} = require('../controllers/hospitalController');

// Register hospital (public)
router.post('/register', registerHospital);

// Protected routes (require authentication)
router.use(authenticateToken);

// Get hospital profile
router.get('/profile', authorizeRoles('hospital'), getHospitalProfile);

// Create blood request
router.post('/blood-requests', authorizeRoles('hospital'), createBloodRequest);

// Get blood requests for hospital
router.get('/blood-requests', authorizeRoles('hospital'), getBloodRequests);

module.exports = router;
