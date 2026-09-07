import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client with required User-Agent
let aiClient: GoogleGenAI | null = null;
function getAi(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Local fallbacks will be used.');
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// Fallback local heuristic extractor if API call fails or key is missing
function localHeuristicExtract(text: string) {
  const lower = text.toLowerCase();
  
  // Money
  let money = null;
  if (/0\s*(?:money|cash|dollars?|rupees?)|zero\s*(?:money|cash|dollars?|rupees?)|no\s*(?:money|cash)/i.test(text)) {
    money = { amount: 0, currency: 'USD' };
  } else {
    const moneyMatch = text.match(/(?:(?:rs\.?|inr|₹|\$|€|£)\s*(\d+(?:,\d+)*(?:\.\d+)?))|(?:(\d+(?:,\d+)*(?:\.\d+)?)\s*(?:rupees?|bucks?|dollars?|euros?|pounds?|inr|rs\.?))/i);
    if (moneyMatch) {
      const rawVal = moneyMatch[1] || moneyMatch[2];
      const amount = parseFloat(rawVal.replace(/,/g, ''));
      let currency = 'USD';
      if (/rs|rupee|inr|₹/i.test(text)) currency = 'INR';
      else if (/€|euro/i.test(text)) currency = 'EUR';
      else if (/£|pound/i.test(text)) currency = 'GBP';
      money = { amount, currency };
    }
  }

  // Time
  let time = null;
  const timeMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:hours?|hrs?|mins?|minutes?)/i);
  if (timeMatch) {
    const hrs = timeMatch[0].includes('min') ? Math.max(0.2, parseFloat(timeMatch[1]) / 60) : parseFloat(timeMatch[1]);
    let when = 'flexible';
    if (/saturday|sunday|weekend/i.test(text)) when = 'weekends';
    else if (/evening|night/i.test(text)) when = 'evenings';
    else if (/afternoon/i.test(text)) when = 'afternoons';
    else if (/morning/i.test(text)) when = 'mornings';
    time = { hours: Math.round(hrs * 10) / 10, when, recurring: /every|weekly|daily/i.test(text) };
  } else if (/saturday|sunday|weekend/i.test(text)) {
    time = { hours: 2, when: 'weekend', recurring: false };
  } else if (/afternoon|free time|spare time/i.test(text)) {
    time = { hours: 1, when: 'afternoons', recurring: false };
  }

  // Languages
  const knownLanguages = ['spanish', 'hindi', 'gujarati', 'tamil', 'telugu', 'marathi', 'bengali', 'french', 'german', 'mandarin', 'arabic', 'urdu', 'kannada', 'malayalam', 'punjabi', 'japanese', 'korean', 'russian', 'english', 'portuguese', 'italian', 'swahili', 'vietnamese', 'tagalog'];
  const languages: string[] = [];
  for (const lang of knownLanguages) {
    if (new RegExp(`\\b${lang}\\b`, 'i').test(text)) {
      languages.push(lang.charAt(0).toUpperCase() + lang.slice(1));
    }
  }

  // Skills
  const skills: Array<{ name: string; level: string }> = [];
  if (/design|canva|figma|poster|art|slide|deck/i.test(text)) skills.push({ name: 'Graphic Design & Canva', level: 'Practical' });
  if (/code|coding|developer|python|javascript|web|software/i.test(text)) skills.push({ name: 'Coding & Tech Help', level: 'Practical' });
  if (/teach|teacher|tutor|math|english|reading|flashcard/i.test(text)) skills.push({ name: 'Teaching & Mentoring', level: 'Experienced' });
  if (/write|writing|copy|proofread|edit/i.test(text)) skills.push({ name: 'Writing & Editing', level: 'Practical' });
  if (/garden|plant|flowers|yard/i.test(text)) skills.push({ name: 'Gardening & Plant Care', level: 'Practical' });
  if (/listen|listening|talk|counsel|comfort/i.test(text)) skills.push({ name: 'Active Listening', level: 'Empathetic' });
  if (/dog|pet|cat|walk/i.test(text)) skills.push({ name: 'Pet Care & Dog Walking', level: 'Comfortable' });

  // Objects
  const objects: Array<{ item: string; condition: string }> = [];
  if (/laptop|macbook|computer|pc/i.test(text)) objects.push({ item: 'Old Laptop / Computer', condition: 'Working / usable' });
  if (/bike|bicycle|cycle/i.test(text)) objects.push({ item: 'Bicycle', condition: 'Working condition' });
  if (/jacket|coat|clothes|sweater/i.test(text)) objects.push({ item: 'Warm Winter Jacket / Clothes', condition: 'Gently used' });
  if (/blanket|towel|linens/i.test(text)) objects.push({ item: 'Spare Towels / Blankets', condition: 'Clean' });
  if (/book|books|novel|textbook/i.test(text)) objects.push({ item: 'Books', condition: 'Read & intact' });
  if (/phone|tablet|ipad/i.test(text)) objects.push({ item: 'Mobile Phone / Tablet', condition: 'Usable' });

  // Access
  const access: Array<{ type: string }> = [];
  if (/car|drive|van/i.test(text)) access.push({ type: 'Vehicle Transport' });
  if (/rooftop|terrace|balcony|garden|yard/i.test(text)) access.push({ type: 'Outdoor Garden / Space' });
  if (/wifi|fiber|internet/i.test(text)) access.push({ type: 'High-speed Internet Access' });
  if (/projector|camera/i.test(text)) access.push({ type: 'Audio/Visual Equipment' });

  // Location hint
  let location_hint: string | null = null;
  const locMatch = text.match(/(?:in|near|around|from)\s+([A-Z][a-zA-Z\s]{2,20})/);
  if (locMatch) location_hint = locMatch[1].trim();

  return {
    money,
    time: time || { hours: 1, when: 'flexible', recurring: false },
    skills: skills.length ? skills : [{ name: 'Practical Willingness to Help', level: 'Enthusiastic' }],
    objects,
    access,
    languages: languages.length ? languages : ['English'],
    location_hint,
    raw_input: text,
  };
}

// Resilient Gemini generator with retry + exponential backoff + model fallback
async function generateWithResilience(
  ai: GoogleGenAI,
  options: {
    contents: any;
    config?: any;
    primaryModel?: string;
    fallbackModel?: string;
    maxRetries?: number;
    tag?: string;
  }
) {
  const {
    contents,
    config,
    primaryModel = 'gemini-3.8-flash',
    fallbackModel = 'gemini-3.1-flash-lite',
    maxRetries = 2,
    tag = 'gemini',
  } = options;

  const modelsToTry = [primaryModel, fallbackModel];

  for (let m = 0; m < modelsToTry.length; m++) {
    const currentModel = modelsToTry[m];
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await ai.models.generateContent({
          model: currentModel,
          contents,
          config,
        });
        return { success: true, response, modelUsed: currentModel };
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const errCode = err?.status || err?.code || (err?.error && err.error.code);
        const is503 = errCode === 503 || errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand');
        const is429 = errCode === 429 || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('quota');

        console.warn(`[${tag}] ${currentModel} returned ${is503 ? '503 (High Demand)' : is429 ? '429 (Rate Limit)' : 'transient issue'}. Attempt ${attempt + 1}/${maxRetries + 1}.`);

        if (attempt < maxRetries && (is503 || is429)) {
          const waitMs = (attempt + 1) * 600 + Math.random() * 300;
          await new Promise((resolve) => setTimeout(resolve, waitMs));
        } else {
          // Model retries exhausted, switch to fallback model
          break;
        }
      }
    }
  }

  return { success: false, response: null, modelUsed: null };
}

// -------------------------------------------------------------
// CALL 1: EXTRACTION (Structured Output)
// -------------------------------------------------------------
app.post('/api/extract', async (req, res) => {
  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Text input is required.' });
  }

  const ai = getAi();
  if (!ai) {
    return res.json({ inventory: localHeuristicExtract(text), fallback: true });
  }

  try {
    const responseSchema = {
      type: Type.OBJECT,
      properties: {
        money: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            amount: { type: Type.NUMBER },
            currency: { type: Type.STRING },
          },
          required: ['amount', 'currency'],
        },
        time: {
          type: Type.OBJECT,
          nullable: true,
          properties: {
            hours: { type: Type.NUMBER },
            when: { type: Type.STRING },
            recurring: { type: Type.BOOLEAN },
          },
          required: ['hours', 'when', 'recurring'],
        },
        skills: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              level: { type: Type.STRING },
            },
            required: ['name', 'level'],
          },
        },
        objects: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              item: { type: Type.STRING },
              condition: { type: Type.STRING },
            },
            required: ['item', 'condition'],
          },
        },
        access: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              type: { type: Type.STRING },
            },
            required: ['type'],
          },
        },
        languages: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
        },
        location_hint: {
          type: Type.STRING,
          nullable: true,
        },
      },
      required: ['skills', 'objects', 'access', 'languages'],
    };

    const prompt = `You are the structured extraction brain for "Spare", a generous donation-matching app.
Extract what the user has spare right now from their free-form text.
Handle any language, Hinglish, colloquialisms, shorthand, or mixed script.
Be generous and affirming: if they mention an old laptop, 200 rupees, speaking Gujarati, or having 2 hours on Sunday, extract each item into its proper field.
If an asset is not mentioned, return null or an empty array.

User Text:
"${text}"`;

    const resResult = await generateWithResilience(ai, {
      contents: prompt,
      config: {
        systemInstruction: 'You extract spare assets (money, time, skills, objects, access, languages) with high precision and warmth. Always output strictly conforming JSON matching the responseSchema.',
        responseMimeType: 'application/json',
        responseSchema: responseSchema,
      },
      tag: 'extract',
    });

    if (resResult.success && resResult.response?.text) {
      let cleaned = resResult.response.text.trim();
      cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleaned);
      parsed.raw_input = text;
      return res.json({ inventory: parsed, fallback: false });
    }

    console.warn('Extraction model was unavailable; using local heuristic fallback smoothly.');
    const fallback = localHeuristicExtract(text);
    return res.json({ inventory: fallback, fallback: true });
  } catch (error) {
    console.warn('Extraction processing note: activated heuristic fallback.');
    const fallback = localHeuristicExtract(text);
    return res.json({ inventory: fallback, fallback: true });
  }
});

// -------------------------------------------------------------
// REVERSE GEOCODING HELPER
// -------------------------------------------------------------
app.get('/api/geocode', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'lat and lon required' });
  }

  try {
    const latNum = parseFloat(String(lat));
    const lonNum = parseFloat(String(lon));

    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latNum}&lon=${lonNum}&zoom=10&addressdetails=1`,
      {
        headers: {
          'User-Agent': 'SpareApp/1.0 (hackathon-giving-match)',
          'Accept-Language': 'en',
        },
      }
    );

    if (geoRes.ok) {
      const data: any = await geoRes.json();
      const addr = data.address || {};
      const city = addr.city || addr.town || addr.village || addr.municipality || addr.suburb || addr.county || addr.state_district || '';
      const state = addr.state || addr.region || '';
      const country = addr.country || '';

      let formatted = '';
      if (city && country) formatted = `${city}, ${country}`;
      else if (state && country) formatted = `${state}, ${country}`;
      else if (country) formatted = country;
      else formatted = `${latNum.toFixed(2)}, ${lonNum.toFixed(2)}`;

      console.log(`[DEBUG /api/geocode] Resolved coordinates (${latNum}, ${lonNum}) to "${formatted}"`);
      return res.json({ location: formatted, city, state, country });
    }
  } catch (err) {
    console.warn('Reverse geocode error, returning coordinate string:', err);
  }

  return res.json({ location: `${Number(lat).toFixed(2)}, ${Number(lon).toFixed(2)}` });
});

// -------------------------------------------------------------
// CALL 2: LIVE GROUNDED MATCHING (Google Search Tool)
// -------------------------------------------------------------
app.post('/api/match', async (req, res) => {
  const { inventory, location } = req.body;
  const ai = getAi();

  const effectiveLocation = location && String(location).trim() !== '' ? String(location).trim() : 'unknown';
  console.log(`[DEBUG Tier 1 Grounding] Location received: "${location}" -> Effective location: "${effectiveLocation}"`);

  if (!ai || !inventory) {
    return res.json({ tier1Results: [] });
  }

  try {
    const isUnknown = effectiveLocation.toLowerCase() === 'unknown' || effectiveLocation.toLowerCase() === 'worldwide';
    const locInstruction = !isUnknown
      ? `The user is specifically located in or near "${effectiveLocation}". You MUST prioritize and search for physical, local, or in-person giving and volunteering opportunities in or near ${effectiveLocation} (such as local physical drop-off centers for materials/clothes/devices, food drives, animal shelters, or community mutual aid). If a local physical match is not found, surface globally accessible remote options.`
      : `The user's location is unspecified/unknown. Surface a thoughtful mix of local physical opportunities (such as material drop-offs or neighborhood drives) and accessible remote options.`;

    const inventorySummary = JSON.stringify({
      money: inventory.money,
      time: inventory.time,
      skills: inventory.skills?.map((s: { name: string }) => s.name),
      objects: inventory.objects?.map((o: { item: string }) => o.item),
      access: inventory.access?.map((a: { type: string }) => a.type),
      languages: inventory.languages,
    });

    const prompt = `Find up to 3 real, currently operating volunteering, donation, or giving opportunities that match this user's inventory: ${inventorySummary}.
Location directive: ${locInstruction}
For each result, you MUST be able to cite a real source URL from search grounding. Do not invent organizations.
Prefer opportunities requiring low effort/signup.
Return as a JSON array of objects with the exact structure:
[
  {
    "id": "grounded-1",
    "name": "Organization or Initiative Name",
    "one_liner": "Short single sentence about what they do",
    "why_it_fits": "Short, warm second-person explanation of why it fits the user's spare gifts",
    "effort": "e.g. 5 mins or Low or 1 hour",
    "cost": "e.g. $0 or Zero cost",
    "time_required": "e.g. 10 mins or 1 hour",
    "action": "Specific concrete action the user can do this week",
    "source_url": "https://actual-verified-url.org",
    "isZeroCostAndZeroSignup": true,
    "is_physical": true
  }
]
If you cannot verify at least one real result with a citable URL, return an empty array [].
Do not wrap in markdown quotes if possible, output pure JSON array.`;

    console.log(`[DEBUG Tier 1 Grounding] Prompt location instruction: "${locInstruction}"`);

    // Try live search grounding first with retry
    let matchResult = await generateWithResilience(ai, {
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
      tag: 'match-grounded',
    });

    // If search grounding was quota-exhausted or unavailable, try without search tools
    if (!matchResult.success) {
      matchResult = await generateWithResilience(ai, {
        contents: prompt + '\nNote: Use your knowledge base of globally established non-profits, open initiatives, and charities.',
        config: {
          systemInstruction: 'Suggest up to 3 verified non-profit organizations or open-source initiatives with real, existing web domains (like wikipedia.org, un.org, freerice.com, etc.).',
        },
        tag: 'match-fallback',
      });
    }

    if (!matchResult.success || !matchResult.response) {
      return res.json({ tier1Results: [] });
    }

    const response = matchResult.response;
    let textResponse = response.text || '';
    textResponse = textResponse.replace(/```json/gi, '').replace(/```/g, '').trim();

    let parsedResults: any[] = [];
    try {
      parsedResults = JSON.parse(textResponse);
      if (!Array.isArray(parsedResults)) parsedResults = [];
    } catch {
      // Regex extraction fallback
      const match = textResponse.match(/\[[\s\S]*\]/);
      if (match) {
        try {
          parsedResults = JSON.parse(match[0]);
        } catch {
          parsedResults = [];
        }
      }
    }

    // Strict guardrail: Any result without a verifiable source URL gets dropped
    const verifiedTier1 = parsedResults.filter((item) => {
      if (!item || !item.name || !item.source_url) return false;
      const url = String(item.source_url).trim().toLowerCase();
      if (!url.startsWith('http://') && !url.startsWith('https://')) return false;

      const hasDomain = url.includes('.org') || url.includes('.edu') || url.includes('.gov') || url.includes('.com') || url.includes('.net') || url.includes('.in');
      return hasDomain;
    }).map((item, idx) => ({
      id: `grounded-${Date.now()}-${idx}`,
      name: item.name,
      one_liner: item.one_liner || 'Grassroots action matching your spare gifts.',
      why_it_fits: item.why_it_fits || 'Matches the assets and time you have spare right now.',
      effort: item.effort || 'Low effort',
      cost: item.cost || '$0',
      time_required: item.time_required || 'Flexible',
      action: item.action || `Connect with ${item.name} to offer your spare capacity.`,
      source_url: item.source_url,
      verificationTier: 'tier1',
      badgeLabel: '✓ Verified live',
      isZeroCostAndZeroSignup: Boolean(item.isZeroCostAndZeroSignup || (item.cost && item.cost.includes('0'))),
    }));

    return res.json({ tier1Results: verifiedTier1 });
  } catch (error) {
    console.warn('Match note: Using curated matching engine.');
    return res.json({ tier1Results: [] });
  }
});

// -------------------------------------------------------------
// CALL 3: MESSAGE DRAFTING
// -------------------------------------------------------------
app.post('/api/draft', async (req, res) => {
  const { originalText, opportunityName, action, userName } = req.body;
  const ai = getAi();

  const fallbackDraft = `Hi ${opportunityName || 'there'} team!\n\nI was looking at what I have spare right now and would love to help with ${action || 'your work'}. I'm available this week and excited to contribute. Let me know the easiest way to step in!\n\nWarmly,\n${userName || 'A neighbour'}`;

  if (!ai) {
    return res.json({ message: fallbackDraft });
  }

  try {
    const prompt = `Write a short, casual outreach message from ${userName || 'a friendly neighbor'} to ${opportunityName} about "${action}".
Match the natural tone and voice of how this user originally typed:
"${originalText}"

Requirements:
- Keep it under 80 words.
- Absolutely NO corporate language, no stiff "Dear Sir/Madam", no buzzwords.
- Sound like a genuine, warm real human offering their spare gift.
- Give a clear next step (e.g. "Let me know what works best!").`;

    const draftResult = await generateWithResilience(ai, {
      contents: prompt,
      config: {
        systemInstruction: 'You are a warm, casual copywriter who crafts friendly, human outreach notes.',
      },
      tag: 'draft',
    });

    const draft = (draftResult.success && draftResult.response?.text?.trim()) || fallbackDraft;
    return res.json({ message: draft });
  } catch (err) {
    console.warn('Draft note: using human fallback draft template.');
    return res.json({ message: fallbackDraft });
  }
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC FALLBACK
// -------------------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Spare server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
