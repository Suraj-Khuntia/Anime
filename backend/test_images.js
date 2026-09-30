const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getValidCover(title) {
  const query = `
    query ($search: String) {
      Media (search: $search, type: ANIME) {
        id
        title { english romaji }
        coverImage { extraLarge large }
      }
    }
  `;
  try {
    const res = await axios.post('https://graphql.anilist.co', {
      query,
      variables: { search: title }
    }, { timeout: 5000 });
    return res.data?.data?.Media?.coverImage?.extraLarge || res.data?.data?.Media?.coverImage?.large;
  } catch (err) {
    console.error(`AniList error for ${title}:`, err.message);
    return null;
  }
}

async function fixBrokenImages() {
  const animes = await prisma.anime.findMany();
  for (const anime of animes) {
    let isWorking = false;
    try {
      const check = await axios.head(anime.imageUrl, { timeout: 3000 });
      if (check.status === 200) isWorking = true;
    } catch (e) {
      isWorking = false;
    }

    if (!isWorking) {
      console.log(`Fixing broken image for: ${anime.title} (current: ${anime.imageUrl})`);
      const searchTitle = anime.titleEnglish || anime.title;
      const newUrl = await getValidCover(searchTitle);
      if (newUrl) {
        console.log(`-> New URL for ${anime.title}: ${newUrl}`);
        await prisma.anime.update({
          where: { id: anime.id },
          data: { imageUrl: newUrl }
        });
      }
      await new Promise(r => setTimeout(r, 800));
    } else {
      console.log(`OK: ${anime.title}`);
    }
  }
  console.log('Finished updating image URLs.');
  process.exit(0);
}

fixBrokenImages();
