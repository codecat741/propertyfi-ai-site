import {
  TIERS,
  SMS_COST_PER_SEND,
  type CalcState,
  type Tier,
} from './pricing-config';

export interface CalcBreakdown {
  tier: Tier;
  programFee: number;
  setupFee: number;
  matchedOpportunities: number;
  smsSends: number;
  smsCost: number;
  upfrontCost: number;
  totalInvestment: number;
  costPerProperty: number;
  costPerMatch: number;
  expectedLeads: number;
  expectedCustomers: number;
  expectedRevenue: number;
  roiMultiple: number;
  costPerLead: number;
  costPerCustomer: number;
}

export function calculateBreakdown(state: CalcState): CalcBreakdown {
  const tierCfg = TIERS[state.tier];
  const programFee = tierCfg.programFee;
  const setupFee = tierCfg.setupFee;

  const matchedOpportunities = Math.round(
    state.marketProperties * (state.matchRatePercent / 100)
  );
  const smsSends = matchedOpportunities * state.smsPerMatch;
  const smsCost = smsSends * SMS_COST_PER_SEND;

  const upfrontCost = programFee + setupFee;
  const totalInvestment = upfrontCost + smsCost;

  const costPerProperty =
    state.marketProperties > 0 ? totalInvestment / state.marketProperties : 0;
  const costPerMatch =
    matchedOpportunities > 0 ? totalInvestment / matchedOpportunities : 0;

  const expectedLeads = Math.round(
    smsSends * (state.leadConversionPercent / 100)
  );
  const expectedCustomers = Math.round(
    expectedLeads * (state.winRatePercent / 100)
  );
  const expectedRevenue = expectedCustomers * state.avgJobValue;

  const roiMultiple = totalInvestment > 0 ? expectedRevenue / totalInvestment : 0;
  const costPerLead = expectedLeads > 0 ? totalInvestment / expectedLeads : 0;
  const costPerCustomer =
    expectedCustomers > 0 ? totalInvestment / expectedCustomers : 0;

  return {
    tier: state.tier,
    programFee,
    setupFee,
    matchedOpportunities,
    smsSends,
    smsCost,
    upfrontCost,
    totalInvestment,
    costPerProperty,
    costPerMatch,
    expectedLeads,
    expectedCustomers,
    expectedRevenue,
    roiMultiple,
    costPerLead,
    costPerCustomer,
  };
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
  return new Intl.NumberFormat('en-US').format(Math.round(n));
}
