const animeService = require('../services/anime.service');

async function getGenres(req, res, next) {
  try {
    const genres = await animeService.getGenresList();
    return res.json({
      success: true,
      data: genres,
    });
  } catch (error) {
    next(error);
  }
}

async function createGenre(req, res, next) {
  try {
    const { name } = req.body;
    const genre = await animeService.createGenre(name);
    return res.status(201).json({
      success: true,
      message: 'Genre created successfully',
      data: genre,
    });
  } catch (error) {
    next(error);
  }
}

async function updateGenre(req, res, next) {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const genre = await animeService.updateGenre(id, name);
    return res.json({
      success: true,
      message: 'Genre updated successfully',
      data: genre,
    });
  } catch (error) {
    next(error);
  }
}

async function deleteGenre(req, res, next) {
  try {
    const { id } = req.params;
    await animeService.deleteGenre(id);
    return res.json({
      success: true,
      message: 'Genre deleted successfully',
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getGenres,
  createGenre,
  updateGenre,
  deleteGenre,
};
