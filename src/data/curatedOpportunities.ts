import { Opportunity, UserInventory, PersonaDemo } from '../types';

export const DEMO_PERSONAS: PersonaDemo[] = [
  {
    id: 'student',
    title: 'A broke student',
    icon: '🎒',
    role: 'Zero cash, multilingual & 3 hours on Sunday',
    prompt: 'I have 0 money right now, but I speak Spanish and Hindi fluently, have 3 free hours on Sunday afternoon, and know how to make clean Canva slide decks or study flashcards.',
    location: 'Chicago',
  },
  {
    id: 'professional',
    title: 'A busy professional',
    icon: '💼',
    role: 'Money & gear, but zero weekday time',
    prompt: 'I have 2,500 rupees (or $35) spare this month, zero free weekdays, but have a high-spec MacBook with fast fiber wifi, a spare warm winter jacket in size L, and could chip in micro-funds.',
    location: 'Bengaluru, India',
  },
  {
    id: 'retiree',
    title: 'A retiree with time',
    icon: '🌱',
    role: 'Abundant weekdays & a friendly neighbourhood',
    prompt: 'I am a retired math teacher with weekday afternoons wide open, love gardening, have a working spare bicycle in my shed, and enjoy walking dogs in my local neighbourhood.',
    location: 'Bristol, UK',
  },
];

export interface CuratedOpportunityItem extends Omit<Opportunity, 'why_it_fits'> {
  defaultWhy: string;
  matchTokens: string[];
  types: Array<'money' | 'time' | 'skills' | 'objects' | 'access' | 'languages' | 'micro'>;
}

export const CURATED_OPPORTUNITIES: CuratedOpportunityItem[] = [
  {
    id: 'goonj-materials',
    name: 'Goonj',
    one_liner: 'Turns your unused clothes, footwear, and household goods into dignity and disaster relief for rural India.',
    defaultWhy: 'Your spare clothing, footwear, and household items are sorted into life-saving disaster relief and rural development kits.',
    capital_types: ['objects'],
    object_types: ['clothing', 'footwear', 'household goods', 'stationery', 'furniture', 'blankets'],
    effort: 'low',
    cost: 'free',
    time_required: 'one drop-off, ~30 min',
    signup_required: false,
    geography: 'pan-India, drop centres in most metros',
    languages: ['any'],
    action: 'Find your nearest drop centre and take your usable items there.',
    registered_since: 1999,
    source_url: 'https://goonj.org/dropping-centres/',
    source_note: 'Official Goonj dropping-centres page, cross-confirmed via Wikipedia (est. 1999, HQ New Delhi).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'objects',
    matchTokens: ['clothes', 'clothing', 'jacket', 'coat', 'shoes', 'footwear', 'blanket', 'household', 'stationery', 'furniture', 'dropoff', 'india', 'delhi', 'mumbai', 'bengaluru', 'pune', 'goods'],
    types: ['objects', 'micro'],
  },
  {
    id: 'rha-food',
    name: 'Robin Hood Army',
    one_liner: 'A zero-funds volunteer network that moves surplus restaurant and event food to people who need it, same day.',
    defaultWhy: 'Turn a few spare weekend hours into delivering fresh surplus food to homeless shelters and underserved neighborhoods.',
    capital_types: ['time', 'objects'],
    object_types: ['surplus food'],
    effort: 'low',
    cost: 'free',
    time_required: 'one distribution run, 1-3 hrs, weekends',
    signup_required: true,
    geography: '400+ cities across India and abroad',
    languages: ['any'],
    action: "Sign up as a 'Robin' on their site; a local chapter will loop you into the next drive.",
    registered_since: 2014,
    source_url: 'https://robinhoodarmy.com/sites/main/join-us',
    source_note: 'Official join page, cross-confirmed via Wikipedia (founded 26 Aug 2014, zero-funds volunteer model).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: true,
    isZeroCostAndZeroSignup: false,
    category: 'time',
    matchTokens: ['food', 'meal', 'surplus', 'hunger', 'weekend', 'sunday', 'saturday', 'distribution', 'drive', 'volunteer', 'delhi', 'mumbai', 'bengaluru', 'pune', 'chennai', 'kolkata'],
    types: ['time', 'objects'],
  },
  {
    id: 'evidyaloka-teach',
    name: 'eVidyaloka',
    one_liner: 'Teach a rural government-school class for two hours a week, over video call, in your own regional language.',
    defaultWhy: 'Your teaching and regional language fluency bring interactive digital classes directly to rural children.',
    capital_types: ['time', 'skills', 'language'],
    skill_types: ['teaching', 'science', 'math', 'english'],
    effort: 'medium',
    cost: 'free',
    time_required: '2 hrs/week, ongoing commitment',
    signup_required: true,
    geography: 'remote, from home; schools across 17 Indian states',
    languages: ['Hindi', 'Tamil', 'Telugu', 'Kannada', 'Gujarati', 'Marathi', 'Bengali', 'Odia', 'regional languages'],
    action: 'Register as a volunteer teacher; attend the intro session before your first class.',
    registered_since: 2011,
    source_url: 'https://www.evidyaloka.org/volunteer',
    source_note: 'Official volunteer page, cross-confirmed via Wikipedia (founded Jan 2011 by Satish & Venkat).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: false,
    isZeroCostAndZeroSignup: false,
    category: 'skills',
    matchTokens: ['teach', 'math', 'science', 'english', 'teacher', 'tutor', 'hindi', 'tamil', 'telugu', 'kannada', 'gujarati', 'marathi', 'bengali', 'odia', 'school', 'kids', 'children'],
    types: ['time', 'skills', 'languages'],
  },
  {
    id: 'eraktkosh-blood',
    name: 'e-RaktKosh (Govt. of India)',
    one_liner: "The government's own blood bank locator. One donation can be split into components that help up to four patients.",
    defaultWhy: 'Walk into any verified blood bank near you — a 20-minute donation can save up to four lives in trauma or surgery.',
    capital_types: ['access', 'objects'],
    effort: 'low',
    cost: 'free',
    time_required: '15-30 min including screening',
    signup_required: false,
    geography: 'pan-India, government-run blood banks',
    languages: ['any'],
    action: 'Find your nearest blood bank on the portal and walk in.',
    source_url: 'https://eraktkosh.mohfw.gov.in/BLDAHIMS/bloodbank/transactions/bbpublicindex.html',
    source_note: 'Official Ministry of Health & Family Welfare portal, cross-confirmed via India.gov.in and services.india.gov.in.',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'access',
    matchTokens: ['blood', 'health', 'hospital', 'doctor', 'walk', 'quick', 'donor', 'donate', 'delhi', 'mumbai', 'bengaluru', 'hyderabad', 'chennai', 'pan-india'],
    types: ['access', 'micro', 'objects'],
  },
  {
    id: 'connectfor-skills',
    name: 'ConnectFor',
    one_liner: 'Matches your specific professional skill — design, writing, fundraising, research, marketing — to an NGO that needs exactly that, often remotely.',
    defaultWhy: 'Your professional skill saves grassroots NGOs tens of thousands of rupees in creative and strategy expenses.',
    capital_types: ['skills', 'time'],
    skill_types: ['design', 'writing', 'marketing', 'fundraising', 'research', 'teaching', 'social media'],
    effort: 'medium',
    cost: 'free',
    time_required: 'varies by project, remote options available',
    signup_required: true,
    geography: 'Mumbai, Bengaluru, Pune, Delhi, Ahmedabad + remote',
    languages: ['English', 'Hindi'],
    action: 'Register on ConnectFor and browse skill-based opportunities matching your expertise.',
    registered_since: 2015,
    source_url: 'https://connectfor.org/volunteer',
    source_note: "Official volunteer registration page, cross-confirmed via ConnectFor's project history page and LinkedIn.",
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: false,
    isZeroCostAndZeroSignup: false,
    category: 'skills',
    matchTokens: ['design', 'canva', 'figma', 'writing', 'marketing', 'fundraising', 'research', 'teaching', 'social media', 'slides', 'deck', 'mumbai', 'bengaluru', 'pune', 'delhi', 'ahmedabad'],
    types: ['skills', 'time'],
  },
  {
    id: 'helpage-support',
    name: 'HelpAge India — Support a Gran',
    one_liner: 'Sponsor monthly rations and essentials for one destitute elder living in an old-age home, or simply spend time with them.',
    defaultWhy: 'Your spare funds or weekend companionship ensure neglected senior citizens receive daily food, dignity, and care.',
    capital_types: ['money', 'time'],
    effort: 'low',
    cost: 'small recurring or one-time',
    time_required: 'one-time signup, or a visit/call',
    signup_required: true,
    geography: '300+ old-age homes across India',
    languages: ['any'],
    action: 'Sponsor a Gran online, or contact HelpAge to arrange a visit/call with elders near you.',
    registered_since: 1978,
    source_url: 'https://www.helpageindia.org/our-work/agecare/support-a-gran',
    source_note: 'Official HelpAge India programme page, cross-confirmed via Wikipedia (founded 1978).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: true,
    isZeroCostAndZeroSignup: false,
    category: 'money',
    matchTokens: ['elderly', 'elder', 'old age', 'rations', 'gran', 'grandmother', 'money', 'rupees', 'time', 'visit', 'delhi', 'mumbai', 'bengaluru', 'india'],
    types: ['money', 'time'],
  },
  {
    id: 'bhumi-volunteer',
    name: 'Bhumi',
    one_liner: "India's largest youth volunteering movement — weekend teaching, environment drives, and civic projects for underprivileged children.",
    defaultWhy: 'Join local youth squads for weekend educational mentoring, STEM teaching, and city greening drives.',
    capital_types: ['time', 'skills'],
    skill_types: ['teaching', 'mentoring', 'event organising', 'STEM'],
    effort: 'medium',
    cost: 'free',
    time_required: 'weekends, ongoing',
    signup_required: true,
    geography: '14+ Indian cities including Chennai, Bengaluru, Mumbai, Delhi, Pune, Kolkata',
    languages: ['English', 'regional languages'],
    action: 'Sign up as a volunteer on bhumi.ngo and pick a city-specific programme.',
    registered_since: 2006,
    source_url: 'https://www.bhumi.ngo/volunteer',
    source_note: 'Official volunteer page, cross-confirmed via Wikipedia (founded 15 Aug 2006, Chennai).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'india',
    is_physical: true,
    isZeroCostAndZeroSignup: false,
    category: 'time',
    matchTokens: ['chennai', 'bengaluru', 'mumbai', 'delhi', 'pune', 'kolkata', 'teach', 'stem', 'mentor', 'weekend', 'youth', 'trees', 'civic', 'india'],
    types: ['time', 'skills'],
  },
  {
    id: 'unbrokered-neighbour-teach',
    name: 'Teach one child in your building or street',
    one_liner: 'No org, no signup — spend an hour a week helping a domestic worker’s or watchman’s child with schoolwork.',
    defaultWhy: 'The most direct, high-impact giving starts right on your own floor or street corner without waiting for an NGO.',
    capital_types: ['time', 'skills', 'language'],
    effort: 'low',
    cost: 'free',
    time_required: '1 hr/week, flexible',
    signup_required: false,
    geography: 'wherever you live',
    languages: ['any'],
    action: 'Ask around your building or neighbourhood — this need almost always exists nearby.',
    unbrokered: true,
    source_url: 'https://www.unicef.org/education',
    source_note: 'Direct neighbor mutual action pattern, recommended for zero-signup grassroots empowerment.',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'global',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'skills',
    matchTokens: ['teach', 'neighbor', 'neighbour', 'homework', 'math', 'reading', 'child', 'school', 'street', 'building', 'hour'],
    types: ['time', 'skills', 'languages', 'micro'],
  },
  {
    id: 'unbrokered-repair-donate',
    name: 'Fix and hand over your old device',
    one_liner: 'A working laptop or phone changes what a student can do. Skip the resale, give it directly to someone who needs it.',
    defaultWhy: 'Factory-reset that dusty laptop or phone and hand it straight to a student who needs access to classes and career tools.',
    capital_types: ['objects', 'skills'],
    object_types: ['laptop', 'phone', 'tablet'],
    effort: 'medium',
    cost: 'free (your time to fix/wipe it)',
    time_required: 'a few hours',
    signup_required: false,
    geography: 'anywhere',
    geography_scope: 'global',
    languages: ['any'],
    action: 'Factory-reset it, do a basic check-up, and give it to a student or NGO directly, or route it through Goonj.',
    unbrokered: true,
    source_url: 'https://www.electronicstakeback.com/',
    source_note: 'Direct hardware handover guide.',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'objects',
    matchTokens: ['laptop', 'macbook', 'phone', 'tablet', 'pc', 'computer', 'reset', 'wipe', 'fix', 'repair', 'device', 'electronics'],
    types: ['objects', 'skills'],
  },
  {
    id: 'bemyeyes-vision',
    name: 'Be My Eyes',
    one_liner: 'Answer a video call from someone blind or low-vision and describe what your camera sees — reading a label, matching socks, checking a date. A few minutes, from your phone.',
    defaultWhy: 'Lend your sight for 2 to 4 minutes through an on-demand video call to read a label, medication expiry, or thermostat.',
    capital_types: ['time', 'access'],
    effort: 'low',
    cost: 'free',
    time_required: 'a few minutes per call, whenever you’re free',
    signup_required: true,
    geography: 'worldwide, app-based',
    geography_scope: 'global',
    languages: ['185+ languages supported; matched to your language automatically'],
    action: 'Install the Be My Eyes app and register as a sighted volunteer; you’ll only get calls during your set daytime hours.',
    founded: 2015,
    source_url: 'https://www.bemyeyes.com/be-my-eyes-volunteer-hub/',
    source_note: 'Official Be My Eyes volunteer hub, cross-confirmed via bemyeyes.com and Google Play listing (150 countries).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    is_physical: false,
    isZeroCostAndZeroSignup: true,
    category: 'micro',
    matchTokens: ['minute', 'time', 'phone', 'camera', 'english', 'hindi', 'spanish', 'see', 'sight', 'blind', 'vision'],
    types: ['micro', 'time', 'access'],
  },
  {
    id: 'twb-translate',
    name: 'Translators without Borders',
    one_liner: 'Translate or subtitle vital information — medical guidance, crisis alerts, refugee resources — into a language you speak. Fully remote, no certification required.',
    defaultWhy: 'Your language skills bridge emergency healthcare guides and refugee aid notices into languages people understand.',
    capital_types: ['skills', 'language', 'time'],
    skill_types: ['translation', 'subtitling', 'voice-over'],
    effort: 'medium',
    cost: 'free',
    time_required: 'claim tasks as available, self-paced',
    signup_required: true,
    geography: 'fully remote, worldwide',
    geography_scope: 'global',
    languages: ['200+ language pairs'],
    action: 'Register on the TWB Platform, add your language pairs, and claim an available task from the dashboard.',
    founded: 1993,
    source_url: 'https://translatorswithoutborders.org/volunteer/non-translators-application/',
    source_note: 'Official TWB volunteer registration page.',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    is_physical: false,
    isZeroCostAndZeroSignup: false,
    category: 'languages',
    matchTokens: ['spanish', 'hindi', 'gujarati', 'tamil', 'arabic', 'french', 'translation', 'translate', 'subtitles', 'language'],
    types: ['languages', 'skills', 'time'],
  },
  {
    id: 'unv-online-volunteering',
    name: 'UN Volunteers — Online Volunteering',
    one_liner: 'Donate a skill — research, design, proofreading, data analysis, translation — to a UN agency or NGO for a few hours a week, fully remote, from any country.',
    defaultWhy: 'Direct your professional craft (design, research, or writing) into global peace and development missions with the UN.',
    capital_types: ['skills', 'time'],
    skill_types: ['research', 'graphic design', 'proofreading', 'translation', 'data analysis', 'writing'],
    effort: 'medium',
    cost: 'free',
    time_required: 'up to 20 hrs/week, assignments run up to 12 weeks',
    signup_required: true,
    geography: 'fully remote, open worldwide regardless of location',
    geography_scope: 'global',
    languages: ['English', 'French', 'Spanish', 'others by assignment'],
    action: 'Create a profile on the UNV Unified Volunteering Platform and apply to an assignment matching your skills.',
    source_url: 'https://www.unv.org/become-online-volunteer',
    source_note: 'Official UNV page (12,000+ online volunteers/year).',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    is_physical: false,
    isZeroCostAndZeroSignup: false,
    category: 'skills',
    matchTokens: ['un', 'research', 'design', 'canva', 'proofread', 'data', 'writing', 'remote', 'skills'],
    types: ['skills', 'time'],
  },
  {
    id: 'givedirectly-cash',
    name: 'GiveDirectly',
    one_liner: 'Send money straight to a family living in extreme poverty, no intermediary programs — and see exactly what share reaches them.',
    defaultWhy: 'Give unconditional digital cash directly to vulnerable families with complete transfer transparency.',
    capital_types: ['money'],
    effort: 'low',
    cost: 'any amount you choose',
    time_required: 'a few minutes',
    signup_required: false,
    geography: 'recipients across Africa, and disaster/poverty programs in the US',
    geography_scope: 'global',
    languages: ['any'],
    action: 'Donate any amount directly on their site; their financials page shows exactly what share reaches recipients vs. delivery cost.',
    founded: 2008,
    source_url: 'https://www.givedirectly.org/',
    source_note: 'Official GiveDirectly site and financials page.',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    is_physical: false,
    isZeroCostAndZeroSignup: false,
    category: 'money',
    matchTokens: ['money', 'cash', 'rupees', 'dollar', 'euro', 'funds', 'donate', 'cents', 'inr'],
    types: ['money'],
  },
  {
    id: 'curated-littlefreelibrary',
    name: 'Little Free Library Book Drop',
    one_liner: 'Place beloved books you’ve finished into neighborhood curbside exchange boxes.',
    defaultWhy: 'Your read books spark curiosity and literacy in children and neighbors on everyday neighborhood strolls.',
    effort: 'Immediate (walk by)',
    cost: 'free',
    time_required: '10 mins',
    action: 'Drop off gently read novels, children’s books, or textbooks into a nearby micro-library box.',
    source_url: 'https://littlefreelibrary.org/map/',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'global',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'objects',
    matchTokens: ['book', 'novel', 'textbook', 'walk', 'neighborhood', 'read', 'kid', 'library'],
    types: ['objects', 'micro', 'time'],
  },
  {
    id: 'curated-animalshelter',
    name: 'Local Rescue Shelter Towel & Blanket Drive',
    one_liner: 'Donate spare towels, blankets, old sheets, and pet crates to keep rescue animals cozy.',
    defaultWhy: 'Animal shelters go through dozens of laundered blankets every day to comfort healing rescue pets.',
    effort: 'Low (bag & drop)',
    cost: 'free',
    time_required: '20 mins',
    action: 'Drop off clean, retired towels or warm linens at any local animal shelter or humane rescue center.',
    source_url: 'https://www.humanesociety.org/resources/how-help-your-local-animal-shelter',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'global',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'objects',
    matchTokens: ['towel', 'blanket', 'jacket', 'clothes', 'coat', 'dog', 'pet', 'cat', 'fabric', 'sheet', 'shelter', 'animal'],
    types: ['objects', 'micro', 'time'],
  },
  {
    id: 'curated-neighborhood-mutualaid',
    name: 'Neighborhood Tool & Gear Sharing',
    one_liner: 'Lend your spare bike, ladder, tools, or garden plot to local community initiatives.',
    defaultWhy: 'Sharing access to tools and transport keeps neighborly resilience high without anyone buying new gear.',
    effort: 'Local (On your terms)',
    cost: 'free',
    time_required: 'Flexible',
    action: 'Offer your spare gear or gardening hands to a nearby community garden or local youth group.',
    source_url: 'https://www.mutualaidhub.org/',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'global',
    is_physical: true,
    isZeroCostAndZeroSignup: true,
    category: 'access',
    matchTokens: ['bicycle', 'bike', 'garden', 'tools', 'neighbourhood', 'neighborhood', 'shed', 'dog', 'local', 'rooftop', 'car', 'ladder'],
    types: ['access', 'objects', 'time'],
  },
  {
    id: 'curated-freerice',
    name: 'Freerice (UN World Food Programme)',
    one_liner: 'Answer fun trivia & vocabulary questions; private sponsors donate real rice to the WFP for each answer.',
    defaultWhy: 'Turn 5 idle minutes into grain donations with zero money spent and zero signup needed.',
    effort: 'Zero barrier (5 mins)',
    cost: 'free',
    time_required: '5 mins',
    action: 'Play interactive trivia online while waiting for a bus or during a tea break to generate food aid.',
    source_url: 'https://freerice.com/',
    verificationTier: 'tier2',
    badgeLabel: '✓ Hand-checked',
    geography_scope: 'global',
    is_physical: false,
    isZeroCostAndZeroSignup: true,
    category: 'micro',
    matchTokens: ['bored', 'free', 'trivia', 'game', 'micro', 'food', 'hunger', 'break', 'vocabulary'],
    types: ['micro', 'time'],
  },
];

/**
 * Checks whether a location string corresponds to India (cities, states, or country terms).
 */
export function isIndiaLocation(loc: string): boolean {
  if (!loc) return false;
  const l = loc.toLowerCase().trim();
  if (l === 'unknown' || l === 'worldwide' || l === 'anywhere' || l === 'global') return false;

  const indianKeywords = [
    'india', 'bharat', 'delhi', 'new delhi', 'ncr', 'mumbai', 'bombay', 'bengaluru', 'bangalore',
    'chennai', 'madras', 'kolkata', 'calcutta', 'hyderabad', 'pune', 'ahmedabad',
    'jaipur', 'gurgaon', 'gurugram', 'noida', 'chandigarh', 'lucknow', 'indore',
    'kochi', 'cochin', 'patna', 'bhopal', 'nagpur', 'vadodara', 'baroda', 'ghaziabad',
    'ludhiana', 'agra', 'nashik', 'surat', 'varanasi', 'kanpur', 'amritsar', 'mysore',
    'mysuru', 'coimbatore', 'thiruvananthapuram', 'trivandrum', 'goa', 'kerala', 'karnataka',
    'tamil nadu', 'maharashtra', 'gujarat', 'rajasthan', 'punjab', 'haryana', 'uttar pradesh',
    'bengal', 'west bengal', 'telangana', 'andhra', 'bihar', 'odisha', 'orissa', 'assam'
  ];

  return indianKeywords.some(kw => new RegExp(`\\b${kw}\\b`, 'i').test(l));
}

/**
 * Creates a Tier 3 Idealist fallback card that is guaranteed to render with a real search link.
 */
export function createTier3IdealistCard(cause: string, location: string): Opportunity {
  const cleanCause = encodeURIComponent(cause.trim() || 'community volunteering');
  const locDisplay = location && location.toLowerCase() !== 'unknown' ? location.trim() : 'your area';
  const cleanLoc = encodeURIComponent(location && location.toLowerCase() !== 'unknown' ? location.trim() : 'Worldwide');
  const searchUrl = `https://www.idealist.org/en/volunteer?q=${cleanCause}&location=${cleanLoc}`;

  return {
    id: `idealist-search-${Date.now()}`,
    name: 'Idealist (merged with VolunteerMatch)',
    one_liner: 'The fallback that always works: search 100,000+ live volunteer listings, virtual or in-person, in any country, by cause.',
    why_it_fits: `We mapped your gifts and location to thousands of live, open community postings in ${locDisplay}.`,
    effort: 'Flexible (Choose your pace)',
    cost: 'free',
    time_required: 'Flexible',
    action: `Browse live verified community actions and volunteering calls in ${locDisplay}.`,
    source_url: searchUrl,
    verificationTier: 'tier3',
    badgeLabel: '🔍 Search this for me',
    isZeroCostAndZeroSignup: false,
    category: 'time',
    geography_scope: 'global',
    is_physical: false,
  };
}

/**
 * Intelligent overlap scoring against UserInventory to select the best Curated Opportunities.
 * Respects user location with granular geography-scope weighting:
 * - If location is known and matches geography_scope: scores normally + local boost.
 * - If location is known but outside India: deprioritizes India-scoped entries so global entries rank higher.
 * - If location is unknown: surfaces a mix and labels physical India entries with a note.
 */
export function scoreCuratedOpportunities(
  inventory: UserInventory,
  preferredLocation: string = 'unknown'
): Opportunity[] {
  console.log(`[DEBUG Tier 2 Matcher] scoreCuratedOpportunities called with location: "${preferredLocation}"`);

  const locClean = (preferredLocation || 'unknown').trim();
  const isUnknownLoc = !locClean || locClean.toLowerCase() === 'unknown' || locClean.toLowerCase() === 'worldwide';
  const matchesIndia = isIndiaLocation(locClean);
  const isOutsideIndia = !isUnknownLoc && !matchesIndia;

  const tokens: string[] = [];

  if (inventory.money && inventory.money.amount > 0) {
    tokens.push('money', 'cash', 'donate', inventory.money.currency.toLowerCase());
  }
  if (inventory.time && inventory.time.hours > 0) {
    tokens.push('time', inventory.time.hours <= 1 ? 'micro' : 'weekend');
  }
  inventory.skills.forEach((s) => {
    tokens.push(...s.name.toLowerCase().split(/\s+/));
  });
  inventory.objects.forEach((o) => {
    tokens.push(...o.item.toLowerCase().split(/\s+/));
  });
  inventory.access.forEach((a) => {
    tokens.push(...a.type.toLowerCase().split(/\s+/));
  });
  inventory.languages.forEach((l) => {
    tokens.push(l.toLowerCase(), 'language', 'translate');
  });

  if (inventory.raw_input) {
    tokens.push(...inventory.raw_input.toLowerCase().split(/[ ,.!?\n\r\t]+/));
  }

  const scored = CURATED_OPPORTUNITIES.map((opp) => {
    let score = 0;
    let matchReason = opp.defaultWhy;
    let physicalNote: string | undefined = undefined;

    // Type matching
    if (inventory.money && opp.types.includes('money')) score += 16;
    if (inventory.languages.length > 0 && opp.types.includes('languages')) {
      score += 18;
      matchReason = `Your fluency in ${inventory.languages.join(' and ')} can immediately bridge vital conversations for people in need.`;
    }
    if (inventory.objects.length > 0 && opp.types.includes('objects')) {
      score += 18;
      const firstObj = inventory.objects[0].item;
      matchReason = `Your spare ${firstObj} can be put straight to life-changing daily use instead of sitting idle.`;
    }
    if (inventory.skills.length > 0 && opp.types.includes('skills')) {
      score += 15;
      const firstSkill = inventory.skills[0].name;
      matchReason = `You mentioned knowing ${firstSkill} — grassroots missions need exactly this kind of hands-on expertise.`;
    }
    if (inventory.access.length > 0 && opp.types.includes('access')) {
      score += 14;
      matchReason = `Offering access to your spare assets creates instant community resilience.`;
    }
    if (inventory.time && opp.types.includes('time')) {
      score += 12;
      if (inventory.time.hours <= 1 && opp.isZeroCostAndZeroSignup) {
        score += 8;
        matchReason = `You have ${inventory.time.hours} hour(s) spare; you can complete this micro-action right now in minutes.`;
      }
    }

    // Token matching
    for (const token of tokens) {
      if (token.length > 2 && opp.matchTokens.some((t) => t.includes(token) || token.includes(t))) {
        score += 6;
      }
    }

    // Bonus for zero-cost and zero-signup to encourage accessible high-trust moves
    if (opp.isZeroCostAndZeroSignup) {
      score += 6;
    }

    // -------------------------------------------------------------
    // LOCATION & GEOGRAPHY SCORING RULES
    // -------------------------------------------------------------
    if (matchesIndia) {
      // User is in India
      if (opp.geography_scope === 'india') {
        score += 22; // Strong local boost
        // Check if specific city matches
        const userCityTokens = locClean.toLowerCase().split(/[ ,]+/);
        if (opp.geography && userCityTokens.some(city => city.length > 2 && opp.geography!.toLowerCase().includes(city))) {
          score += 12; // Extra city match bonus!
        }
      } else {
        // Global opportunity works in India as well
        score += 5;
      }
    } else if (isOutsideIndia) {
      // User is outside India (e.g. Chicago, London, Bristol)
      if (opp.geography_scope === 'india') {
        // DEPRIORITIZE: deprioritize so global-scoped entries rank higher, but do not delete
        score -= 28;
        physicalNote = 'Opportunity operations are based in India';
      } else {
        // Global scope
        score += 10;
        if (opp.is_physical) {
          score += 8; // Physical local moves like book drop or animal shelter work anywhere locally!
        }
      }
    } else {
      // Location is unknown/skipped
      // Surface a mix and label physical ones with a note rather than hiding them entirely
      if (opp.geography_scope === 'india') {
        physicalNote = 'Opportunity may require being in India';
        score += 4;
      } else {
        score += 6;
      }
    }

    return {
      id: opp.id,
      name: opp.name,
      one_liner: opp.one_liner,
      why_it_fits: physicalNote ? `${matchReason} (${physicalNote})` : matchReason,
      effort: opp.effort,
      cost: opp.cost,
      time_required: opp.time_required,
      action: opp.action,
      source_url: opp.source_url,
      verificationTier: opp.verificationTier,
      badgeLabel: opp.badgeLabel,
      isZeroCostAndZeroSignup: opp.isZeroCostAndZeroSignup,
      category: opp.category,
      geography_scope: opp.geography_scope,
      geography: opp.geography,
      is_physical: opp.is_physical,
      physicalNote,
      _score: score,
    };
  });

  scored.sort((a, b) => b._score - a._score);
  return scored.map(({ _score, ...rest }) => rest);
}

/**
 * Enforces all Guardrails across Tier 1, Tier 2, and Tier 3:
 * - Exactly 3 opportunities returned
 * - Card 1 must ALWAYS be zero-cost AND zero-signup (lowest-friction by design)
 * - Actively includes at least one physical/local result when location is known and a reasonable local match exists
 * - Prevents all results from accidentally being from one tier or all "global" by default
 * - Fallbacks to Idealist (Tier 3) if slots remain
 */
export function mergeAndRankOpportunities(
  tier1Results: Opportunity[],
  inventory: UserInventory,
  location: string = 'unknown'
): Opportunity[] {
  console.log(`[DEBUG Merge Logic] mergeAndRankOpportunities called with location: "${location}", Tier 1 count: ${tier1Results?.length || 0}`);

  const curated = scoreCuratedOpportunities(inventory, location);

  // Filter Tier 1 to only those with valid verifiable source_url
  const validTier1 = (tier1Results || [])
    .filter(
      (item) =>
        item &&
        item.source_url &&
        (item.source_url.startsWith('http://') || item.source_url.startsWith('https://'))
    )
    .map((item) => {
      const costLower = (item.cost || '').toLowerCase();
      const isZeroCost =
        costLower.includes('$0') ||
        costLower.includes('free') ||
        costLower.includes('zero') ||
        costLower.includes('₹0');
      const actionLower = ((item.action || '') + ' ' + (item.one_liner || '')).toLowerCase();
      const isPhysical =
        actionLower.includes('drop') ||
        actionLower.includes('walk') ||
        actionLower.includes('drive') ||
        actionLower.includes('in-person') ||
        actionLower.includes('center') ||
        actionLower.includes('shelter') ||
        actionLower.includes('food');

      return {
        ...item,
        verificationTier: 'tier1' as const,
        badgeLabel: '✓ Verified live',
        isZeroCostAndZeroSignup: item.isZeroCostAndZeroSignup ?? isZeroCost,
        is_physical: item.is_physical ?? isPhysical,
      };
    });

  // Separate zero-cost/zero-signup pool vs general pool
  const allZeroCostZeroSignup: Opportunity[] = [
    ...validTier1.filter((o) => o.isZeroCostAndZeroSignup),
    ...curated.filter((o) => o.isZeroCostAndZeroSignup),
  ];

  // Guaranteed lowest friction card for Position #1
  const firstCard = allZeroCostZeroSignup[0] || curated[0];

  const pool: Opportunity[] = [];
  const usedIds = new Set<string>([firstCard.id, firstCard.name.toLowerCase()]);

  // Balance Tier 1 & Tier 2:
  // If Tier 1 has items, add the top Tier 1 item first
  if (validTier1.length > 0) {
    for (const item of validTier1) {
      if (!usedIds.has(item.id) && !usedIds.has(item.name.toLowerCase())) {
        pool.push(item);
        usedIds.add(item.id);
        usedIds.add(item.name.toLowerCase());
        break; // Take top 1 to guarantee multi-tier blend
      }
    }
  }

  // Add top Curated items
  for (const item of curated) {
    if (pool.length >= 2) break;
    if (!usedIds.has(item.id) && !usedIds.has(item.name.toLowerCase())) {
      pool.push(item);
      usedIds.add(item.id);
      usedIds.add(item.name.toLowerCase());
    }
  }

  // If still need slots, add remaining Tier 1
  for (const item of validTier1) {
    if (pool.length >= 2) break;
    if (!usedIds.has(item.id) && !usedIds.has(item.name.toLowerCase())) {
      pool.push(item);
      usedIds.add(item.id);
      usedIds.add(item.name.toLowerCase());
    }
  }

  // If still need slots, add Idealist search card (Tier 3)
  while (pool.length < 2) {
    const causeTag =
      inventory.skills[0]?.name || inventory.objects[0]?.item || 'community volunteering';
    const idealistCard = createTier3IdealistCard(causeTag, location);
    pool.push(idealistCard);
  }

  const finalThree: Opportunity[] = [firstCard, pool[0], pool[1]];

  // -------------------------------------------------------------
  // RULE: ACTIVELY INCLUDE AT LEAST ONE PHYSICAL/LOCAL RESULT
  // -------------------------------------------------------------
  // If none of the 3 cards is physical/local, find the top physical/local candidate
  const hasPhysical = finalThree.some((o) => o.is_physical);
  if (!hasPhysical) {
    const physicalCandidate =
      curated.find(
        (c) => c.is_physical && !finalThree.some((f) => f.id === c.id || f.name.toLowerCase() === c.name.toLowerCase())
      ) ||
      validTier1.find(
        (t) => t.is_physical && !finalThree.some((f) => f.id === t.id || f.name.toLowerCase() === t.name.toLowerCase())
      );

    if (physicalCandidate) {
      // Replace card 2 or 3 (preserving card 1's zero-cost/zero-signup status)
      finalThree[1] = physicalCandidate;
    }
  }

  // Safety check: ensure Card 1 is strictly zero-cost & zero-signup
  if (!finalThree[0].isZeroCostAndZeroSignup) {
    const zeroFrictionFallback =
      allZeroCostZeroSignup.find((o) => !finalThree.slice(1).some((f) => f.id === o.id)) ||
      curated.find((c) => c.isZeroCostAndZeroSignup) ||
      curated[0];
    finalThree[0] = zeroFrictionFallback;
  }

  return finalThree.slice(0, 3);
}
