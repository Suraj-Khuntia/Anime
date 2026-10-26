const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Public read settings (for banner, accessibility, playlists, etc.)
router.get('/', settingsController.getSettings);

// Protected update and reset settings
router.put('/', verifyAdmin, settingsController.updateSettings);
router.post('/reset', verifyAdmin, settingsController.resetSettings);

module.exports = router;
