export const VERSION = 'v16.0';

export interface VolumeTier {
  min: number;
  label: string;
  price: number;
}

export const VOLUME_TIERS: VolumeTier[] = [
  { min: 0, label: 'Base', price: 0.06 },
  { min: 30000, label: '30k+', price: 0.04 },
  { min: 50000, label: '50k+', price: 0.03 },
  { min: 100000, label: '100k+', price: 0.029 },
  { min: 250000, label: '250k+', price: 0.028 },
  { min: 500000, label: '500k+', price: 0.027 },
];

export const PFI_VOLUME_TIERS: VolumeTier[] = [
  { min: 0, label: 'Base', price: 0.25 },
  { min: 1000, label: '1k+', price: 0.22 },
  { min: 2500, label: '2.5k+', price: 0.20 },
  { min: 5000, label: '5k+', price: 0.18 },
  { min: 10000, label: '10k+', price: 0.16 },
  { min: 25000, label: '25k+', price: 0.15 },
];

export const CREDIT_BASE_PRICE = 0.06;
export const PFI_DEFAULT_PRICE = 0.25;

export const PLATFORM_FIRST_PRICE = 3300;
export const PLATFORM_ADDITIONAL_PRICE = 1500;
export const EMAIL_BUNDLE_PRICE_ANNUAL = 3000;
export const DFY_PRICE_QUARTERLY = 1200;

export type BillingPeriod = 'annual' | 'quarterly';

export interface PricingState {
  platformQty: number;
  creditQty: number;
  creditBilling: BillingPeriod;
  emailQty: number;
  emailBilling: BillingPeriod;
  dfyQty: number;
  dfyBilling: BillingPeriod;
  discountPercent: number;
  propertyFiEnabled: boolean;
  pfiPropertyQty: number;
  pfiPricePerProperty: number;
}

/* ── ROI / Conversion Rate Config ──────────────────────────────────── */
export interface VerticalConversion {
  name: string;
  smsBase: number;   // SMS/Base conversion %
  email: number;     // Email conversion %
  dfy: number;       // DFY conversion %
  pfiLift: number;   // PFI multiplier on targeted sends (3x baseline)
}

export const VERTICALS: VerticalConversion[] = [
  { name: 'Exterior Clean', smsBase: 0.70, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Home Cleaning',  smsBase: 0.70, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Standard',       smsBase: 0.70, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Pest & Lawn',    smsBase: 0.60, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Painting',       smsBase: 0.35, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Roofing',        smsBase: 0.30, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Garage',         smsBase: 0.25, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
  { name: 'Mechanical',     smsBase: 0.20, email: 0.10, dfy: 0.10, pfiLift: 3.0 },
];

export const DEFAULT_STATE: PricingState = {
  platformQty: 1,
  creditQty: 10000,
  creditBilling: 'annual',
  emailQty: 0,
  emailBilling: 'annual',
  dfyQty: 0,
  dfyBilling: 'quarterly',
  discountPercent: 0,
  propertyFiEnabled: false,
  pfiPropertyQty: 1000,
  pfiPricePerProperty: PFI_DEFAULT_PRICE,
};
