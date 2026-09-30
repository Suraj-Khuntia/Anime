# AniPulse — Anime Discovery Web Application

A modern, responsive full-stack anime discovery web application built with **React, Node.js/Express, Prisma ORM, and SQLite / PostgreSQL**, styled with **Tailwind CSS** and animated with **Framer Motion**.

---

## Features

- ✨ **Hero Spotlight Carousel:** Auto-rotating featured anime with high-resolution poster backdrop, ratings, Japanese & English titles, and instant trailer playback.
- 🔍 **Live Search & Autocomplete:** Real-time debounced search bar with instant dropdown preview and dedicated search page.
- 🗂️ **Comprehensive Catalog & Filters:** Filter anime by genre, media format (TV, Movie, ONA, OVA), airing status (Airing, Completed, Upcoming), and sorting options (Score, Title, Release date).
- 🎬 **Video Trailer Modal:** Embedded high-definition YouTube trailers.
- 📖 **Rich Anime Detail Pages:** Full synopsis, metadata breakdown (episodes, status, MAL score, release date, external MAL link), and dynamic recommendations.
- 🏷️ **Dynamic Genre Pages:** Dedicated pages for exploring any anime genre.
- 🔄 **Hybrid Data Sourcing (Jikan API Sync):** Scheduled background sync job (`node-cron`) + manual trigger endpoint to synchronize the database with the official Jikan / MyAnimeList API.
- 🎨 **Polish & UX:** Shimmer skeleton cards, glassmorphism UI, custom scrollbars, and Framer Motion staggered animations.

---

## Project Structure

```
anime/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Prisma schema (Anime, Genre, AnimeGenre, SyncLog)
│   │   ├── seed.js              # Database seed script
│   │   └── client.js            # Prisma client instance
│   ├── src/
│   │   ├── controllers/         # anime.controller.js, genre.controller.js
│   │   ├── routes/              # anime.routes.js, genre.routes.js, sync.routes.js
│   │   ├── services/            # anime.service.js, syncService.js (Jikan API)
│   │   ├── jobs/                # syncCron.js (node-cron job)
│   │   ├── middleware/          # errorHandler.js
│   │   └── app.js               # Express application entry
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/          # Navbar, Footer, SearchBar, AnimeCard, HeroBanner, TrailerModal, FilterBar, SkeletonCard
│   │   ├── pages/               # Home, Browse, Search, AnimeDetail, GenrePage
│   │   ├── hooks/               # useDebounce, useAnimeList
│   │   ├── services/            # api.js (Axios client)
│   │   ├── context/             # FilterContext.jsx
│   │   └── App.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
└── README.md
```

---

## Quick Start Guide

### 1. Start the Backend API
Open a terminal in `backend/`:
```bash
cd backend
npm install
npx prisma generate
npx prisma db push
node prisma/seed.js
npm start
```
The API server will run at: **`http://localhost:5000`**

### 2. Start the Frontend
Open a terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
The application will run at: **`http://localhost:3000`**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/anime` | List anime with filters (`?search=`, `?genre=`, `?type=`, `?status=`, `?sort=`, `?page=`, `?limit=`) |
| GET | `/api/anime/:id` | Full details for an anime including recommendations |
| GET | `/api/anime/trending` | Top scored & airing spotlight anime |
| GET | `/api/genres` | List all genres with anime count |
| POST | `/api/sync` | Manually trigger sync with Jikan / MyAnimeList API |
| GET | `/api/sync/logs` | View history of data sync runs |
