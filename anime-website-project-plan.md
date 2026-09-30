# Anime Discovery Website — Technical Project Document

## 1. Project Overview

A modern, responsive web application where users can **discover, search, and explore** anime series and movies. Scope for this phase is **discovery-focused** (browse, search, filter, view details) — no authentication or user accounts yet. Architecture is designed so auth, watchlists, and ratings can be added later without rework.

| | |
|---|---|
| **Frontend** | React.js |
| **Backend** | Node.js + Express.js |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Data Source** | Hybrid — external anime API (e.g. Jikan / MyAnimeList) synced into our own DB |
| **Animation** | Framer Motion (+ CSS transitions) |

---

## 2. Why Hybrid Data Sourcing?

Calling a third-party API directly on every request is slow, rate-limited, and fragile. Instead:

- A **sync service** periodically pulls anime data (titles, synopsis, genres, images, episodes, ratings) from the external API.
- Data is **normalized and cached** in our own PostgreSQL database via Prisma.
- The frontend **never calls the third-party API directly** — it always hits our own Express API, which reads from Postgres.
- This gives us fast search/filter (via SQL/indexes), no rate-limit issues for users, and full control over the schema — while the DB stays ready for future user-specific tables (favorites, watchlists, accounts) without touching the sync logic.

**Sync strategy:** a scheduled job (cron via `node-cron` or a queue like BullMQ) runs on an interval (e.g. every 6–12 hrs) to fetch new/updated anime and upsert into Postgres.

---

## 3. High-Level Architecture

```
┌─────────────┐      REST API       ┌──────────────────┐      Prisma       ┌──────────────┐
│   React     │ ───────────────────▶│  Node/Express API │ ─────────────────▶│  PostgreSQL   │
│  (Frontend) │◀─────────────────── │   (Backend)        │◀───────────────── │   Database    │
└─────────────┘      JSON            └──────────────────┘                    └──────────────┘
                                              │
                                              │ scheduled sync job
                                              ▼
                                     ┌──────────────────┐
                                     │ External Anime API│
                                     │ (Jikan / MAL, etc)│
                                     └──────────────────┘
```

---

## 4. Database Schema (Prisma)

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Anime {
  id            Int       @id @default(autoincrement())
  externalId    Int       @unique   // ID from the external API, for re-sync/upsert
  title         String
  titleEnglish  String?
  synopsis      String?
  type          String?   // TV, Movie, OVA, etc.
  episodes      Int?
  status        String?   // Airing, Completed, Upcoming
  score         Float?
  imageUrl      String?
  trailerUrl    String?
  releaseDate   DateTime?
  genres        AnimeGenre[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@index([title])
  @@index([status])
}

model Genre {
  id     Int          @id @default(autoincrement())
  name   String       @unique
  anime  AnimeGenre[]
}

model AnimeGenre {
  anime    Anime @relation(fields: [animeId], references: [id])
  animeId  Int
  genre    Genre @relation(fields: [genreId], references: [id])
  genreId  Int

  @@id([animeId, genreId])
}

model SyncLog {
  id         Int      @id @default(autoincrement())
  runAt      DateTime @default(now())
  status     String   // success, failed
  itemsSynced Int?
  message    String?
}
```

> **Future-ready:** when auth/watchlists are added, `User`, `Favorite`, and `Review` models can be introduced and simply relate to `Anime` by `id` — no changes needed to the models above.

---

## 5. Backend API Endpoints (REST)

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/anime` | List anime — supports `?search=`, `?genre=`, `?type=`, `?status=`, `?page=`, `?limit=` |
| GET | `/api/anime/:id` | Get full details for one anime |
| GET | `/api/genres` | List all genres (for filter dropdown) |
| GET | `/api/anime/trending` | Curated/trending list (top scored, currently airing) |
| POST | `/api/sync` | (internal/admin only) manually trigger a data sync |

**Search/filter** is done via Prisma queries against Postgres (e.g. `contains` for title search, `where` clauses for genre/type/status), with pagination for performance.

---

## 6. Backend Folder Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── anime.controller.js
│   │   └── genre.controller.js
│   ├── routes/
│   │   ├── anime.routes.js
│   │   └── genre.routes.js
│   ├── services/
│   │   ├── anime.service.js
│   │   └── syncService.js       # pulls from external API, upserts via Prisma
│   ├── jobs/
│   │   └── syncCron.js
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── prisma/
│   │   └── client.js
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── .env
└── package.json
```

---

## 7. Frontend Structure & Pages

| Page | Purpose |
|---|---|
| `/` Home | Hero/banner, trending carousel, genre highlights |
| `/browse` | Grid of anime with filters (genre, type, status) + pagination/infinite scroll |
| `/search` | Live search results |
| `/anime/:id` | Detail page — synopsis, trailer, episodes, score, related anime |
| `/genres/:name` | Anime filtered by a specific genre |

### Frontend Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Navbar, Footer, Loader, SearchBar
│   │   ├── anime/           # AnimeCard, AnimeGrid, AnimeDetailHero
│   │   └── animations/      # PageTransition, FadeIn, CardHover wrappers
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Browse.jsx
│   │   ├── Search.jsx
│   │   ├── AnimeDetail.jsx
│   │   └── GenrePage.jsx
│   ├── hooks/
│   │   ├── useAnimeList.js
│   │   └── useDebounce.js     # for search input
│   ├── services/
│   │   └── api.js             # axios instance, calls backend REST API
│   ├── context/
│   │   └── FilterContext.jsx
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

## 8. Animations & UX Polish

Using **Framer Motion** as the primary animation library (lightweight, React-native, great performance):

- **Page transitions** — fade/slide between routes using `AnimatePresence`.
- **Card hover effects** — scale-up + shadow on anime cards in grids (`whileHover`).
- **Staggered grid entrance** — anime cards fade/slide in with a staggered delay as the grid loads.
- **Skeleton loaders** — animated shimmer placeholders while API data loads (better perceived performance than spinners).
- **Hero banner carousel** — auto-playing crossfade/slide for trending anime on the home page.
- **Search bar** — animated expand/focus state, debounced live results fading in.
- **Scroll-triggered reveals** — sections animate into view on scroll (`useInView` from Framer Motion) for landing/browse pages.
- **Micro-interactions** — button press feedback, filter chip selection animation.

Tailwind CSS is recommended alongside Framer Motion for fast, consistent responsive styling (mobile-first breakpoints).

---

## 9. Non-Functional Requirements

- **Responsiveness:** mobile-first, breakpoints for tablet/desktop (Tailwind `sm/md/lg/xl`).
- **Performance:** paginated/infinite-scroll lists, image lazy-loading, indexed DB queries on `title` and `status`.
- **Caching:** consider Redis later for hot endpoints (`/trending`) if traffic grows.
- **Error handling:** centralized Express error middleware; graceful fallback UI on the frontend for failed requests.
- **Rate limiting:** protect the sync endpoint and general API from abuse.

---

## 10. Suggested Build Order

1. Set up Postgres + Prisma schema + migrations.
2. Build the sync service and run an initial data import.
3. Build core Express REST endpoints (list, detail, genres, trending).
4. Scaffold React app, routing, and API service layer.
5. Build Browse/Search/Detail pages with static data first.
6. Wire real API data in, add loading/error states.
7. Layer in Framer Motion animations last, once functionality is stable.

---

## 11. Future Enhancements (Out of Current Scope)

- User accounts (auth), watchlist/favorites, personal ratings & reviews.
- Comments/discussion per anime.
- Personalized recommendations.
- Admin dashboard for managing sync/content.

