const express = require('express');
const router = express.Router();
const BloodInventory = require('../models/BloodInventory');
const BloodRequest = require('../models/BloodRequest');

// Search blood availability
router.get('/blood-search', async (req, res) => {
  try {
    const { blood_type, location } = req.query;

    if (!blood_type) {
      return res.status(400).json({ message: 'Blood type is required' });
    }

    const available = await BloodInventory.getTotalByType(blood_type);
    const canFulfill = await BloodInventory.checkAvailability(blood_type, 1); // Check for at least 1 unit

    return res.json({
      blood_type,
      total_available: available,
      available: canFulfill,
      location: location || 'All locations'
    });
  } catch (error) {
    console.error('Blood search error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get critical requests
router.get('/critical-requests', async (req, res) => {
  try {
    const requests = await BloodRequest.findCriticalRequests();
    return res.json(requests);
  } catch (error) {
    console.error('Get critical requests error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Get system statistics
router.get('/stats', async (req, res) => {
  try {
    // This would typically aggregate data from multiple tables
    // For now, return basic stats
    const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const stats = {};

    for (const type of bloodTypes) {
      stats[type] = await BloodInventory.getTotalByType(type);
    }

    const criticalRequests = await BloodRequest.findCriticalRequests();

    return res.json({
      blood_inventory: stats,
      critical_requests_count: criticalRequests.length,
      total_requests: await BloodRequest.findAll().then(r => r.length)
    });
  } catch (error) {
    console.error('Get stats error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
