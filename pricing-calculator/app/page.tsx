'use client';

import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import {
  Minus,
  Plus,
  RotateCcw,
  Lock,
  Check,
  Sparkles,
  Brain,
  ChevronDown,
} from 'lucide-react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import {
  DEFAULT_STATE,
  VERSION,
  VOLUME_TIERS,
  CREDIT_BASE_PRICE,
  VERTICALS,
  type PricingState,
} from '@/lib/pricing-config';
import {
  calculateBreakdown,
  formatCurrency,
  formatNumber,
  getPlatformAvgPerYear,
  getVolumeTier,
  getPfiVolumeTier,
  getPfiVolumeTiers,
} from '@/lib/pricing-utils';
import { cn } from '@/lib/utils';

/* ── Switch ─────────────────────────────────────────────────────────── */
function Switch({
  checked,
  onCheckedChange,
  className,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
}) {
  return (
    <SwitchPrimitive.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      className={cn(
        'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2',
        checked ? 'bg-cyan-500' : 'bg-gray-300',
        className
      )}
    >
      <SwitchPrimitive.Thumb
        className={cn(
          'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
          checked ? 'translate-x-5' : 'translate-x-0'
        )}
      />
    </SwitchPrimitive.Root>
  );
}

/* ── Billing toggle pill ────────────────────────────────────────────── */
function BillingToggle({
  value,
  onChange,
}: {
  value: 'annual' | 'quarterly';
  onChange: (v: 'annual' | 'quarterly') => void;
}) {
  return (
    <div className="inline-flex rounded-md border border-gray-200 text-xs font-medium overflow-hidden">
      <button
        className={cn(
          'px-3 py-1 transition-colors',
          value === 'annual'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-gray-50 text-gray-500 hover:text-gray-700'
        )}
        onClick={() => onChange('annual')}
      >
        Annual
      </button>
      <button
        className={cn(
          'px-3 py-1 transition-colors',
          value === 'quarterly'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'bg-gray-50 text-gray-500 hover:text-gray-700'
        )}
        onClick={() => onChange('quarterly')}
      >
        Quarterly
      </button>
    </div>
  );
}

/* ── Quantity control ───────────────────────────────────────────────── */
function QtyControl({
  value,
  onChange,
  min = 0,
}: {
  value: number;
  onChange: (v: number) => void;
  min?: number;
}) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 disabled:opacity-30"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      <span className="w-6 text-center font-semibold text-sm">{value}</span>
      <button
        className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

/* ── Badge circle ───────────────────────────────────────────────────── */
function Badge({ letter, color }: { letter: string; color: string }) {
  return (
    <div
      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
      style={{ backgroundColor: color }}
    >
      {letter}
    </div>
  );
}

/* ── Feature bullet ─────────────────────────────────────────────────── */
function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="text-xs text-gray-600 flex items-start gap-1.5">
      <span className="text-gray-400 mt-0.5">·</span>
      <span>{children}</span>
    </li>
  );
}

/* ── Volume discount table (credits) ────────────────────────────────── */
function VolumeTable({ activeQty }: { activeQty: number }) {
  const activeTier = getVolumeTier(activeQty);
  const left = VOLUME_TIERS.filter((_, i) => i < 3);
  const right = VOLUME_TIERS.filter((_, i) => i >= 3);

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-gray-500 mb-1.5">Volume Discounts</p>
      <div className="grid grid-cols-2 gap-x-4 text-xs">
        {left.map((tier, i) => {
          const r = right[i];
          return (
            <React.Fragment key={tier.label}>
              <div
                className={cn(
                  'flex justify-between py-0.5',
                  activeTier.label === tier.label
                    ? 'text-emerald-600 font-bold'
                    : 'text-gray-500'
                )}
              >
                <span>{tier.label}</span>
                <span>${tier.price.toFixed(3)}</span>
              </div>
              {r && (
                <div
                  className={cn(
                    'flex justify-between py-0.5',
                    activeTier.label === r.label
                      ? 'text-emerald-600 font-bold'
                      : 'text-gray-500'
                  )}
                >
                  <span>{r.label}</span>
                  <span>${r.price.toFixed(3)}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── Volume discount table (PFI) ────────────────────────────────────── */
function PfiVolumeTable({
  activeQty,
  basePrice,
}: {
  activeQty: number;
  basePrice: number;
}) {
  const tiers = getPfiVolumeTiers(basePrice);
  const activeTier = getPfiVolumeTier(activeQty);
  const left = tiers.filter((_, i) => i < 3);
  const right = tiers.filter((_, i) => i >= 3);

  return (
    <div className="mt-3">
      <p className="text-xs font-medium text-gray-500 mb-1.5">Volume Discounts</p>
      <div className="grid grid-cols-2 gap-x-4 text-xs">
        {left.map((tier, i) => {
          const r = right[i];
          return (
            <React.Fragment key={tier.label}>
              <div
                className={cn(
                  'flex justify-between py-0.5',
                  activeTier.label === tier.label
                    ? 'text-cyan-600 font-bold'
                    : 'text-gray-500'
                )}
              >
                <span>{tier.label}</span>
                <span>${tier.pfiPrice.toFixed(2)}</span>
              </div>
              {r && (
                <div
                  className={cn(
                    'flex justify-between py-0.5',
                    activeTier.label === r.label
                      ? 'text-cyan-600 font-bold'
                      : 'text-gray-500'
                  )}
                >
                  <span>{r.label}</span>
                  <span>${r.pfiPrice.toFixed(2)}</span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── ROI Metric Card ────────────────────────────────────────────────── */
function RoiMetric({
  label,
  value,
  color = 'text-white',
  size = 'lg',
}: {
  label: string;
  value: string;
  color?: string;
  size?: 'lg' | 'sm';
}) {
  return (
    <div>
      <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </p>
      <p
        className={cn(
          'font-bold',
          size === 'lg' ? 'text-2xl' : 'text-xl',
          color
        )}
      >
        {value}
      </p>
    </div>
  );
}

/* ── ROI Estimate Tab Component ─────────────────────────────────────── */
function RoiEstimateTab({
  pricingState,
  roiVertical,
  setRoiVertical,
  avgSalePrice,
  setAvgSalePrice,
  winRate,
  setWinRate,
}: {
  pricingState: PricingState;
  roiVertical: string;
  setRoiVertical: (v: string) => void;
  avgSalePrice: number;
  setAvgSalePrice: (v: number) => void;
  winRate: number;
  setWinRate: (v: number) => void;
}) {
  const selectedVertical =
    VERTICALS.find((v) => v.name === roiVertical) || VERTICALS[5];

  // Always compute both breakdowns
  const baseBreakdown = useMemo(
    () => calculateBreakdown({ ...pricingState, propertyFiEnabled: false }),
    [pricingState]
  );
  const pfiBreakdown = useMemo(
    () => calculateBreakdown({ ...pricingState, propertyFiEnabled: true }),
    [pricingState]
  );

  // SMS sends = credits / 3 (1 SMS = 3 credits)
  const estSmsSends = Math.floor(pricingState.creditQty / 3);

  // Determine active channels
  const hasEmail = pricingState.emailQty > 0;
  const hasDfy = pricingState.dfyQty > 0;

  // Total impressions (SMS + email touches)
  const emailImpressions = hasEmail
    ? pricingState.emailQty * 7500 * 12
    : 0;
  const totalImpressions = estSmsSends + emailImpressions;

  // ── Base scenario (no PFI) ──
  const baseConversion =
    selectedVertical.smsBase / 100 +
    (hasEmail ? selectedVertical.email / 100 : 0) +
    (hasDfy ? selectedVertical.dfy / 100 : 0);
  const baseLeads = Math.round(estSmsSends * baseConversion);
  const baseCustomers = Math.round(baseLeads * (winRate / 100));
  const baseRevenue = baseCustomers * avgSalePrice;
  const baseInvestment = baseBreakdown.annualPrice;
  const baseRoi = baseInvestment > 0 ? baseRevenue / baseInvestment : 0;
  const baseCpl = baseLeads > 0 ? baseInvestment / baseLeads : 0;
  const baseCpc = baseCustomers > 0 ? baseInvestment / baseCustomers : 0;

  // ── PFI scenario (split-send model) ──
  // PFI lift only applies to sends targeting PFI properties;
  // remaining sends convert at the base rate.
  const pfiTargetedConversion = baseConversion * selectedVertical.pfiLift;
  const pfiTargetedSends = Math.min(pricingState.pfiPropertyQty, estSmsSends);
  const pfiUntargetedSends = estSmsSends - pfiTargetedSends;
  const pfiTargetedLeads = Math.round(pfiTargetedSends * pfiTargetedConversion);
  const pfiUntargetedLeads = Math.round(pfiUntargetedSends * baseConversion);
  const pfiLeads = pfiTargetedLeads + pfiUntargetedLeads;
  const pfiBlendedConversion = estSmsSends > 0 ? pfiLeads / estSmsSends : 0;
  const pfiCustomers = Math.round(pfiLeads * (winRate / 100));
  const pfiRevenue = pfiCustomers * avgSalePrice;
  const pfiInvestment = pfiBreakdown.annualPrice;
  const pfiRoi = pfiInvestment > 0 ? pfiRevenue / pfiInvestment : 0;
  const pfiCpl = pfiLeads > 0 ? pfiInvestment / pfiLeads : 0;
  const pfiCpc = pfiCustomers > 0 ? pfiInvestment / pfiCustomers : 0;

  // Deltas
  const deltaLeads = pfiLeads - baseLeads;
  const deltaRevenue = pfiRevenue - baseRevenue;

  // Chart scale
  const chartMax = Math.max(baseInvestment, baseRevenue, pfiInvestment, pfiRevenue, 1);

  return (
    <>
      {/* Controls row */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Industry Vertical
            </label>
            <select
              value={roiVertical}
              onChange={(e) => setRoiVertical(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {VERTICALS.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1">
              Base: {(baseConversion * 100).toFixed(2)}% (
              {['SMS', hasEmail && 'Email', hasDfy && 'DFY']
                .filter(Boolean)
                .join(' + ')}
              ) &middot; PFI targeted: {(pfiTargetedConversion * 100).toFixed(2)}%
              {pfiTargetedSends < estSmsSends && (
                <> &middot; Blended: {(pfiBlendedConversion * 100).toFixed(2)}%</>
              )}
            </p>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Avg Sale Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                type="number"
                min={0}
                step={500}
                value={avgSalePrice}
                onChange={(e) =>
                  setAvgSalePrice(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              Win Rate on Leads
            </label>
            <div className="relative">
              <input
                type="number"
                min={0}
                max={100}
                value={winRate}
                onChange={(e) =>
                  setWinRate(
                    Math.min(100, Math.max(0, parseInt(e.target.value) || 0))
                  )
                }
                className="w-full border border-gray-200 rounded-lg px-3 pr-8 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                %
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SMS Estimate */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <AccordionPrimitive.Root
          type="single"
          collapsible
          defaultValue="sms-estimate"
        >
          <AccordionPrimitive.Item value="sms-estimate" className="border-none">
            <AccordionPrimitive.Header className="flex">
              <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between font-medium transition-all [&[data-state=open]>svg]:rotate-180">
                <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  SMS Estimate
                </span>
                <span className="text-sm text-blue-600 underline mr-2">
                  {formatNumber(estSmsSends)} estimated annual sends
                </span>
                <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
              </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
            <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-[accordion-up_0.2s_ease-out] data-[state=open]:animate-[accordion-down_0.2s_ease-out]">
              <div className="pt-3 text-xs text-gray-500 space-y-1">
                <p>
                  Based on {formatNumber(pricingState.creditQty)} credits at 3
                  credits per SMS send
                </p>
                {hasEmail && (
                  <p>
                    + {formatNumber(emailImpressions)} email impressions/yr (
                    {pricingState.emailQty} bundle
                    {pricingState.emailQty > 1 ? 's' : ''} × 7,500/mo)
                  </p>
                )}
              </div>
            </AccordionPrimitive.Content>
          </AccordionPrimitive.Item>
        </AccordionPrimitive.Root>
      </div>

      {/* Conversion Rates by Vertical */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-4">
          Conversion Rates by Vertical
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 pr-4">
                  Vertical
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 px-4">
                  SMS/Base
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 px-4">
                  Email
                </th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider pb-2 px-4">
                  DFY
                </th>
                <th className="text-right text-xs font-bold text-gray-700 uppercase tracking-wider pb-2 px-4">
                  Total
                </th>
                <th className="text-right text-xs font-semibold text-cyan-500 uppercase tracking-wider pb-2 px-4">
                  PFI Lift
                </th>
                <th className="text-right text-xs font-bold text-cyan-600 uppercase tracking-wider pb-2 pl-4">
                  PFI Targeted
                </th>
              </tr>
            </thead>
            <tbody>
              {VERTICALS.map((v) => {
                const isSelected = v.name === roiVertical;
                const vBase =
                  v.smsBase / 100 +
                  (hasEmail ? v.email / 100 : 0) +
                  (hasDfy ? v.dfy / 100 : 0);
                const vPfi = vBase * v.pfiLift;
                return (
                  <tr
                    key={v.name}
                    className={cn(
                      'border-b border-gray-50 transition-colors cursor-pointer hover:bg-gray-50',
                      isSelected && 'bg-gray-50'
                    )}
                    onClick={() => setRoiVertical(v.name)}
                  >
                    <td
                      className={cn(
                        'py-2 pr-4',
                        isSelected
                          ? 'font-bold text-slate-900'
                          : 'text-gray-700'
                      )}
                    >
                      {v.name}
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 px-4',
                        isSelected
                          ? 'font-bold text-slate-900'
                          : 'text-gray-500'
                      )}
                    >
                      {v.smsBase.toFixed(2)}%
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 px-4',
                        isSelected
                          ? 'font-bold text-slate-900'
                          : 'text-gray-500'
                      )}
                    >
                      {v.email.toFixed(2)}%
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 px-4',
                        isSelected
                          ? 'font-bold text-slate-900'
                          : 'text-gray-500'
                      )}
                    >
                      {v.dfy.toFixed(2)}%
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 px-4 font-bold',
                        isSelected ? 'text-blue-700' : 'text-blue-600'
                      )}
                    >
                      {(vBase * 100).toFixed(2)}%
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 px-4',
                        isSelected
                          ? 'font-bold text-cyan-600'
                          : 'text-cyan-500'
                      )}
                    >
                      {v.pfiLift.toFixed(1)}×
                    </td>
                    <td
                      className={cn(
                        'text-right py-2 pl-4 font-bold',
                        isSelected ? 'text-cyan-700' : 'text-cyan-600'
                      )}
                    >
                      {(vPfi * 100).toFixed(2)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shared top-level metrics */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Est. SMS Sends
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatNumber(estSmsSends)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Total Impressions
          </p>
          <p className="text-2xl font-bold text-slate-900">
            {formatNumber(totalImpressions)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
            Win Rate
          </p>
          <p className="text-2xl font-bold text-slate-900">{winRate}%</p>
        </div>
      </div>

      {/* ── Side-by-side ROI comparison ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left: Base ROI */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <h3 className="text-xs font-bold tracking-wider uppercase mb-5 text-gray-400">
            Base ROI
          </h3>
          <div className="space-y-4">
            <RoiMetric label="Leads" value={formatNumber(baseLeads)} color="text-white" />
            <div className="grid grid-cols-2 gap-4">
              <RoiMetric
                label="Total Investment"
                value={formatCurrency(baseInvestment)}
                size="sm"
              />
              <RoiMetric
                label="Est. Revenue"
                value={formatCurrency(baseRevenue)}
                color="text-emerald-300"
                size="sm"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <RoiMetric
                label="ROI Multiple"
                value={`${baseRoi.toFixed(1)}X`}
                color="text-yellow-400"
                size="sm"
              />
              <RoiMetric
                label="Cost / Lead"
                value={formatCurrency(baseCpl, 2)}
                size="sm"
              />
              <RoiMetric
                label="Cost / Customer"
                value={formatCurrency(baseCpc, 2)}
                color="text-amber-300"
                size="sm"
              />
            </div>

            {/* Bar chart */}
            <div className="pt-2 space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Investment</span>
                  <span className="text-xs font-semibold">
                    {formatCurrency(baseInvestment)}
                  </span>
                </div>
                <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (baseInvestment / chartMax) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Revenue</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {formatCurrency(baseRevenue)}
                  </span>
                </div>
                <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (baseRevenue / chartMax) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: With PropertyFi Intelligence */}
        <div className="bg-gradient-to-br from-cyan-900 to-slate-900 rounded-2xl p-6 text-white ring-2 ring-cyan-400/50">
          <div className="flex items-center gap-2 mb-5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-bold tracking-wider uppercase text-cyan-400">
              With PropertyFi Intelligence
            </h3>
          </div>
          <div className="space-y-4">
            {/* Send split breakdown */}
            <div className="bg-white/5 rounded-lg p-3 space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-cyan-300">PFI Targeted Sends</span>
                <span className="font-bold text-cyan-300">
                  {formatNumber(pfiTargetedSends)} @ {(pfiTargetedConversion * 100).toFixed(2)}% &rarr; {formatNumber(pfiTargetedLeads)} leads
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Untargeted Sends</span>
                <span className="font-medium text-gray-400">
                  {formatNumber(pfiUntargetedSends)} @ {(baseConversion * 100).toFixed(2)}% &rarr; {formatNumber(pfiUntargetedLeads)} leads
                </span>
              </div>
              <div className="border-t border-white/10 pt-1 flex justify-between text-xs">
                <span className="text-white font-semibold">Blended</span>
                <span className="font-bold text-white">
                  {formatNumber(estSmsSends)} sends &rarr; {formatNumber(pfiLeads)} leads ({(pfiBlendedConversion * 100).toFixed(2)}%)
                </span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <RoiMetric
                label="Total Leads"
                value={formatNumber(pfiLeads)}
                color="text-cyan-300"
              />
              {deltaLeads > 0 && (
                <span className="text-sm font-bold text-emerald-400">
                  +{formatNumber(deltaLeads)}
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <RoiMetric
                label="Total Investment"
                value={formatCurrency(pfiInvestment)}
                size="sm"
              />
              <div>
                <RoiMetric
                  label="Est. Revenue"
                  value={formatCurrency(pfiRevenue)}
                  color="text-emerald-300"
                  size="sm"
                />
                {deltaRevenue > 0 && (
                  <p className="text-xs font-semibold text-emerald-400 mt-0.5">
                    +{formatCurrency(deltaRevenue)}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <RoiMetric
                label="ROI Multiple"
                value={`${pfiRoi.toFixed(1)}X`}
                color="text-yellow-400"
                size="sm"
              />
              <RoiMetric
                label="Cost / Lead"
                value={formatCurrency(pfiCpl, 2)}
                size="sm"
              />
              <RoiMetric
                label="Cost / Customer"
                value={formatCurrency(pfiCpc, 2)}
                color="text-amber-300"
                size="sm"
              />
            </div>

            {/* Bar chart */}
            <div className="pt-2 space-y-2">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Investment</span>
                  <span className="text-xs font-semibold">
                    {formatCurrency(pfiInvestment)}
                  </span>
                </div>
                <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-cyan-600 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (pfiInvestment / chartMax) * 100)}%`,
                    }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">Revenue</span>
                  <span className="text-xs font-semibold text-emerald-400">
                    {formatCurrency(pfiRevenue)}
                  </span>
                </div>
                <div className="h-5 bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max(2, (pfiRevenue / chartMax) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delta summary bar */}
      <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl p-5">
        <h3 className="text-xs font-bold tracking-wider uppercase text-cyan-700 mb-3">
          PropertyFi Intelligence Advantage
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-0.5">PFI Targeted Sends</p>
            <p className="text-lg font-bold text-cyan-700">
              {formatNumber(pfiTargetedSends)} ({selectedVertical.pfiLift.toFixed(1)}× lift)
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Additional Leads</p>
            <p className="text-lg font-bold text-emerald-600">
              +{formatNumber(deltaLeads)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Additional Revenue</p>
            <p className="text-lg font-bold text-emerald-600">
              +{formatCurrency(deltaRevenue)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">ROI Change</p>
            <p className="text-lg font-bold text-yellow-600">
              {baseRoi.toFixed(1)}× &rarr; {pfiRoi.toFixed(1)}×
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════════ */
export default function PricingPage() {
  const [state, setState] = useState<PricingState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState('pricing');

  // ROI Estimate state
  const [roiVertical, setRoiVertical] = useState('Roofing');
  const [avgSalePrice, setAvgSalePrice] = useState(12000);
  const [winRate, setWinRate] = useState(40);

  const update = (patch: Partial<PricingState>) =>
    setState((prev) => ({ ...prev, ...patch }));
  const reset = () => setState(DEFAULT_STATE);

  const breakdown = useMemo(() => calculateBreakdown(state), [state]);
  const creditDiscount = breakdown.creditDiscountPercent;
  const pfiDiscount = breakdown.pfiDiscountPercent;
  const pfiTier = getPfiVolumeTier(state.pfiPropertyQty);

  const tabs = ['Pricing', 'ROI Estimate', 'Marketing Spend', 'Summary', 'FAQs'];
  const today = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Header ──────────────────────────────────────────────────── */}
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
              <span className="text-gray-600 font-medium">Pricing Builder</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-400">{VERSION}</span>
              <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                <Lock className="w-3.5 h-3.5" />
                Admin
              </button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center justify-between mt-2 -mb-px">
            <nav className="flex gap-1">
              {tabs.map((tab) => {
                const key = tab.toLowerCase().replace(/\s+/g, '-');
                const isActive = key === activeTab;
                return (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-t-lg transition-colors',
                      isActive
                        ? 'bg-slate-900 text-white'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>
            <button
              onClick={reset}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mr-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* ── Pricing Tab ─────────────────────────────────────────────── */}
      {activeTab === 'pricing' && (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          {/* PropertyFi Intelligence Toggle */}
          <div
            className={cn(
              'rounded-xl border-2 transition-all duration-300',
              state.propertyFiEnabled
                ? 'border-cyan-400 bg-gradient-to-r from-cyan-50 to-blue-50 shadow-lg shadow-cyan-100/50'
                : 'border-gray-200 bg-white'
            )}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                    state.propertyFiEnabled ? 'bg-cyan-500' : 'bg-gray-200'
                  )}
                >
                  <Brain
                    className={cn(
                      'w-5 h-5',
                      state.propertyFiEnabled ? 'text-white' : 'text-gray-500'
                    )}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900">
                      PropertyFi Intelligence
                    </span>
                    {state.propertyFiEnabled && (
                      <span className="text-xs font-medium text-cyan-600 bg-cyan-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {state.propertyFiEnabled
                      ? 'Hyper-targeted property intelligence with volume discounts'
                      : 'Enable for AI-powered property intelligence reveals'}
                  </p>
                </div>
              </div>
              <Switch
                checked={state.propertyFiEnabled}
                onCheckedChange={(v) => update({ propertyFiEnabled: v })}
              />
            </div>
          </div>

          {/* ── Pricing Cards Grid ──────────────────────────────────── */}
          <div
            className={cn(
              'grid gap-5',
              state.propertyFiEnabled
                ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-5'
                : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4'
            )}
          >
            {/* ─ Card 1: The Platform ─ */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-center gap-2.5 mb-1">
                <Badge letter="P" color="#3b82f6" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    The Platform
                  </h3>
                  <p className="text-xs text-gray-400">Outbound SMS Tools</p>
                </div>
              </div>

              <div className="mt-3 mb-3">
                <span className="inline-flex rounded-md border border-gray-200 text-xs font-medium overflow-hidden">
                  <span className="px-3 py-1 bg-white text-gray-900 shadow-sm">
                    Annual
                  </span>
                </span>
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                <Feature>SMS Tools</Feature>
                <Feature>Jackie AI</Feature>
                <Feature>Reveal &amp; ReEngage</Feature>
                <Feature>Sales Board &amp; Automations</Feature>
                <Feature>Templates &amp; Integrations</Feature>
                <Feature>Training &amp; Unlimited Users</Feature>
              </ul>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(
                      state.platformQty > 1
                        ? getPlatformAvgPerYear(state.platformQty)
                        : 3300
                    )}
                  </span>
                  <span className="text-xs text-gray-400">
                    {state.platformQty > 1 ? '/yr avg' : '/yr'}
                  </span>
                </div>
                <QtyControl
                  value={state.platformQty}
                  onChange={(v) => update({ platformQty: v })}
                  min={1}
                />
              </div>

              <div className="mt-3 bg-blue-50 text-blue-700 rounded-lg px-3 py-2 text-xs">
                <p className="font-semibold">
                  $3,300/yr for the first platform
                </p>
                <p>$1,500/yr each additional</p>
              </div>
            </div>

            {/* ─ Card 2: Credits ─ */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-center gap-2.5 mb-1">
                <Badge letter="C" color="#22c55e" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Credits
                  </h3>
                  <p className="text-xs text-gray-400">Volume Usage</p>
                </div>
              </div>

              <div className="mt-3 mb-3">
                <BillingToggle
                  value={state.creditBilling}
                  onChange={(v) => update({ creditBilling: v })}
                />
              </div>

              <ul className="space-y-1.5 mb-4">
                <Feature>
                  {formatCurrency(getVolumeTier(state.creditQty).price, 3)} per
                  credit
                </Feature>
                <Feature>Expire after 12 months</Feature>
                <Feature>Reveal = 1 credit / SMS = 3 credits</Feature>
                <Feature>Free Inbound SMS</Feature>
              </ul>

              <div className="mb-2">
                <label className="text-xs font-medium text-gray-500 block mb-1">
                  Credit Qty
                </label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={state.creditQty}
                  onChange={(e) =>
                    update({
                      creditQty: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {creditDiscount > 0 && (
                <p className="text-xs text-emerald-600 flex items-center gap-1 mb-1">
                  <Check className="w-3.5 h-3.5" />
                  {creditDiscount.toFixed(1)}% volume discount applied
                </p>
              )}

              <VolumeTable activeQty={state.creditQty} />
            </div>

            {/* ─ Card 3: Warm Email ─ */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-center gap-2.5 mb-1">
                <Badge letter="E" color="#a855f7" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Warm Email
                  </h3>
                  <p className="text-xs text-gray-400">Additional Touches</p>
                </div>
              </div>

              <div className="mt-3 mb-3">
                <BillingToggle
                  value={state.emailBilling}
                  onChange={(v) => update({ emailBilling: v })}
                />
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                <Feature>7,500 emails/mo per bundle</Feature>
                <Feature>Domain Protection</Feature>
                <Feature>Drip Campaigns &amp; Copy</Feature>
                <Feature>30 Days To Warm Up</Feature>
              </ul>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(3000)}
                  </span>
                  <span className="text-xs text-gray-400">/yr</span>
                </div>
                <QtyControl
                  value={state.emailQty}
                  onChange={(v) => update({ emailQty: v })}
                  min={0}
                />
              </div>
            </div>

            {/* ─ Card 4: Done For You ─ */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col">
              <div className="flex items-center gap-2.5 mb-1">
                <Badge letter="D" color="#f97316" />
                <div>
                  <h3 className="font-semibold text-slate-900 text-sm">
                    Done For You
                  </h3>
                  <p className="text-xs text-gray-400">
                    We Handle The Day To Day
                  </p>
                </div>
              </div>

              <div className="mt-3 mb-3">
                <BillingToggle
                  value={state.dfyBilling}
                  onChange={(v) => update({ dfyBilling: v })}
                />
              </div>

              <ul className="space-y-1.5 mb-4 flex-1">
                <Feature>9 Hours per Month</Feature>
                <Feature>Weekly Searches</Feature>
                <Feature>Monthly Reports</Feature>
                <Feature>Quarterly Strategy Meeting</Feature>
              </ul>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <span className="text-2xl font-bold text-slate-900">
                    {formatCurrency(1200)}
                  </span>
                  <span className="text-xs text-gray-400">/qtr</span>
                </div>
                <QtyControl
                  value={state.dfyQty}
                  onChange={(v) => update({ dfyQty: v })}
                  min={0}
                />
              </div>
            </div>

            {/* ─ Card 5: PropertyFi Intelligence (conditional) ─ */}
            {state.propertyFiEnabled && (
              <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col ring-2 ring-cyan-400 border border-cyan-200">
                <div className="flex items-center gap-2.5 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 text-sm">
                      PropertyFi Intel
                    </h3>
                    <p className="text-xs text-gray-400">
                      AI Property Reveals
                    </p>
                  </div>
                </div>

                <div className="mt-3 mb-3">
                  <span className="inline-flex rounded-md border border-gray-200 text-xs font-medium overflow-hidden">
                    <span className="px-3 py-1 bg-white text-gray-900 shadow-sm">
                      Annual
                    </span>
                  </span>
                </div>

                <ul className="space-y-1.5 mb-4">
                  <Feature>
                    {formatCurrency(pfiTier.price, 2)} per property
                  </Feature>
                  <Feature>Hyper-targeted intelligence</Feature>
                  <Feature>AI-powered property analysis</Feature>
                  <Feature>Same volume discounts apply</Feature>
                </ul>

                {/* Price per property input */}
                <div className="mb-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Price per Property
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={state.pfiPricePerProperty}
                      onChange={(e) =>
                        update({
                          pfiPricePerProperty: Math.max(
                            0,
                            parseFloat(e.target.value) || 0
                          ),
                        })
                      }
                      className="w-full border border-gray-200 rounded-lg pl-7 pr-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Property qty input */}
                <div className="mb-2">
                  <label className="text-xs font-medium text-gray-500 block mb-1">
                    Property Qty
                  </label>
                  <input
                    type="number"
                    min={0}
                    step={100}
                    value={state.pfiPropertyQty}
                    onChange={(e) =>
                      update({
                        pfiPropertyQty: Math.max(
                          0,
                          parseInt(e.target.value) || 0
                        ),
                      })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                  />
                </div>

                {pfiDiscount > 0 && (
                  <p className="text-xs text-cyan-600 flex items-center gap-1 mb-1">
                    <Check className="w-3.5 h-3.5" />
                    {pfiDiscount.toFixed(1)}% volume discount applied
                  </p>
                )}

                <PfiVolumeTable
                  activeQty={state.pfiPropertyQty}
                  basePrice={state.pfiPricePerProperty}
                />
              </div>
            )}
          </div>

          {/* ── Platform Discount ────────────────────────────────────── */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <AccordionPrimitive.Root type="single" collapsible>
              <AccordionPrimitive.Item value="discount" className="border-none">
                <AccordionPrimitive.Header className="flex">
                  <AccordionPrimitive.Trigger className="flex flex-1 items-center justify-between px-5 py-4 font-medium transition-all hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180">
                    <span className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
                      Platform Discount
                    </span>
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200" />
                  </AccordionPrimitive.Trigger>
                </AccordionPrimitive.Header>
                <AccordionPrimitive.Content className="overflow-hidden text-sm data-[state=closed]:animate-[accordion-up_0.2s_ease-out] data-[state=open]:animate-[accordion-down_0.2s_ease-out]">
                  <div className="px-5 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-600">
                        Discounts for referrals &amp; case studies
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={100}
                          value={state.discountPercent}
                          onChange={(e) =>
                            update({
                              discountPercent: Math.min(
                                100,
                                Math.max(0, parseFloat(e.target.value) || 0)
                              ),
                            })
                          }
                          className="w-20 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-500">%</span>
                      </div>
                    </div>
                  </div>
                </AccordionPrimitive.Content>
              </AccordionPrimitive.Item>
            </AccordionPrimitive.Root>
          </div>

          {/* ── Pricing Breakdown ────────────────────────────────────── */}
          <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden">
            <h2 className="text-sm font-bold tracking-wider uppercase mb-5">
              Pricing Breakdown
            </h2>

            {/* Top row: per-category */}
            <div
              className={cn(
                'grid gap-6 mb-6',
                state.propertyFiEnabled
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              )}
            >
              <div>
                <p className="text-xs text-gray-400 mb-1">Platform (annual)</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(breakdown.platformAnnual)}
                  <span className="text-xs font-normal text-gray-500">/yr</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {state.platformQty === 1
                    ? '1 × $3,300/yr'
                    : `$3,300 + ${state.platformQty - 1} × $1,500`}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Credits ({state.creditBilling})
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(breakdown.creditsTotal)}
                  <span className="text-xs font-normal text-gray-500">/yr</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatNumber(state.creditQty)} ×{' '}
                  {formatCurrency(breakdown.creditPricePerUnit, 3)}/credit
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  Email ({state.emailBilling})
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(breakdown.emailAnnual)}
                  <span className="text-xs font-normal text-gray-500">/yr</span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {state.emailQty} × $3,000/yr
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1">
                  DFY ({state.dfyBilling})
                </p>
                <p className="text-2xl font-bold">
                  {formatCurrency(breakdown.dfyQuarterly)}
                  <span className="text-xs font-normal text-gray-500">
                    /qtr
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {state.dfyQty} × $1,200/qtr
                </p>
              </div>

              {state.propertyFiEnabled && (
                <div>
                  <p className="text-xs text-cyan-400 mb-1">
                    PropertyFi Intel (annual)
                  </p>
                  <p className="text-2xl font-bold text-cyan-400">
                    {formatCurrency(breakdown.pfiTotal)}
                    <span className="text-xs font-normal text-cyan-600">
                      /yr
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatNumber(state.pfiPropertyQty)} ×{' '}
                    {formatCurrency(breakdown.pfiPricePerProperty, 2)}/property
                  </p>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-700 mb-6" />

            {/* Bottom row: totals */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Upfront Payment
                </p>
                <p className="text-3xl font-bold text-yellow-400">
                  {formatCurrency(breakdown.upfrontPayment)}
                </p>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  <p>Platform: {formatCurrency(breakdown.platformAnnual)}</p>
                  <p>Credits: {formatCurrency(breakdown.creditsTotal)}</p>
                  <p>DFY: {formatCurrency(breakdown.dfyQuarterly)}</p>
                  {state.propertyFiEnabled && breakdown.pfiTotal > 0 && (
                    <p>PFI: {formatCurrency(breakdown.pfiTotal)}</p>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Annual Price
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(breakdown.annualPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Monthly Avg
                </p>
                <p className="text-3xl font-bold">
                  {formatCurrency(breakdown.monthlyAvg)}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">
                  Total Discounts
                </p>
                <p className="text-3xl font-bold text-emerald-400">
                  {breakdown.creditDiscountAmount +
                    breakdown.pfiDiscountAmount >
                  0
                    ? `\u2212${formatCurrency(
                        breakdown.creditDiscountAmount +
                          breakdown.pfiDiscountAmount
                      )}`
                    : formatCurrency(0)}
                </p>
                <div className="text-xs text-gray-500 mt-1 space-y-0.5">
                  {breakdown.creditDiscountAmount > 0 && (
                    <p>
                      Credits ({breakdown.creditDiscountPercent.toFixed(1)}%
                      off): &minus;
                      {formatCurrency(breakdown.creditDiscountAmount)}
                    </p>
                  )}
                  {state.propertyFiEnabled &&
                    breakdown.pfiDiscountAmount > 0 && (
                      <p>
                        PFI ({breakdown.pfiDiscountPercent.toFixed(1)}% off):
                        &minus;{formatCurrency(breakdown.pfiDiscountAmount)}
                      </p>
                    )}
                </div>

                <div className="mt-4 text-right">
                  <p className="text-xs text-yellow-500">{today}</p>
                  <p className="text-xs text-gray-500">
                    Pricing valid for 30 days
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ── ROI Estimate Tab ──────────────────────────────────────── */}
      {activeTab === 'roi-estimate' && (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
          <RoiEstimateTab
            pricingState={state}
            roiVertical={roiVertical}
            setRoiVertical={setRoiVertical}
            avgSalePrice={avgSalePrice}
            setAvgSalePrice={setAvgSalePrice}
            winRate={winRate}
            setWinRate={setWinRate}
          />
        </main>
      )}

      {/* Placeholder for other tabs */}
      {activeTab !== 'pricing' && activeTab !== 'roi-estimate' && (
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-gray-400 text-lg">
            {tabs.find(
              (t) => t.toLowerCase().replace(/\s+/g, '-') === activeTab
            )}{' '}
            &mdash; coming soon
          </p>
        </main>
      )}
    </div>
  );
}
