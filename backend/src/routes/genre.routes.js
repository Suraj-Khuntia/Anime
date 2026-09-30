const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');
const { verifyAdmin } = require('../middleware/auth.middleware');

router.get('/', genreController.getGenres);
router.post('/', verifyAdmin, genreController.createGenre);
router.put('/:id', verifyAdmin, genreController.updateGenre);
router.delete('/:id', verifyAdmin, genreController.deleteGenre);

module.exports = router;
