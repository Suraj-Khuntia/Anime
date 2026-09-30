const cron = require('node-cron');
const syncService = require('../services/syncService');

/**
 * Initializes scheduled sync cron job.
 * Default: runs every 6 hours
 */
function initSyncCron() {
  // Run every 6 hours
  cron.schedule('0 */6 * * *', async () => {
    console.log('[SyncCron] Starting scheduled anime sync...');
    try {
      await syncService.syncAnimeData();
      console.log('[SyncCron] Scheduled anime sync completed.');
    } catch (err) {
      console.error('[SyncCron] Scheduled anime sync failed:', err.message);
    }
  });

  console.log('[SyncCron] Sync cron job initialized (runs every 6 hours).');
}

module.exports = {
  initSyncCron,
};
