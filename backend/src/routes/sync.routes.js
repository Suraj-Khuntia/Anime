const express = require('express');
const router = express.Router();
const syncService = require('../services/syncService');
const prisma = require('../prisma/client');
const { verifyAdmin } = require('../middleware/auth.middleware');

// POST /api/sync - trigger manual sync (protected)
router.post('/', verifyAdmin, async (req, res, next) => {
  try {
    const result = await syncService.syncAnimeData();
    res.json({
      success: true,
      message: 'Sync completed successfully',
      result,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/sync/logs - view sync history
router.get('/logs', async (req, res, next) => {
  try {
    const logs = await prisma.syncLog.findMany({
      take: 20,
      orderBy: { runAt: 'desc' },
    });
    res.json({
      success: true,
      data: logs,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
