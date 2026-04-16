export const VERSION = 'v17.0';

export type Tier = 'pilot' | 'annual';

export interface TierConfig {
  id: Tier;
  label: string;
  subtitle: string;
  programFee: number;
  setupFee: number;
  termMonths: number;
  termLabel: string;
  features: string[];
}

export const TIERS: Record<Tier, TierConfig> = {
  pilot: {
    id: 'pilot',
    label: '90-Day Pilot',
    subtitle: 'Defined ZIP set · test the model',
    programFee: 8000,
    setupFee: 0,
    termMonths: 3,
    termLabel: '90-day term',
    features: [
      'Defined pilot ZIP set (Raleigh + Wilmington)',
      'Targeting: 15+ year old architectural & 3-tab roofs',
      'Excludes structural damage',
      'Market identification & homeowner matching',
      'Email outreach, SMS outreach, reporting',
      '90-day term',
    ],
  },
  annual: {
    id: 'annual',
    label: 'Annual Market Subscription',
    subtitle: 'Exclusive managed market coverage',
    programFee: 72000,
    setupFee: 3500,
    termMonths: 12,
    termLabel: '12-month term',
    features: [
      'Full coverage across agreed Raleigh + Wilmington ZIPs',
      'Targeting: 15+ year old architectural & 3-tab roofs',
      'Excludes structural damage',
      'Ongoing market refreshes',
      'Homeowner matching, email + SMS outreach, reporting',
      '12-month term',
    ],
  },
};

export const SMS_COST_PER_SEND = 0.22;

export const TARGET_PER_PROPERTY_MIN = 0.13;
export const TARGET_PER_PROPERTY_MAX = 0.15;

export interface CalcState {
  tier: Tier;
  marketProperties: number;
  matchRatePercent: number;
  smsPerMatch: number;
  leadConversionPercent: number;
  winRatePercent: number;
  avgJobValue: number;
}

export const DEFAULT_STATE: CalcState = {
  tier: 'annual',
  marketProperties: 500000,
  matchRatePercent: 12,
  smsPerMatch: 3,
  leadConversionPercent: 1.5,
  winRatePercent: 30,
  avgJobValue: 14000,
};
