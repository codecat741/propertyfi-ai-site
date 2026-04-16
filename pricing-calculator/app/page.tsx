'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  RotateCcw,
  Check,
  Sparkles,
  Home,
  MessageSquare,
  Target,
  TrendingUp,
  DollarSign,
} from 'lucide-react';
import {
  DEFAULT_STATE,
  VERSION,
  TIERS,
  SMS_COST_PER_SEND,
  TARGET_PER_PROPERTY_MIN,
  TARGET_PER_PROPERTY_MAX,
  type CalcState,
  type Tier,
} from '@/lib/pricing-config';
import {
  calculateBreakdown,
  formatCurrency,
  formatNumber,
} from '@/lib/pricing-utils';
import { cn } from '@/lib/utils';

function NumberField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
  min = 0,
  icon,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
  step?: number;
  min?: number;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
        {icon}
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {prefix}
          </span>
        )}
        <input
          type="number"
          min={min}
          step={step}
          value={value}
          onChange={(e) =>
            onChange(Math.max(min, parseFloat(e.target.value) || 0))
          }
          className={cn(
            'w-full border border-gray-200 rounded-lg py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
            prefix ? 'pl-7' : 'pl-3',
            suffix ? 'pr-8' : 'pr-3'
          )}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function TierCard({
  tier,
  selected,
  onSelect,
}: {
  tier: Tier;
  selected: boolean;
  onSelect: () => void;
}) {
  const cfg = TIERS[tier];
  return (
    <button
      onClick={onSelect}
      className={cn(
        'text-left rounded-2xl border-2 p-6 transition-all',
        selected
          ? 'border-cyan-400 bg-gradient-to-br from-cyan-50 to-blue-50 shadow-lg shadow-cyan-100/50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">{cfg.label}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{cfg.subtitle}</p>
        </div>
        {selected && (
          <span className="text-xs font-medium text-cyan-700 bg-cyan-100 px-2 py-0.5 rounded-full flex items-center gap-1">
            <Check className="w-3 h-3" />
            Selected
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-3xl font-bold text-slate-900">
          {formatCurrency(cfg.programFee)}
        </span>
        <span className="text-sm text-gray-500">
          {tier === 'annual' ? 'annual subscription' : 'program fee'}
        </span>
      </div>
      {cfg.setupFee > 0 && (
        <p className="text-sm text-gray-600 mb-1">
          + {formatCurrency(cfg.setupFee)} one-time setup / market activation
        </p>
      )}
      <p className="text-sm text-gray-600 mb-4">
        + {formatCurrency(SMS_COST_PER_SEND, 2)} per SMS sent
      </p>

      <ul className="space-y-1.5 text-xs text-gray-600">
        {cfg.features.map((f) => (
          <li key={f} className="flex items-start gap-1.5">
            <span className="text-cyan-500 mt-0.5">·</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>
    </button>
  );
}

function Stat({
  label,
  value,
  sub,
  color = 'text-white',
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  color?: string;
  accent?: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className={cn('text-2xl font-bold', color)}>
        {value}
        {accent && (
          <span className="text-xs font-normal text-gray-400 ml-1">
            {accent}
          </span>
        )}
      </p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function PricingPage() {
  const [state, setState] = useState<CalcState>(DEFAULT_STATE);

  const update = (patch: Partial<CalcState>) =>
    setState((prev) => ({ ...prev, ...patch }));
  const reset = () => setState(DEFAULT_STATE);

  const breakdown = useMemo(() => calculateBreakdown(state), [state]);
  const tierCfg = TIERS[state.tier];

  const perPropertyInTarget =
    breakdown.costPerProperty >= TARGET_PER_PROPERTY_MIN &&
    breakdown.costPerProperty <= TARGET_PER_PROPERTY_MAX;
  const perPropertyBelowTarget =
    breakdown.costPerProperty < TARGET_PER_PROPERTY_MIN;

  const today = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="font-bold text-lg text-slate-900">
                  PropertyFi
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <span className="text-gray-600 font-medium">
                Managed Market Pricing
              </span>
              <span className="hidden sm:inline text-xs text-gray-400 border-l border-gray-200 pl-3">
                Powered by Glasshouse
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">{VERSION}</span>
              <button
                onClick={reset}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h2 className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-3">
            Choose a Program
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <TierCard
              tier="pilot"
              selected={state.tier === 'pilot'}
              onSelect={() => update({ tier: 'pilot' })}
            />
            <TierCard
              tier="annual"
              selected={state.tier === 'annual'}
              onSelect={() => update({ tier: 'annual' })}
            />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="text-xs font-bold tracking-wider uppercase text-gray-500 mb-4">
            Market Inputs
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <NumberField
              label="Market Properties"
              value={state.marketProperties}
              onChange={(v) => update({ marketProperties: v })}
              step={10000}
              icon={<Home className="w-3.5 h-3.5" />}
            />
            <NumberField
              label="Match Rate"
              value={state.matchRatePercent}
              onChange={(v) => update({ matchRatePercent: v })}
              suffix="%"
              step={0.5}
              icon={<Target className="w-3.5 h-3.5" />}
            />
            <NumberField
              label="SMS per Match"
              value={state.smsPerMatch}
              onChange={(v) => update({ smsPerMatch: v })}
              step={1}
              icon={<MessageSquare className="w-3.5 h-3.5" />}
            />
            <NumberField
              label="Lead Conversion"
              value={state.leadConversionPercent}
              onChange={(v) => update({ leadConversionPercent: v })}
              suffix="%"
              step={0.1}
              icon={<TrendingUp className="w-3.5 h-3.5" />}
            />
            <NumberField
              label="Win Rate"
              value={state.winRatePercent}
              onChange={(v) => update({ winRatePercent: v })}
              suffix="%"
              step={1}
              icon={<Check className="w-3.5 h-3.5" />}
            />
            <NumberField
              label="Avg Job Value"
              value={state.avgJobValue}
              onChange={(v) => update({ avgJobValue: v })}
              prefix="$"
              step={500}
              icon={<DollarSign className="w-3.5 h-3.5" />}
            />
          </div>
          <p className="text-xs text-gray-400 mt-4 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-cyan-500" />
            Match rate reflects properties matching Glasshouse targeting
            criteria (15+ year old architectural or 3-tab roofs, excluding
            structural damage).
          </p>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold tracking-wider uppercase">
              Pricing Breakdown &mdash; {tierCfg.label}
            </h2>
            <span className="text-xs text-gray-400">{tierCfg.termLabel}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <Stat
              label={state.tier === 'annual' ? 'Annual Subscription' : 'Program Fee'}
              value={formatCurrency(breakdown.programFee)}
            />
            {breakdown.setupFee > 0 ? (
              <Stat
                label="Setup Fee"
                value={formatCurrency(breakdown.setupFee)}
                sub="one-time market activation"
              />
            ) : (
              <Stat
                label="Setup Fee"
                value={formatCurrency(0)}
                sub="included in pilot"
              />
            )}
            <Stat
              label="SMS Cost"
              value={formatCurrency(breakdown.smsCost)}
              sub={`${formatNumber(breakdown.smsSends)} sends × ${formatCurrency(SMS_COST_PER_SEND, 2)}`}
            />
            <Stat
              label="Total Investment"
              value={formatCurrency(breakdown.totalInvestment)}
              color="text-yellow-400"
              sub={state.tier === 'annual' ? 'year one' : '90 days'}
            />
          </div>

          <div className="h-px bg-slate-700 mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Cost / Property
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(breakdown.costPerProperty, 3)}
                <span className="text-xs font-normal text-gray-400 ml-1">
                  /property
                </span>
              </p>
              {state.tier === 'annual' && (
                <p
                  className={cn(
                    'text-xs mt-1 flex items-center gap-1',
                    perPropertyInTarget
                      ? 'text-emerald-400'
                      : perPropertyBelowTarget
                      ? 'text-cyan-400'
                      : 'text-amber-400'
                  )}
                >
                  {perPropertyInTarget && <Check className="w-3 h-3" />}
                  Target: {formatCurrency(TARGET_PER_PROPERTY_MIN, 2)}&ndash;
                  {formatCurrency(TARGET_PER_PROPERTY_MAX, 2)}/yr exclusive
                  coverage
                </p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Cost / Matched Opportunity
              </p>
              <p className="text-3xl font-bold text-cyan-300">
                {formatCurrency(breakdown.costPerMatch, 2)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {formatNumber(breakdown.matchedOpportunities)} matched
                opportunities
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                Upfront Payment
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(breakdown.upfrontCost)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Program fee{breakdown.setupFee > 0 ? ' + setup' : ''}, SMS
                billed as sent
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-2xl p-6 text-white ring-1 ring-cyan-400/30">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-bold tracking-wider uppercase text-cyan-300">
              Projected Pipeline &amp; ROI
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-6">
            <Stat
              label="Matched Opportunities"
              value={formatNumber(breakdown.matchedOpportunities)}
              sub={`${state.matchRatePercent}% of ${formatNumber(state.marketProperties)}`}
            />
            <Stat
              label="SMS Sends"
              value={formatNumber(breakdown.smsSends)}
              sub={`${state.smsPerMatch} per matched opp`}
            />
            <Stat
              label="Expected Leads"
              value={formatNumber(breakdown.expectedLeads)}
              sub={`${state.leadConversionPercent}% of sends`}
              color="text-cyan-300"
            />
            <Stat
              label="Expected Customers"
              value={formatNumber(breakdown.expectedCustomers)}
              sub={`${state.winRatePercent}% win rate`}
              color="text-cyan-300"
            />
          </div>

          <div className="h-px bg-cyan-800/50 mb-6" />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            <Stat
              label="Projected Revenue"
              value={formatCurrency(breakdown.expectedRevenue)}
              color="text-emerald-300"
            />
            <Stat
              label="ROI Multiple"
              value={`${breakdown.roiMultiple.toFixed(1)}×`}
              color="text-yellow-400"
            />
            <Stat
              label="Cost / Lead"
              value={formatCurrency(breakdown.costPerLead, 2)}
            />
            <Stat
              label="Cost / Customer"
              value={formatCurrency(breakdown.costPerCustomer, 0)}
              color="text-amber-300"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-gray-500 px-1">
          <p>
            Pricing powered by Glasshouse property intelligence. All figures
            exclude taxes &amp; passthrough delivery fees.
          </p>
          <p>
            Generated {today} · Valid 30 days
          </p>
        </div>
      </main>
    </div>
  );
}
