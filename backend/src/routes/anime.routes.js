const express = require('express');
const router = express.Router();
const animeController = require('../controllers/anime.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

// Admin stats endpoint (must be defined before /:id)
router.get('/admin/stats', verifyAdmin, animeController.getAdminStats);

// Trending endpoint (must be defined before /:id)
router.get('/trending', animeController.getTrending);

// Public list anime
router.get('/', animeController.getAnimeList);

// Protected create anime
router.post('/', verifyAdmin, animeController.createAnime);

// Episode routes for a specific anime (public read, protected write)
router.get('/:id/episodes', animeController.getAnimeEpisodes);
router.post('/:id/episodes', verifyAdmin, animeController.createEpisode);
router.get('/:id/episodes/:episodeNumber', animeController.getEpisode);
router.put('/:id/episodes/:episodeNumber', verifyAdmin, animeController.updateEpisode);
router.delete('/:id/episodes/:episodeNumber', verifyAdmin, animeController.deleteEpisode);

// Single anime routes (public read, protected write)
router.get('/:id', animeController.getAnimeById);
router.put('/:id', verifyAdmin, animeController.updateAnime);
router.delete('/:id', verifyAdmin, animeController.deleteAnime);

module.exports = router;
