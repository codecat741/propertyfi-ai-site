import {
  VOLUME_TIERS,
  CREDIT_BASE_PRICE,
  PLATFORM_FIRST_PRICE,
  PLATFORM_ADDITIONAL_PRICE,
  EMAIL_BUNDLE_PRICE_ANNUAL,
  DFY_PRICE_QUARTERLY,
  type PricingState,
} from './pricing-config';

export function getPlatformCost(qty: number): number {
  if (qty <= 0) return 0;
  return PLATFORM_FIRST_PRICE + Math.max(0, qty - 1) * PLATFORM_ADDITIONAL_PRICE;
}

export function getPlatformAvgPerYear(qty: number): number {
  if (qty <= 0) return 0;
  return getPlatformCost(qty) / qty;
}

export function getVolumeTier(qty: number) {
  let tier = VOLUME_TIERS[0];
  for (const t of VOLUME_TIERS) {
    if (qty >= t.min) tier = t;
  }
  return tier;
}

export function getCreditCost(qty: number): number {
  return qty * getVolumeTier(qty).price;
}

export function getVolumeDiscountPercent(qty: number): number {
  const tier = getVolumeTier(qty);
  if (tier.price >= CREDIT_BASE_PRICE) return 0;
  return ((CREDIT_BASE_PRICE - tier.price) / CREDIT_BASE_PRICE) * 100;
}

export function getPfiDiscountedPrice(qty: number, basePrice: number): number {
  const tier = getVolumeTier(qty);
  const ratio = tier.price / CREDIT_BASE_PRICE;
  return basePrice * ratio;
}

export function getPfiCost(qty: number, basePrice: number): number {
  return qty * getPfiDiscountedPrice(qty, basePrice);
}

export function getPfiVolumeTiers(basePrice: number) {
  return VOLUME_TIERS.map((tier) => ({
    ...tier,
    pfiPrice: basePrice * (tier.price / CREDIT_BASE_PRICE),
  }));
}

export function getEmailCost(qty: number): number {
  return qty * EMAIL_BUNDLE_PRICE_ANNUAL;
}

export function getDfyCost(qty: number): number {
  return qty * DFY_PRICE_QUARTERLY;
}

export function formatCurrency(amount: number, decimals?: number): string {
  if (decimals !== undefined) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount);
  }
  const isWhole = Math.abs(amount - Math.round(amount)) < 0.005;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: isWhole ? 0 : 2,
    maximumFractionDigits: isWhole ? 0 : 2,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export interface PricingBreakdown {
  platformAnnual: number;
  creditsTotal: number;
  creditPricePerUnit: number;
  emailAnnual: number;
  dfyQuarterly: number;
  pfiTotal: number;
  pfiPricePerProperty: number;
  upfrontPayment: number;
  annualPrice: number;
  monthlyAvg: number;
  creditDiscountAmount: number;
  creditDiscountPercent: number;
  pfiDiscountAmount: number;
  pfiDiscountPercent: number;
}

export function calculateBreakdown(state: PricingState): PricingBreakdown {
  const platformAnnual = getPlatformCost(state.platformQty);

  const creditTier = getVolumeTier(state.creditQty);
  const creditPricePerUnit = creditTier.price;
  const creditsTotal = state.creditQty * creditPricePerUnit;

  const emailAnnual = getEmailCost(state.emailQty);
  const dfyQuarterly = getDfyCost(state.dfyQty);

  const pfiPricePerProperty = state.propertyFiEnabled
    ? getPfiDiscountedPrice(state.pfiPropertyQty, state.pfiPricePerProperty)
    : 0;
  const pfiTotal = state.propertyFiEnabled
    ? getPfiCost(state.pfiPropertyQty, state.pfiPricePerProperty)
    : 0;

  const creditBaseTotal = state.creditQty * CREDIT_BASE_PRICE;
  const creditDiscountAmount = creditBaseTotal - creditsTotal;
  const creditDiscountPercent = getVolumeDiscountPercent(state.creditQty);

  const pfiBaseTotal = state.propertyFiEnabled
    ? state.pfiPropertyQty * state.pfiPricePerProperty
    : 0;
  const pfiDiscountAmount = pfiBaseTotal - pfiTotal;
  const pfiDiscountPercent = state.propertyFiEnabled
    ? getVolumeDiscountPercent(state.pfiPropertyQty)
    : 0;

  const upfrontPayment = platformAnnual + creditsTotal + dfyQuarterly + pfiTotal;
  const annualPrice =
    platformAnnual + creditsTotal + emailAnnual + dfyQuarterly * 4 + pfiTotal;
  const monthlyAvg = annualPrice / 12;

  return {
    platformAnnual,
    creditsTotal,
    creditPricePerUnit,
    emailAnnual,
    dfyQuarterly,
    pfiTotal,
    pfiPricePerProperty,
    upfrontPayment,
    annualPrice,
    monthlyAvg,
    creditDiscountAmount,
    creditDiscountPercent,
    pfiDiscountAmount,
    pfiDiscountPercent,
  };
}
