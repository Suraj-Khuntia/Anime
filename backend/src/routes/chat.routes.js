const express = require('express');
const router = express.Router();
const { handleChat } = require('../controllers/chat.controller');

// POST /api/chat - Interact with AniBot AI
router.post('/', handleChat);

module.exports = router;
