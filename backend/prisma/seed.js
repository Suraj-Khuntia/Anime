const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const initialAnimeList = [
  {
    externalId: 52991,
    title: "Sousou no Frieren",
    titleEnglish: "Frieren: Beyond Journey's End",
    synopsis: "During their decade-long quest, the hero party defeated the Demon King and brought peace to the land. Following the victory, elven mage Frieren parts ways with her companions. As an elf, Frieren lives for over a thousand years, making her companions' lifespans seem like mere blinks. Decades later, she attends the funeral of her comrade and is struck by grief over how little she understood him. Frieren embarks on a new pilgrimage to reflect on her past connections and uncover the meaning of humanity.",
    type: "TV",
    episodes: 28,
    status: "Completed",
    score: 9.38,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1015/138075l.jpg",
    trailerUrl: "https://www.youtube.com/embed/qgQunxF0qfs",
    releaseDate: "2023-09-29T00:00:00.000Z",
    genres: ["Adventure", "Drama", "Fantasy"]
  },
  {
    externalId: 5114,
    title: "Fullmetal Alchemist: Brotherhood",
    titleEnglish: "Fullmetal Alchemist: Brotherhood",
    synopsis: "After a horrific alchemy experiment goes wrong in the Elric household, brothers Edward and Alphonse are left in catastrophic conditions. Ignoring the alchemical taboo against human transmutation, the boys attempted to revive their recently deceased mother. Instead, they suffered brutal personal loss: Alphonse's body disintegrated while Edward lost a leg and then sacrificed an arm to keep Alphonse's soul bound to a physical suit of armor.",
    type: "TV",
    episodes: 64,
    status: "Completed",
    score: 9.10,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1223/96541l.jpg",
    trailerUrl: "https://www.youtube.com/embed/--IcmZkvL0Q",
    releaseDate: "2009-04-05T00:00:00.000Z",
    genres: ["Action", "Adventure", "Drama", "Fantasy"]
  },
  {
    externalId: 9253,
    title: "Steins;Gate",
    titleEnglish: "Steins;Gate",
    synopsis: "Eccentric scientist Rintarou Okabe has an unending thirst for scientific exploration. Together with his ditzy friend Mayuri and geeky hacker Daru, he founds the Future Gadget Research Laboratory in a cramped apartment. One day, Okabe witnesses the murder of neuroscientist Kurisu Makise, only to discover hours later that sending a text message through their makeshift microwave experiment altered reality itself and brought her back to life.",
    type: "TV",
    episodes: 24,
    status: "Completed",
    score: 9.07,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
    trailerUrl: "https://www.youtube.com/embed/uMYhjVwp0Fk",
    releaseDate: "2011-04-06T00:00:00.000Z",
    genres: ["Drama", "Sci-Fi", "Suspense"]
  },
  {
    externalId: 16498,
    title: "Shingeki no Kyojin",
    titleEnglish: "Attack on Titan",
    synopsis: "Centuries ago, mankind was slaughtered to near extinction by monstrous humanoid creatures called Titans, forcing humans to hide in fear behind enormous concentric walls. What makes these giants truly terrifying is that their taste for human flesh is not born out of hunger but what appears to be pleasure. When a Colossal Titan breaches the outer barrier, Eren Yeager vows to eliminate every Titan on Earth.",
    type: "TV",
    episodes: 25,
    status: "Completed",
    score: 8.55,
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/47347l.jpg",
    trailerUrl: "https://www.youtube.com/embed/LHtdKWJjeg4",
    releaseDate: "2013-04-07T00:00:00.000Z",
    genres: ["Action", "Drama", "Suspense"]
  },
  {
    externalId: 40748,
    title: "Jujutsu Kaisen",
    titleEnglish: "Jujutsu Kaisen",
    synopsis: "Idly indulging in paranormal activities with the Occult Club, high schooler Yuuji Itadori spends his days at either the clubroom or the hospital visiting his bedridden grandfather. However, this leisurely lifestyle soon takes a turn for the bizarre when he unknowingly encounters a cursed item. Swallowing the finger of the King of Curses Sukuna, Yuuji is thrust into the world of Jujutsu Sorcerers.",
    type: "TV",
    episodes: 24,
    status: "Completed",
    score: 8.62,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1171/109222l.jpg",
    trailerUrl: "https://www.youtube.com/embed/pkZXflOOdfY",
    releaseDate: "2020-10-03T00:00:00.000Z",
    genres: ["Action", "Fantasy", "Supernatural"]
  },
  {
    externalId: 38000,
    title: "Kimetsu no Yaiba",
    titleEnglish: "Demon Slayer: Kimetsu no Yaiba",
    synopsis: "Ever since the death of his father, the burden of supporting the family has fallen upon Tanjirou Kamado's shoulders. One snowy day, Tanjirou returns home to discover that his entire family has been slaughtered by a demon, and the sole survivor, his sister Nezuko, has been turned into a bloodthirsty demon herself. Tanjirou sets out on a perilous journey to become a Demon Slayer and cure his sister.",
    type: "TV",
    episodes: 26,
    status: "Completed",
    score: 8.48,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1286/99889l.jpg",
    trailerUrl: "https://www.youtube.com/embed/VQGCKyvzIM4",
    releaseDate: "2019-04-06T00:00:00.000Z",
    genres: ["Action", "Fantasy", "Historical"]
  },
  {
    externalId: 52299,
    title: "Ore dake Level Up na Ken",
    titleEnglish: "Solo Leveling",
    synopsis: "Over a decade ago, 'gates' connecting our world with another dimension suddenly opened, awakening people with superhuman powers called 'Hunters'. Sung Jinwoo is an E-rank hunter known as the 'Weakest of All Mankind'. Deep inside a lethal dual dungeon, facing certain death, Jinwoo accepts a mysterious quest window and gains the unique ability to level up infinitely.",
    type: "TV",
    episodes: 12,
    status: "Airing",
    score: 8.35,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1844/141872l.jpg",
    trailerUrl: "https://www.youtube.com/embed/91bxs7724pk",
    releaseDate: "2024-01-07T00:00:00.000Z",
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    externalId: 44511,
    title: "Chainsaw Man",
    titleEnglish: "Chainsaw Man",
    synopsis: "Denji is robbed of a normal teenage life, left with nothing but his deceased father's overwhelming debt. His only companion is his pet chainsaw devil Pochita, with whom he slays devils for money that inevitably ends up in the yakuza's pockets. When betrayed and killed, Pochita merges with Denji's heart, transforming him into Chainsaw Man.",
    type: "TV",
    episodes: 12,
    status: "Completed",
    score: 8.49,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1806/126216l.jpg",
    trailerUrl: "https://www.youtube.com/embed/q15CRdE5Bv0",
    releaseDate: "2022-10-12T00:00:00.000Z",
    genres: ["Action", "Fantasy", "Supernatural"]
  },
  {
    externalId: 32281,
    title: "Kimi no Na wa.",
    titleEnglish: "Your Name.",
    synopsis: "Mitsuha Miyamizu, a high school girl living in the countryside town of Itomori, longs to live as a handsome boy in Tokyo. Meanwhile, Taki Tachibana is a busy high school student in Tokyo aspiring to be an architect. One morning, they wake up to discover they have mysteriously swapped bodies. As they search for each other across time and memory, a looming catastrophe approaches.",
    type: "Movie",
    episodes: 1,
    status: "Completed",
    score: 8.84,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1935/127974l.jpg",
    trailerUrl: "https://www.youtube.com/embed/s0wTdCQoc2k",
    releaseDate: "2016-08-26T00:00:00.000Z",
    genres: ["Drama", "Romance", "Supernatural"]
  },
  {
    externalId: 199,
    title: "Sen to Chihiro no Kamikakushi",
    titleEnglish: "Spirited Away",
    synopsis: "Stubborn, spoiled, and naive, 10-year-old Chihiro Ogino is less than pleased when she and her parents discover an abandoned amusement park on the way to their new home. When her parents are transformed into pigs after eating feast food, Chihiro enters the spirit world where she must work in a bathhouse run by an evil witch to save them.",
    type: "Movie",
    episodes: 1,
    status: "Completed",
    score: 8.78,
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/79597l.jpg",
    trailerUrl: "https://www.youtube.com/embed/ByXuk9QqQkk",
    releaseDate: "2001-07-20T00:00:00.000Z",
    genres: ["Adventure", "Award Winning", "Supernatural"]
  },
  {
    externalId: 1535,
    title: "Death Note",
    titleEnglish: "Death Note",
    synopsis: "A shinigami, as a god of death, can kill any person—provided they see their victim's face and write their victim's name in a notebook called a Death Note. One day, Ryuk, bored by the shinigami lifestyle, drops one of these into the human realm. High school student and prodigy Light Yagami stumbles upon the Death Note and vows to cleanse the world of criminals under the pseudonym Kira.",
    type: "TV",
    episodes: 37,
    status: "Completed",
    score: 8.62,
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/9453l.jpg",
    trailerUrl: "https://www.youtube.com/embed/Vt_3c8BgxV4",
    releaseDate: "2006-10-04T00:00:00.000Z",
    genres: ["Supernatural", "Suspense", "Mystery"]
  },
  {
    externalId: 11061,
    title: "Hunter x Hunter (2011)",
    titleEnglish: "Hunter x Hunter",
    synopsis: "Hunters devote themselves to accomplishing hazardous tasks, from traversing the world's uncharted territories to locating rare items and monsters. Before becoming a Hunter, one must pass the grueling Hunter Examination. Twelve-year-old Gon Freecss embarks on a quest to become a Hunter and find his father Ging.",
    type: "TV",
    episodes: 148,
    status: "Completed",
    score: 9.04,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1337/99013l.jpg",
    trailerUrl: "https://www.youtube.com/embed/d6kBeJjTGnY",
    releaseDate: "2011-10-02T00:00:00.000Z",
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    externalId: 37521,
    title: "Vinland Saga",
    titleEnglish: "Vinland Saga",
    synopsis: "Young Thorfinn grew up listening to the stories of old sailors that had traveled the ocean and reached the place of legend, Vinland. It is said to be warm and fertile, a place where there would be no need for fighting—not at all like the frozen village in Iceland where he was born. When his father is killed by Viking leader Askeladd, Thorfinn joins his band seeking an honorable duel of vengeance.",
    type: "TV",
    episodes: 24,
    status: "Completed",
    score: 8.75,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1500/103005l.jpg",
    trailerUrl: "https://www.youtube.com/embed/f8JrZ7Q_p-8",
    releaseDate: "2019-07-08T00:00:00.000Z",
    genres: ["Action", "Adventure", "Drama"]
  },
  {
    externalId: 50265,
    title: "Spy x Family",
    titleEnglish: "SPY x FAMILY",
    synopsis: "Corrupt politicians, frenzied nationalists, and other warmongering forces constantly jeopardize the thin veneer of peace between Ostania and Westalis. Master spy Twilight is tasked with Operation Strix: infiltrate prestigious Eden Academy by creating a fake family. Unbeknownst to him, his adopted daughter Anya is a telepath and his fake wife Yor is an elite assassin.",
    type: "TV",
    episodes: 12,
    status: "Completed",
    score: 8.50,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1441/122795l.jpg",
    trailerUrl: "https://www.youtube.com/embed/ofXigq9aIpo",
    releaseDate: "2022-04-09T00:00:00.000Z",
    genres: ["Action", "Comedy"]
  },
  {
    externalId: 48583,
    title: "Shingeki no Kyojin: The Final Season",
    titleEnglish: "Attack on Titan Final Season Part 2",
    synopsis: "Turning against his former allies and enemies alike, Eren Yeager sets a disastrous plan in motion. Under the guidance of the Beast Titan, Zeke, Eren takes extreme measures to end the ancient conflict between Marley and Eldia, but his true intentions remain a mystery. The rumbling begins, threatening to trample the earth.",
    type: "TV",
    episodes: 12,
    status: "Completed",
    score: 8.78,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1988/119963l.jpg",
    trailerUrl: "https://www.youtube.com/embed/EIVVnLlhzr0",
    releaseDate: "2022-01-10T00:00:00.000Z",
    genres: ["Action", "Drama", "Suspense"]
  },
  {
    externalId: 50709,
    title: "Cyberpunk: Edgerunners",
    titleEnglish: "Cyberpunk: Edgerunners",
    synopsis: "Dreams are doomed to die in Night City, a futuristic California metropolis riddled with corruption and cybernetic obsession. David Martinez, a street kid living in the city's slums, loses everything in a drive-by shooting. To survive, he fits an experimental military-grade cyberware called the Sandevistan and becomes an edgerunner.",
    type: "ONA",
    episodes: 10,
    status: "Completed",
    score: 8.60,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1818/126435l.jpg",
    trailerUrl: "https://www.youtube.com/embed/JtqIas3bYhg",
    releaseDate: "2022-09-13T00:00:00.000Z",
    genres: ["Action", "Sci-Fi"]
  },
  {
    externalId: 51009,
    title: "Bocchi the Rock!",
    titleEnglish: "Bocchi the Rock!",
    synopsis: "Yearning to make friends and perform live with a band, lonely and socially anxious Hitori 'Bocchi' Gotou devotes her time to playing the guitar. On a fateful day, Bocchi meets the outgoing drummer Nijika Ijichi, who invites her to join Kessoku Band when their guitarist ran away before their first show.",
    type: "TV",
    episodes: 12,
    status: "Completed",
    score: 8.80,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1448/127956l.jpg",
    trailerUrl: "https://www.youtube.com/embed/tvaZZ2q_pD4",
    releaseDate: "2022-10-09T00:00:00.000Z",
    genres: ["Comedy"]
  },
  {
    externalId: 33352,
    title: "Violet Evergarden",
    titleEnglish: "Violet Evergarden",
    synopsis: "The Great War finally came to an end after four long years of conflict. Violet Evergarden, a young girl formerly raised for the sole purpose of decimating enemy lines, hospitalized and maimed in a bloody skirmish during the War's final leg, starts working as an Auto Memory Doll to transcribe people's deepest thoughts and understand the words 'I love you'.",
    type: "TV",
    episodes: 13,
    status: "Completed",
    score: 8.68,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1795/95088l.jpg",
    trailerUrl: "https://www.youtube.com/embed/g5xWqjF9Msk",
    releaseDate: "2018-01-11T00:00:00.000Z",
    genres: ["Drama", "Fantasy", "Slice of Life"]
  },
  {
    externalId: 21,
    title: "One Piece",
    titleEnglish: "One Piece",
    synopsis: "Barely surviving in a barrel after passing through a terrible whirlpool at sea, carefree Monkey D. Luffy ends up aboard a ship under attack by pirates. Despite being a naive-looking teenager, he is not to be underestimated. Powered by the Gum-Gum Fruit, Luffy sets sail across the Grand Line to find the legendary treasure One Piece and become King of the Pirates.",
    type: "TV",
    episodes: 1120,
    status: "Airing",
    score: 8.72,
    imageUrl: "https://cdn.myanimelist.net/images/anime/1244/138851l.jpg",
    trailerUrl: "https://www.youtube.com/embed/MCb13lbKsGE",
    releaseDate: "1999-10-20T00:00:00.000Z",
    genres: ["Action", "Adventure", "Fantasy"]
  },
  {
    externalId: 34572,
    title: "Black Clover",
    titleEnglish: "Black Clover",
    synopsis: "Asta and Yuno were abandoned at the same church on the same day. Raised together as children, they came to know of the 'Wizard King'—a title given to the strongest mage in the kingdom. While Yuno has immense magical aptitude, Asta was born with none at all. When danger strikes, Asta receives a five-leaf clover grimoire wielding Anti-Magic swords.",
    type: "TV",
    episodes: 170,
    status: "Completed",
    score: 8.14,
    imageUrl: "https://cdn.myanimelist.net/images/anime/2/88336l.jpg",
    trailerUrl: "https://www.youtube.com/embed/vJa0Va1iT2E",
    releaseDate: "2017-10-03T00:00:00.000Z",
    genres: ["Action", "Comedy", "Fantasy"]
  }
];

async function main() {
  console.log('[Seed] Seeding database with initial rich anime catalog...');

  for (const item of initialAnimeList) {
    const { genres, ...animeData } = item;
    const releaseDate = animeData.releaseDate ? new Date(animeData.releaseDate) : null;

    const anime = await prisma.anime.upsert({
      where: { externalId: animeData.externalId },
      update: {
        ...animeData,
        releaseDate,
      },
      create: {
        ...animeData,
        releaseDate,
      },
    });

    for (const genreName of genres) {
      const genre = await prisma.genre.upsert({
        where: { name: genreName },
        update: {},
        create: { name: genreName },
      });

      await prisma.animeGenre.upsert({
        where: {
          animeId_genreId: {
            animeId: anime.id,
            genreId: genre.id,
          },
        },
        update: {},
        create: {
          animeId: anime.id,
          genreId: genre.id,
        },
      });
    }
  }

  // Create initial sync log
  await prisma.syncLog.create({
    data: {
      status: 'success',
      itemsSynced: initialAnimeList.length,
      message: `Initial seed populated with ${initialAnimeList.length} verified titles.`,
    },
  });

  console.log(`[Seed] Seeded ${initialAnimeList.length} anime successfully!`);
}

main()
  .catch((e) => {
    console.error('[Seed] Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
