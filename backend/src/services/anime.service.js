const prisma = require('../prisma/client');

/**
 * Get paginated & filtered anime list
 */
async function getAnimeList({
  search,
  genre,
  type,
  status,
  page = 1,
  limit = 20,
  sort = 'score_desc',
}) {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const where = {};

  if (search && search.trim() !== '') {
    const q = search.trim();
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { titleEnglish: { contains: q, mode: 'insensitive' } },
      { synopsis: { contains: q, mode: 'insensitive' } },
    ];
  }

  if (genre && genre.trim() !== '' && genre.toLowerCase() !== 'all') {
    where.genres = {
      some: {
        genre: {
          name: {
            equals: genre.trim(),
            mode: 'insensitive',
          },
        },
      },
    };
  }

  if (type && type.trim() !== '' && type.toLowerCase() !== 'all') {
    where.type = { equals: type.trim(), mode: 'insensitive' };
  }

  if (status && status.trim() !== '' && status.toLowerCase() !== 'all') {
    where.status = { equals: status.trim(), mode: 'insensitive' };
  }

  // Sorting
  let orderBy = { score: 'desc' };
  if (sort === 'score_asc') orderBy = { score: 'asc' };
  else if (sort === 'score_desc') orderBy = { score: 'desc' };
  else if (sort === 'title_asc') orderBy = { title: 'asc' };
  else if (sort === 'title_desc') orderBy = { title: 'desc' };
  else if (sort === 'release_desc') orderBy = { releaseDate: 'desc' };
  else if (sort === 'release_asc') orderBy = { releaseDate: 'asc' };

  const [total, animes] = await Promise.all([
    prisma.anime.count({ where }),
    prisma.anime.findMany({
      where,
      skip,
      take: limitNum,
      orderBy,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        _count: {
          select: { episodesList: true },
        },
      },
    }),
  ]);

  // Flatten genres & episode counts
  const formattedAnimes = animes.map((item) => ({
    ...item,
    genres: item.genres.map((ag) => ag.genre.name),
    episodesAvailable: item._count.episodesList,
  }));

  return {
    data: formattedAnimes,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
}

/**
 * Get anime by ID with related suggestions and full episodes list
 */
async function getAnimeById(id) {
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) return null;

  const anime = await prisma.anime.findUnique({
    where: { id: animeId },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      episodesList: {
        orderBy: { episodeNumber: 'asc' },
      },
    },
  });

  if (!anime) return null;

  const genreNames = anime.genres.map((ag) => ag.genre.name);

  // Fetch related anime sharing any of the same genres
  const related = await prisma.anime.findMany({
    where: {
      id: { not: animeId },
      genres: {
        some: {
          genre: {
            name: { in: genreNames },
          },
        },
      },
    },
    take: 6,
    orderBy: { score: 'desc' },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  return {
    ...anime,
    genres: genreNames,
    episodes: anime.episodesList,
    totalEpisodesAvailable: anime.episodesList.length,
    related: related.map((r) => ({
      ...r,
      genres: r.genres.map((ag) => ag.genre.name),
    })),
  };
}

/**
 * Create a new anime
 */
async function createAnime(data) {
  const { genres = [], ...animeData } = data;

  // Generate unique externalId if not provided
  let externalId = animeData.externalId ? parseInt(animeData.externalId, 10) : null;
  if (!externalId) {
    const maxAnime = await prisma.anime.findFirst({
      orderBy: { externalId: 'desc' },
      select: { externalId: true },
    });
    externalId = (maxAnime?.externalId || 100000) + 1;
  }

  const releaseDate = animeData.releaseDate ? new Date(animeData.releaseDate) : null;
  const score = animeData.score ? parseFloat(animeData.score) : null;
  const episodes = animeData.episodes ? parseInt(animeData.episodes, 10) : null;

  const newAnime = await prisma.anime.create({
    data: {
      externalId,
      title: animeData.title,
      titleEnglish: animeData.titleEnglish || null,
      synopsis: animeData.synopsis || null,
      type: animeData.type || 'TV',
      episodes,
      status: animeData.status || 'Completed',
      score,
      imageUrl: animeData.imageUrl || null,
      trailerUrl: animeData.trailerUrl || null,
      releaseDate,
    },
  });

  // Handle genre relationships
  if (Array.isArray(genres) && genres.length > 0) {
    for (const genreName of genres) {
      if (!genreName || !genreName.trim()) continue;
      const g = await prisma.genre.upsert({
        where: { name: genreName.trim() },
        update: {},
        create: { name: genreName.trim() },
      });
      await prisma.animeGenre.create({
        data: {
          animeId: newAnime.id,
          genreId: g.id,
        },
      });
    }
  }

  return getAnimeById(newAnime.id);
}

/**
 * Update an existing anime
 */
async function updateAnime(id, data) {
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) return null;

  const { genres, ...animeData } = data;

  const updatePayload = { ...animeData };
  if (updatePayload.score !== undefined) {
    updatePayload.score = updatePayload.score ? parseFloat(updatePayload.score) : null;
  }
  if (updatePayload.episodes !== undefined) {
    updatePayload.episodes = updatePayload.episodes ? parseInt(updatePayload.episodes, 10) : null;
  }
  if (updatePayload.releaseDate !== undefined) {
    updatePayload.releaseDate = updatePayload.releaseDate ? new Date(updatePayload.releaseDate) : null;
  }

  await prisma.anime.update({
    where: { id: animeId },
    data: updatePayload,
  });

  // Update genres if provided
  if (Array.isArray(genres)) {
    // Delete existing relations
    await prisma.animeGenre.deleteMany({
      where: { animeId },
    });

    for (const genreName of genres) {
      if (!genreName || !genreName.trim()) continue;
      const g = await prisma.genre.upsert({
        where: { name: genreName.trim() },
        update: {},
        create: { name: genreName.trim() },
      });
      await prisma.animeGenre.create({
        data: {
          animeId,
          genreId: g.id,
        },
      });
    }
  }

  return getAnimeById(animeId);
}

/**
 * Delete an anime and all associated episodes
 */
async function deleteAnime(id) {
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) return null;

  return await prisma.anime.delete({
    where: { id: animeId },
  });
}

/**
 * Get all episodes for an anime
 */
async function getAnimeEpisodes(id) {
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) return [];

  return await prisma.episode.findMany({
    where: { animeId },
    orderBy: { episodeNumber: 'asc' },
  });
}

/**
 * Get a specific episode for an anime
 */
async function getEpisode(id, episodeNumber) {
  const animeId = parseInt(id, 10);
  const epNum = parseInt(episodeNumber, 10);
  if (isNaN(animeId) || isNaN(epNum)) return null;

  const [anime, episode] = await Promise.all([
    prisma.anime.findUnique({
      where: { id: animeId },
      select: {
        id: true,
        title: true,
        titleEnglish: true,
        imageUrl: true,
        trailerUrl: true,
        score: true,
      },
    }),
    prisma.episode.findUnique({
      where: {
        animeId_episodeNumber: {
          animeId,
          episodeNumber: epNum,
        },
      },
    }),
  ]);

  if (!episode || !anime) return null;

  const prevEpisode = epNum > 1 ? epNum - 1 : null;
  const nextEpisode = await prisma.episode.findFirst({
    where: { animeId, episodeNumber: epNum + 1 },
    select: { episodeNumber: true },
  });

  return {
    ...episode,
    anime,
    navigation: {
      prevEpisode,
      nextEpisode: nextEpisode ? nextEpisode.episodeNumber : null,
    },
  };
}

/**
 * Create an episode for an anime
 */
async function createEpisode(id, data) {
  const animeId = parseInt(id, 10);
  if (isNaN(animeId)) throw new Error('Invalid anime ID');

  const episodeNumber = parseInt(data.episodeNumber, 10);
  if (isNaN(episodeNumber)) throw new Error('Valid episodeNumber is required');

  return await prisma.episode.create({
    data: {
      animeId,
      episodeNumber,
      title: data.title || `Episode ${episodeNumber}`,
      titleJapanese: data.titleJapanese || null,
      synopsis: data.synopsis || null,
      duration: data.duration ? parseInt(data.duration, 10) : 24,
      thumbnailUrl: data.thumbnailUrl || null,
      streamUrl: data.streamUrl || null,
      isFiller: Boolean(data.isFiller),
    },
  });
}

/**
 * Update an episode
 */
async function updateEpisode(id, episodeNumber, data) {
  const animeId = parseInt(id, 10);
  const epNum = parseInt(episodeNumber, 10);
  if (isNaN(animeId) || isNaN(epNum)) throw new Error('Invalid ID or episode number');

  const payload = { ...data };
  if (payload.episodeNumber !== undefined) {
    payload.episodeNumber = parseInt(payload.episodeNumber, 10);
  }
  if (payload.duration !== undefined) {
    payload.duration = parseInt(payload.duration, 10);
  }
  if (payload.isFiller !== undefined) {
    payload.isFiller = Boolean(payload.isFiller);
  }

  return await prisma.episode.update({
    where: {
      animeId_episodeNumber: {
        animeId,
        episodeNumber: epNum,
      },
    },
    data: payload,
  });
}

/**
 * Delete an episode
 */
async function deleteEpisode(id, episodeNumber) {
  const animeId = parseInt(id, 10);
  const epNum = parseInt(episodeNumber, 10);
  if (isNaN(animeId) || isNaN(epNum)) throw new Error('Invalid ID or episode number');

  return await prisma.episode.delete({
    where: {
      animeId_episodeNumber: {
        animeId,
        episodeNumber: epNum,
      },
    },
  });
}

/**
 * Create a genre
 */
async function createGenre(name) {
  if (!name || !name.trim()) throw new Error('Genre name is required');
  return await prisma.genre.create({
    data: { name: name.trim() },
  });
}

/**
 * Update a genre
 */
async function updateGenre(id, name) {
  const genreId = parseInt(id, 10);
  if (isNaN(genreId) || !name || !name.trim()) throw new Error('Invalid genre ID or name');
  return await prisma.genre.update({
    where: { id: genreId },
    data: { name: name.trim() },
  });
}

/**
 * Delete a genre
 */
async function deleteGenre(id) {
  const genreId = parseInt(id, 10);
  if (isNaN(genreId)) throw new Error('Invalid genre ID');
  return await prisma.genre.delete({
    where: { id: genreId },
  });
}

/**
 * Get admin stats and system overview
 */
async function getAdminStats() {
  const [totalAnime, totalEpisodes, totalGenres, lastSync] = await Promise.all([
    prisma.anime.count(),
    prisma.episode.count(),
    prisma.genre.count(),
    prisma.syncLog.findFirst({
      orderBy: { runAt: 'desc' },
    }),
  ]);

  const statusBreakdown = await prisma.anime.groupBy({
    by: ['status'],
    _count: {
      id: true,
    },
  });

  const typeBreakdown = await prisma.anime.groupBy({
    by: ['type'],
    _count: {
      id: true,
    },
  });

  return {
    totalAnime,
    totalEpisodes,
    totalGenres,
    lastSync,
    statusBreakdown: statusBreakdown.map((s) => ({ status: s.status || 'Unknown', count: s._count.id })),
    typeBreakdown: typeBreakdown.map((t) => ({ type: t.type || 'Unknown', count: t._count.id })),
  };
}

/**
 * Get curated trending anime (airing & top score)
 */
async function getTrendingAnime(limit = 10) {
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

  let items = await prisma.anime.findMany({
    where: {
      status: 'Airing',
      score: { not: null },
    },
    take: limitNum,
    orderBy: { score: 'desc' },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  if (items.length < limitNum) {
    const remaining = limitNum - items.length;
    const existingIds = items.map((i) => i.id);
    const filler = await prisma.anime.findMany({
      where: {
        id: { notIn: existingIds },
        score: { not: null },
      },
      take: remaining,
      orderBy: { score: 'desc' },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
    });
    items = [...items, ...filler];
  }

  return items.map((item) => ({
    ...item,
    genres: item.genres.map((ag) => ag.genre.name),
  }));
}

/**
 * Get all genres with count of anime
 */
async function getGenresList() {
  const genres = await prisma.genre.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { anime: true },
      },
    },
  });

  return genres.map((g) => ({
    id: g.id,
    name: g.name,
    count: g._count.anime,
  }));
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
  createGenre,
  updateGenre,
  deleteGenre,
  getAdminStats,
  getTrendingAnime,
  getGenresList,
};
