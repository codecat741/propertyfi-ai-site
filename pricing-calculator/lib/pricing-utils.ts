import {
  VOLUME_TIERS,
  PFI_VOLUME_TIERS,
  PFI_CHANNELS,
  CREDIT_BASE_PRICE,
  PFI_DEFAULT_PRICE,
  PLATFORM_FIRST_PRICE,
  PLATFORM_ADDITIONAL_PRICE,
  EMAIL_BUNDLE_PRICE_ANNUAL,
  DFY_PRICE_QUARTERLY,
  type PricingState,
  type PfiChannel,
  type VolumeTier,
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

export function getPfiVolumeTier(qty: number, tiers?: VolumeTier[]) {
  const useTiers = tiers || PFI_VOLUME_TIERS;
  let tier = useTiers[0];
  for (const t of useTiers) {
    if (qty >= t.min) tier = t;
  }
  return tier;
}

export function getPfiDiscountedPrice(qty: number, _basePrice: number, tiers?: VolumeTier[]): number {
  return getPfiVolumeTier(qty, tiers).price;
}

export function getPfiCost(qty: number, basePrice: number, tiers?: VolumeTier[]): number {
  return qty * getPfiDiscountedPrice(qty, basePrice, tiers);
}

export function getPfiVolumeTiers(_basePrice: number, tiers?: VolumeTier[]) {
  const useTiers = tiers || PFI_VOLUME_TIERS;
  return useTiers.map((tier) => ({
    ...tier,
    pfiPrice: tier.price,
  }));
}

export function getPfiVolumeDiscountPercent(qty: number, channel?: PfiChannel): number {
  const channelConfig = PFI_CHANNELS[channel || 'sms'];
  const tier = getPfiVolumeTier(qty, channelConfig.tiers);
  if (tier.price >= channelConfig.basePrice) return 0;
  return ((channelConfig.basePrice - tier.price) / channelConfig.basePrice) * 100;
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

  const channelTiers = PFI_CHANNELS[state.pfiChannel || 'sms'].tiers;
  const channelBasePrice = PFI_CHANNELS[state.pfiChannel || 'sms'].basePrice;

  const pfiPricePerProperty = state.propertyFiEnabled
    ? getPfiDiscountedPrice(state.pfiPropertyQty, state.pfiPricePerProperty, channelTiers)
    : 0;
  const pfiTotal = state.propertyFiEnabled
    ? getPfiCost(state.pfiPropertyQty, state.pfiPricePerProperty, channelTiers)
    : 0;

  const creditBaseTotal = state.creditQty * CREDIT_BASE_PRICE;
  const creditDiscountAmount = creditBaseTotal - creditsTotal;
  const creditDiscountPercent = getVolumeDiscountPercent(state.creditQty);

  const pfiBaseTotal = state.propertyFiEnabled
    ? state.pfiPropertyQty * channelBasePrice
    : 0;
  const pfiDiscountAmount = pfiBaseTotal - pfiTotal;
  const pfiDiscountPercent = state.propertyFiEnabled
    ? getPfiVolumeDiscountPercent(state.pfiPropertyQty, state.pfiChannel)
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
