const axios = require('axios');
const prisma = require('../prisma/client');

/**
 * Normalizes Jikan API status to a clean status string
 */
function normalizeStatus(jikanStatus) {
  if (!jikanStatus) return 'Unknown';
  const lower = jikanStatus.toLowerCase();
  if (lower.includes('currently') || lower.includes('airing')) return 'Airing';
  if (lower.includes('finished') || lower.includes('completed')) return 'Completed';
  if (lower.includes('not yet') || lower.includes('upcoming')) return 'Upcoming';
  return jikanStatus;
}

/**
 * Syncs anime data from Jikan API into the database
 */
async function syncAnimeData() {
  let itemsSynced = 0;
  const errors = [];

  try {
    console.log('[SyncService] Starting anime sync from Jikan API...');

    // Fetch top anime and current seasonal anime
    const endpoints = [
      'https://api.jikan.moe/v4/top/anime?limit=25',
      'https://api.jikan.moe/v4/seasons/now?limit=25'
    ];

    const allAnimeList = [];
    const seenExternalIds = new Set();

    for (const url of endpoints) {
      try {
        console.log(`[SyncService] Fetching from ${url}`);
        const response = await axios.get(url, {
          timeout: 10000,
          headers: { 'User-Agent': 'AnimeDiscoveryApp/1.0' }
        });

        if (response.data && Array.isArray(response.data.data)) {
          for (const item of response.data.data) {
            if (!seenExternalIds.has(item.mal_id)) {
              seenExternalIds.add(item.mal_id);
              allAnimeList.push(item);
            }
          }
        }
        // Small delay to prevent Jikan rate limiting (3 req/sec)
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (err) {
        console.warn(`[SyncService] Failed to fetch from ${url}:`, err.message);
        errors.push(err.message);
      }
    }

    // Process and upsert each anime
    for (const item of allAnimeList) {
      try {
        const externalId = item.mal_id;
        const title = item.title || item.title_english || 'Untitled';
        const titleEnglish = item.title_english || null;
        const synopsis = item.synopsis || null;
        const type = item.type || 'TV';
        const episodes = typeof item.episodes === 'number' ? item.episodes : null;
        const status = normalizeStatus(item.status);
        const score = typeof item.score === 'number' ? item.score : null;
        const imageUrl = item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || null;
        const trailerUrl = item.trailer?.embed_url || item.trailer?.url || null;
        const releaseDate = item.aired?.from ? new Date(item.aired.from) : null;

        // Upsert Anime
        const anime = await prisma.anime.upsert({
          where: { externalId },
          update: {
            title,
            titleEnglish,
            synopsis,
            type,
            episodes,
            status,
            score,
            imageUrl,
            trailerUrl,
            releaseDate,
          },
          create: {
            externalId,
            title,
            titleEnglish,
            synopsis,
            type,
            episodes,
            status,
            score,
            imageUrl,
            trailerUrl,
            releaseDate,
          },
        });

        // Handle Genres
        const genres = Array.isArray(item.genres) ? item.genres : [];
        for (const g of genres) {
          if (!g.name) continue;
          const genreRecord = await prisma.genre.upsert({
            where: { name: g.name },
            update: {},
            create: { name: g.name },
          });

          await prisma.animeGenre.upsert({
            where: {
              animeId_genreId: {
                animeId: anime.id,
                genreId: genreRecord.id,
              },
            },
            update: {},
            create: {
              animeId: anime.id,
              genreId: genreRecord.id,
            },
          });
        }

        itemsSynced++;
      } catch (upsertErr) {
        console.error(`[SyncService] Failed to upsert anime ${item.mal_id}:`, upsertErr.message);
        errors.push(`ID ${item.mal_id}: ${upsertErr.message}`);
      }
    }

    const logEntry = await prisma.syncLog.create({
      data: {
        status: itemsSynced > 0 ? 'success' : 'failed',
        itemsSynced,
        message: itemsSynced > 0
          ? `Successfully synced ${itemsSynced} anime items.`
          : `Failed sync. Errors: ${errors.join(', ')}`,
      },
    });

    console.log(`[SyncService] Sync finished: ${itemsSynced} items processed.`);
    return { success: itemsSynced > 0, itemsSynced, log: logEntry };
  } catch (error) {
    console.error('[SyncService] Fatal sync error:', error);
    await prisma.syncLog.create({
      data: {
        status: 'failed',
        itemsSynced: 0,
        message: error.message,
      },
    });
    throw error;
  }
}

module.exports = {
  syncAnimeData,
  normalizeStatus,
};
