export interface MoneyInventory {
  amount: number;
  currency: string;
}

export interface TimeInventory {
  hours: number;
  when: string;
  recurring: boolean;
}

export interface SkillItem {
  name: string;
  level: string;
}

export interface ObjectItem {
  item: string;
  condition: string;
}

export interface AccessItem {
  type: string;
}

export interface UserInventory {
  money: MoneyInventory | null;
  time: TimeInventory | null;
  skills: SkillItem[];
  objects: ObjectItem[];
  access: AccessItem[];
  languages: string[];
  location_hint: string | null;
  raw_input?: string;
}

export type VerificationTier = 'tier1' | 'tier2' | 'tier3';

export interface Opportunity {
  id: string;
  name: string;
  one_liner: string;
  why_it_fits: string;
  effort: string;
  cost: string;
  time_required: string;
  action: string;
  source_url: string;
  verificationTier: VerificationTier;
  badgeLabel: string;
  isZeroCostAndZeroSignup: boolean;
  category?: 'time' | 'money' | 'skills' | 'objects' | 'access' | 'languages' | 'micro';
  primaryAssetUsed?: string;
  geography_scope?: 'india' | 'global' | string;
  geography?: string;
  is_physical?: boolean;
  physicalNote?: string;
  unbrokered?: boolean;
  capital_types?: string[];
  object_types?: string[];
  skill_types?: string[];
  languages?: string[];
  signup_required?: boolean;
  registered_since?: number;
  founded?: number;
  source_note?: string;
  is_fallback_search?: boolean;
}

export interface PersonaDemo {
  id: string;
  title: string;
  icon: string;
  role: string;
  prompt: string;
  location: string;
}
