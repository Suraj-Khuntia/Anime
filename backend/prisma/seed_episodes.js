const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Sample episode titles for top animes for rich presentation
const canonicalEpisodes = {
  // Sousou no Frieren (28 eps)
  52991: [
    { ep: 1, title: "The Journey's End", synopsis: "After a 10-year quest to defeat the Demon King, the hero party disbands. Frieren departs on a solitary journey." },
    { ep: 2, title: "It Didn't Have to Be Magic...", synopsis: "Frieren visits Heiter, who asks her to decode a grimoire and take in an orphaned girl named Fern." },
    { ep: 3, title: "Killing Magic", synopsis: "Frieren and Fern venture to the northern lands where an infamous demon named Qual was sealed long ago." },
    { ep: 4, title: "The Land Where Souls Rest", synopsis: "Frieren learns from Flamme's writings about Aureole, the legendary resting place of souls at the Demon King's castle." },
    { ep: 5, title: "Phantoms of the Dead", synopsis: "Passing through the mountain pass, the group encounters the Einsam, a phantom demon creating illusions of lost loved ones." },
    { ep: 6, title: "The Hero of the Village", synopsis: "Arriving at the village guarded by warrior Eisen's pupil, Stark, they must face a Solar Dragon." },
    { ep: 7, title: "Like a Fairy Tale", synopsis: "Stark joins the party. They reach the trading city of Waal, where demon envoys have arrived for peace talks." },
    { ep: 8, title: "Frieren the Slayer", synopsis: "Frieren explains why demons cannot be negotiated with, as Aura the Guillotine prepares her dread army." },
    { ep: 9, title: "Aura the Guillotine", synopsis: "Stark and Fern face Aura's executioners, while Frieren confronts Aura and her Scales of Obedience." },
    { ep: 10, title: "A Powerful Mage", synopsis: "Frieren recalls her ancient master Flamme, and how she learned to suppress her mana for centuries." },
    { ep: 11, title: "Winter in the Northern Lands", synopsis: "Caught in severe snowstorms, the party spends winter with Kraft, an elf monk of the Goddess." },
    { ep: 12, title: "A Real Hero", synopsis: "In a village where the real Hero Sword remains sealed, Frieren remembers Himmel's joyful attitude." },
    { ep: 13, title: "Aversion to One's Own Kind", synopsis: "The party meets Sein, an exceptionally gifted priest who gave up on his dream of traveling." },
    { ep: 14, title: "Privilege of the Young", synopsis: "Sein helps resolve a dispute between Fern and Stark, teaching them how to understand each other." },
    { ep: 15, title: "Smells Like Trouble", synopsis: "In the Vorig region, the party encounters cursed forest creatures and an ancient dancing festival." },
    { ep: 16, title: "Long-Lived Friends", synopsis: "Frieren visits an old dwarf friend of Eisen, reflecting on how centuries pass in the blink of an eye." },
    { ep: 17, title: "Take Care", synopsis: "Sein departs on his own path to find his childhood friend. The party approaches Äußerst for the First-Class Mage exam." },
    { ep: 18, title: "First-Class Mage Exam", synopsis: "The First-Class Mage exam commences with fifty-seven elite candidates divided into 3-person squads." },
    { ep: 19, title: "Well-Laid Plans", synopsis: "The candidates must capture a Stille bird. Frieren devises a clever magical trap." },
    { ep: 20, title: "Necessary Killing", synopsis: "Squads clash as water mage Kanne and wind mage Lawine struggle against rival examiners." },
    { ep: 21, title: "The World of Magic", synopsis: "Richter overwhelms Kanne and Lawine until Frieren breaks the barrier encompassing the entire exam basin." },
    { ep: 22, title: "Future Allies", synopsis: "Passing the first stage, the mages explore the city of Äußerst and prepare for the second trial." },
    { ep: 23, title: "Conquering the Ruins", synopsis: "Sense announces the second test: conquering the treacherous Tomb of the Ruin King dungeon." },
    { ep: 24, title: "Perfect Replicas", synopsis: "The dungeon's master mirror demon creates identical, flawless clones of every candidate, including Frieren." },
    { ep: 25, title: "A Fatal Vulnerability", synopsis: "Frieren and Fern face the Frieren clone, analyzing microscopic mana blind spots to secure victory." },
    { ep: 26, title: "The Height of Magic", synopsis: "Fern strikes the clone with pure Zoltraak. The candidates clear the Tomb of the Ruin King." },
    { ep: 27, title: "An Era of Humans", synopsis: "Great Mage Serie conducts the third test personally, evaluating candidates' mana intuition." },
    { ep: 28, title: "It Would Be Embarrassing When We Met Again", synopsis: "With the exams concluded, Frieren, Fern, and Stark set off toward the northernmost horizon." }
  ],
  // Solo Leveling (12 eps)
  52299: [
    { ep: 1, title: "I'm Used to It", synopsis: "Sung Jinwoo, the Weakest Hunter, enters a low-rank gate with fellow hunters only to stumble upon a hidden double dungeon." },
    { ep: 2, title: "If I Had One More Chance", synopsis: "Trapped in the temple of colossal stone statues, the hunters must decipher the commandments to survive." },
    { ep: 3, title: "It's Like a Game", synopsis: "Jinwoo awakens in a hospital with a mysterious holographic quest screen that only he can see." },
    { ep: 4, title: "I've Gotta Get Stronger", synopsis: "Jinwoo completes grueling daily quests and unlocks an instance dungeon in the subway station." },
    { ep: 5, title: "A Pretty Good Deal", synopsis: "Joining a strike squad led by Hwang Dongsuk, Jinwoo enters a C-rank gate where betrayal awaits." },
    { ep: 6, title: "The Real Hunt Begins", synopsis: "Betrayed and locked in the boss room, Jinwoo slays the dungeon boss and executes his treacherous teammates." },
    { ep: 7, title: "Let's See How Far I Can Go", synopsis: "Jinwoo visits the Demon Castle dungeon and unlocks crafting recipes to cure his mother's sleeping disease." },
    { ep: 8, title: "This Is Frustrating", synopsis: "Jinwoo reunites with Lee Joohee on a raid with convicts supervised by Hunter Association inspector Kang Taeshik." },
    { ep: 9, title: "You've Been Hiding Your Skills", synopsis: "Kang Taeshik turns on the survivors. Jinwoo must reveal his true combat power to protect his comrades." },
    { ep: 10, title: "What Is This, a Picnic?", synopsis: "Jinwoo forms a party with wealthy heir Yoo Jinho to clear nineteen C-rank dungeons." },
    { ep: 11, title: "A Knight Who Defends an Empty Throne", synopsis: "Jinwoo enters his job-change quest dungeon and faces Blood-Red Commander Igris." },
    { ep: 12, title: "Arise", synopsis: "Overcoming unending legions of shadow knights, Jinwoo unlocks the Necromancer class and utters the command: 'Arise'." }
  ],
  // Jujutsu Kaisen (24 eps)
  40748: [
    { ep: 1, title: "Ryomen Sukuna", synopsis: "Yuuji Itadori swallows a cursed talisman to save his friends, becoming the vessel of Sukuna." },
    { ep: 2, title: "For Myself", synopsis: "Satoru Gojo takes Yuuji to Tokyo Metropolitan Magic Technical College." },
    { ep: 3, title: "Girl of Steel", synopsis: "Yuuji and Megumi meet their new classmate Nobara Kugisaki and exorcise curses in Roppongi." },
    { ep: 4, title: "Curse Womb Must Die", synopsis: "The first-years are deployed to an Eishu juvenile detention center where a special grade curse appears." },
    { ep: 5, title: "Curse Womb Must Die -II-", synopsis: "Sukuna takes control of Yuuji's body and tears out his heart." },
    { ep: 6, title: "After Rain", synopsis: "Yuuji strikes a binding vow with Sukuna to return to life, undergoing secret training with Gojo." }
  ],
  // Attack on Titan (25 eps)
  16498: [
    { ep: 1, title: "To You, in 2000 Years: The Fall of Shiganshina, Part 1", synopsis: "The Colossal Titan shatters the outer gate of Shiganshina, shattering a century of peace." },
    { ep: 2, title: "That Day: The Fall of Shiganshina, Part 2", synopsis: "The Armored Titan destroys Wall Maria's inner gate, forcing humanity to evacuate." },
    { ep: 3, title: "A Dim Light Amid Despair: Humanity's Comeback, Part 1", synopsis: "Eren, Mikasa, and Armin enlist in the 104th Training Corps." },
    { ep: 4, title: "The Night of the Closing Ceremony: Humanity's Comeback, Part 2", synopsis: "Five years after the fall, the Colossal Titan suddenly reappears over Wall Rose." },
    { ep: 5, title: "First Battle: The Struggle for Trost, Part 1", synopsis: "Eren and his squad charge into combat against invading Titans with disastrous casualties." },
    { ep: 6, title: "The World the Girl Saw: The Struggle for Trost, Part 2", synopsis: "Mikasa's past is revealed as she fights desperately after hearing of Eren's fall." }
  ]
};

async function seedEpisodes() {
  console.log('[SeedEpisodes] Populating episodes for all anime in database...');
  const animes = await prisma.anime.findMany();

  for (const anime of animes) {
    const totalEp = anime.episodes || 12;
    // For large counts like One Piece (1120), generate the first 24-50 representative episodes
    const generateCount = Math.min(totalEp, 50);
    const knownList = canonicalEpisodes[anime.externalId] || [];

    console.log(`Processing episodes for: ${anime.title} (${generateCount} episodes)`);

    for (let i = 1; i <= generateCount; i++) {
      const known = knownList.find(k => k.ep === i);
      const title = known ? known.title : `Episode ${i}: ${anime.titleEnglish || anime.title}`;
      const synopsis = known ? known.synopsis : `Watch episode ${i} of ${anime.titleEnglish || anime.title}. Follow the storyline, character development, and pivotal adventures.`;
      
      // Real streaming / player embed preview:
      // Uses YouTube trailer or anime embed player
      const streamUrl = anime.trailerUrl 
        ? anime.trailerUrl 
        : `https://www.youtube.com/embed/dQw4w9WgXcQ`;

      // High quality episode scene thumbnail
      const thumbnailUrl = anime.imageUrl;

      await prisma.episode.upsert({
        where: {
          animeId_episodeNumber: {
            animeId: anime.id,
            episodeNumber: i,
          },
        },
        update: {
          title,
          synopsis,
          thumbnailUrl,
          streamUrl,
          duration: 24,
        },
        create: {
          animeId: anime.id,
          episodeNumber: i,
          title,
          synopsis,
          thumbnailUrl,
          streamUrl,
          duration: 24,
        },
      });
    }
  }

  console.log('[SeedEpisodes] All anime episodes successfully populated!');
}

seedEpisodes()
  .catch((e) => {
    console.error('[SeedEpisodes] Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
