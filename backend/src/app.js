require('dotenv').config();
const express = require('express');
const cors = require('cors');
const animeRoutes = require('./routes/anime.routes');
const genreRoutes = require('./routes/genre.routes');
const syncRoutes = require('./routes/sync.routes');
const authRoutes = require('./routes/auth.routes');
const errorHandler = require('./middleware/errorHandler');
const { initSyncCron } = require('./jobs/syncCron');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.url}`);
    next();
  });
}

// Root welcome endpoint
app.get('/', (req, res) => {
  res.json({
    message: '🚀 AniPulse Backend API is running successfully!',
    endpoints: {
      health: '/api/health',
      anime: '/api/anime',
      trending: '/api/anime/trending',
      genres: '/api/genres',
    },
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/anime', animeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/sync', syncRoutes);

// Error Handling Middleware
app.use(errorHandler);

// Start server if run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Anime API server running on http://localhost:${PORT}`);
    // Initialize background sync job
    initSyncCron();
  });
}

module.exports = app;
