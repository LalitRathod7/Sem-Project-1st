const express = require('express');
const router = express.Router();
const { authenticateToken, authorizeRoles } = require('../middleware/auth');
const {
  registerBloodBank,
  getBloodBankProfile,
  addInventory,
  getInventory,
  updateInventory,
  getAllRequests,
  fulfillRequest,
  getLowStockAlerts
} = require('../controllers/bloodBankController');

// Register blood bank (public)
router.post('/register', registerBloodBank);

// Protected routes (require authentication)
router.use(authenticateToken);

// Get blood bank profile
router.get('/profile', authorizeRoles('blood_bank'), getBloodBankProfile);

// Inventory management
router.post('/inventory', authorizeRoles('blood_bank'), addInventory);
router.get('/inventory', authorizeRoles('blood_bank'), getInventory);
router.put('/inventory', authorizeRoles('blood_bank'), updateInventory);

// Blood requests management
router.get('/requests', authorizeRoles('blood_bank'), getAllRequests);
router.put('/requests/:requestId/fulfill', authorizeRoles('blood_bank'), fulfillRequest);

// Alerts
router.get('/alerts/low-stock', authorizeRoles('blood_bank'), getLowStockAlerts);

module.exports = router;
