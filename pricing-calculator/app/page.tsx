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
  type PricingState,
} from '@/lib/pricing-config';
import {
  calculateBreakdown,
  formatCurrency,
  formatNumber,
  getPlatformAvgPerYear,
  getVolumeTier,
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
  const activeTier = getVolumeTier(activeQty);
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

/* ════════════════════════════════════════════════════════════════════════
   MAIN PAGE
   ════════════════════════════════════════════════════════════════════════ */
export default function PricingPage() {
  const [state, setState] = useState<PricingState>(DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState('pricing');

  const update = (patch: Partial<PricingState>) =>
    setState((prev) => ({ ...prev, ...patch }));
  const reset = () => setState(DEFAULT_STATE);

  const breakdown = useMemo(() => calculateBreakdown(state), [state]);
  const creditDiscount = breakdown.creditDiscountPercent;
  const pfiDiscount = breakdown.pfiDiscountPercent;
  const pfiTier = getVolumeTier(state.pfiPropertyQty);

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
                <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <span className="font-bold text-lg text-slate-900">
                  GlassHouse
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
            <div
              className={cn(
                'bg-white rounded-xl shadow-sm p-5 flex flex-col transition-all',
                state.dfyQty > 0
                  ? 'ring-2 ring-orange-400 border border-orange-200'
                  : 'border border-gray-100'
              )}
            >
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
                  min={1}
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
                    {formatCurrency(
                      state.pfiPricePerProperty *
                        (pfiTier.price / CREDIT_BASE_PRICE),
                      2
                    )}{' '}
                    per property
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
                      step={0.1}
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
                    step={1000}
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

      {/* Placeholder for other tabs */}
      {activeTab !== 'pricing' && (
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
