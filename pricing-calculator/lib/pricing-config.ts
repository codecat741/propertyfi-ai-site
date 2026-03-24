export const VERSION = 'v15.2';

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

export const CREDIT_BASE_PRICE = 0.06;
export const PFI_DEFAULT_PRICE = 2.5;

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

export const DEFAULT_STATE: PricingState = {
  platformQty: 1,
  creditQty: 10000,
  creditBilling: 'annual',
  emailQty: 0,
  emailBilling: 'annual',
  dfyQty: 1,
  dfyBilling: 'quarterly',
  discountPercent: 0,
  propertyFiEnabled: false,
  pfiPropertyQty: 10000,
  pfiPricePerProperty: PFI_DEFAULT_PRICE,
};
