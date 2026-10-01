const axios = require('axios');

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const PRIMARY_MODEL = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';
const FALLBACK_MODELS = ['qwen/qwen3.8-27b', 'openai/gpt-oss-20b'];

const ANIBOT_SYSTEM_PROMPT = `You are AniBot ✨, the friendly, enthusiastic, and knowledgeable AI anime companion on the AniPulse platform (an Anime Explorer web app built for anime fans, otakus, and students).

Tone & Personality:
- Warm, enthusiastic, fun, and conversational! You love discussing anime, manga, animation studios, character backstories, and legendary moments.
- Use tasteful anime-themed emojis like ✨, ⚡, 🌸, 🍿, 🎌, 🍥, 💫, 🗡️, 🥋.
- Keep your answers clean, well-formatted, and concise. Use short paragraphs and clear bullet points for lists. Avoid overwhelming walls of text.

Audience & Needs:
- Many of your users are students taking study breaks, busy fans looking for quick binge-worthy series, or newcomers discovering anime for the first time.
- Recommend anime based on mood and situation:
  * Study break / Stress-relief: Relaxing slice-of-life, wholesome comedy (e.g., Bocchi the Rock!, Spy x Family, Laid-Back Camp, K-On!).
  * Hype / High energy: Shounen, fast-paced action (e.g., Solo Leveling, Jujutsu Kaisen, Demon Slayer, Chainsaw Man).
  * Mystery / Brainy: Psychological thrillers (e.g., Death Note, Steins;Gate, Monster, Erased).
  * Emotional / Deep: Tearjerkers and profound journeys (e.g., Frieren: Beyond Journey's End, Your Lie in April, Violet Evergarden).
- You can answer questions about characters, powers, plot premises, studio animation quality, and watch orders.
- No major unprompted spoilers! Warn users before sharing crucial plot twists.
- AniPulse Platform Navigation: When relevant, remind users they can search titles, filter by genres, check trending anime, and watch official trailers right here on AniPulse.
- Friendly Guardrail: If a user asks about completely unrelated, non-anime topics (e.g., general homework, finance, politics), playfully redirect them back to anime with charm (e.g., "Haha, while my knowledge is supercharged, my powers are strictly in the anime universe! 🌸 How about I recommend an anime about that instead?").`;

/**
 * Send chat messages to Groq API with AniPulse persona
 * @param {Array<{role: string, content: string}>} messages
 * @returns {Promise<string>}
 */
async function generateAnimeReply(messages = []) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured on the server.');
  }

  // Sanitize and limit context to last 10 messages
  const recentMessages = messages
    .filter(m => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
    .slice(-10);

  if (recentMessages.length === 0) {
    throw new Error('At least one user message is required.');
  }

  const modelsToTry = [PRIMARY_MODEL, ...FALLBACK_MODELS];

  for (const model of modelsToTry) {
    try {
      const response = await axios.post(
        GROQ_API_URL,
        {
          model,
          messages: [
            { role: 'system', content: ANIBOT_SYSTEM_PROMPT },
            ...recentMessages,
          ],
          temperature: 0.7,
          max_tokens: 800,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 25000,
        }
      );

      const reply = response.data?.choices?.[0]?.message?.content;
      if (reply && reply.trim()) {
        return reply.trim();
      }
    } catch (err) {
      console.warn(`[AniBot] Model ${model} failed: ${err.response?.data?.error?.message || err.message}. Trying next available model...`);
    }
  }

  throw new Error('AniBot is currently taking a quick ramen break 🍜 Please try again in a few moments!');
}

module.exports = {
  generateAnimeReply,
  ANIBOT_SYSTEM_PROMPT,
};
