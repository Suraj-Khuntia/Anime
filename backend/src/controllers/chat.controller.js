const { generateAnimeReply } = require('../services/chat.service');

/**
 * Handle incoming chat message request
 * POST /api/chat
 */
const handleChat = async (req, res, next) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'messages array is required and must not be empty.',
      });
    }

    const reply = await generateAnimeReply(messages);

    return res.json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error('[ChatController] Error processing message:', error.message);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process chat message with AniBot.',
    });
  }
};

module.exports = {
  handleChat,
};
