const animeService = require('../services/anime.service');

async function getAnimeList(req, res, next) {
  try {
    const { search, genre, type, status, page, limit, sort } = req.query;
    const result = await animeService.getAnimeList({
      search,
      genre,
      type,
      status,
      page,
      limit,
      sort,
    });
    return res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

async function getAnimeById(req, res, next) {
  try {
    const { id } = req.params;
    const anime = await animeService.getAnimeById(id);
    if (!anime) {
      return res.status(404).json({
        success: false,
        message: `Anime with id ${id} not found`,
      });
    }
    return res.json({
      success: true,
      data: anime,
    });
  } catch (error) {
    next(error);
  }
}

async function createAnime(req, res, next) {
  try {
    const newAnime = await animeService.createAnime(req.body);
    return res.status(201).json({
      success: true,
      message: 'Anime created successfully',
      data: newAnime,
    });
  } catch (error) {
    next(error);
  }
}

async function updateAnime(req, res, next) {
  try {
    const { id } = req.params;
    const updated = await animeService.updateAnime(id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Anime with id ${id} not found`,
      });
    }
    return res.json({
      success: true,
      message: 'Anime updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteAnime(req, res, next) {
  try {
    const { id } = req.params;
    await animeService.deleteAnime(id);
    return res.json({
      success: true,
      message: `Anime with id ${id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

async function getAnimeEpisodes(req, res, next) {
  try {
    const { id } = req.params;
    const episodes = await animeService.getAnimeEpisodes(id);
    return res.json({
      success: true,
      data: episodes,
      total: episodes.length,
    });
  } catch (error) {
    next(error);
  }
}

async function getEpisode(req, res, next) {
  try {
    const { id, episodeNumber } = req.params;
    const episode = await animeService.getEpisode(id, episodeNumber);
    if (!episode) {
      return res.status(404).json({
        success: false,
        message: `Episode ${episodeNumber} for anime ${id} not found`,
      });
    }
    return res.json({
      success: true,
      data: episode,
    });
  } catch (error) {
    next(error);
  }
}

async function createEpisode(req, res, next) {
  try {
    const { id } = req.params;
    const created = await animeService.createEpisode(id, req.body);
    return res.status(201).json({
      success: true,
      message: 'Episode created successfully',
      data: created,
    });
  } catch (error) {
    next(error);
  }
}

async function updateEpisode(req, res, next) {
  try {
    const { id, episodeNumber } = req.params;
    const updated = await animeService.updateEpisode(id, episodeNumber, req.body);
    return res.json({
      success: true,
      message: 'Episode updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteEpisode(req, res, next) {
  try {
    const { id, episodeNumber } = req.params;
    await animeService.deleteEpisode(id, episodeNumber);
    return res.json({
      success: true,
      message: `Episode ${episodeNumber} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
}

async function getAdminStats(req, res, next) {
  try {
    const stats = await animeService.getAdminStats();
    return res.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    next(error);
  }
}

async function getTrending(req, res, next) {
  try {
    const limit = req.query.limit || 10;
    const trending = await animeService.getTrendingAnime(limit);
    return res.json({
      success: true,
      data: trending,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAnimeList,
  getAnimeById,
  createAnime,
  updateAnime,
  deleteAnime,
  getAnimeEpisodes,
  getEpisode,
  createEpisode,
  updateEpisode,
  deleteEpisode,
  getAdminStats,
  getTrending,
};
