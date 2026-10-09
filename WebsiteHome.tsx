import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Coins,
  Building2,
  TrendingUp,
  Calculator,
  ArrowRight,
  CheckCircle2,
  Terminal,
  Zap,
  BarChart3,
  Award,
  Lock,
  Percent,
  Sparkles
} from 'lucide-react';
import { MarketState, AnalysisResult } from '../../types';
import { GOLD_DATA, REIT_DATA } from '../../data/nepseData';
import { npr, nprF, pc, sg, cls } from '../../utils/format';

interface WebsiteHomeProps {
  marketState: MarketState;
  analysis: AnalysisResult;
  onOpenApp: (tab?: string) => void;
  activeSection: string;
}

export const WebsiteHome: React.FC<WebsiteHomeProps> = ({
  marketState,
  analysis: a,
  onOpenApp,
  activeSection
}) => {
  // Quick SIP demo state on landing page
  const [quickSip, setQuickSip] = useState<number>(20000);
  const [quickYears, setQuickYears] = useState<number>(20);
  const rEtf = 0.14 / 12;
  const rMf = 0.125 / 12; // 1.5% fee penalty
  const nMonths = quickYears * 12;
  const fvEtf = quickSip * ((Math.pow(1 + rEtf, nMonths) - 1) / rEtf) * (1 + rEtf);
  const fvMf = quickSip * ((Math.pow(1 + rMf, nMonths) - 1) / rMf) * (1 + rMf);
  const savings = fvEtf - fvMf;

  return (
    <div className="space-y-24 pb-20 animate-in fade-in duration-300">
      {/* 1. Hero Section */}
      <section id="hero" className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>ALADDIN-GRADE RISK • ZERODHA-GRADE COST TRANSPARENCY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            World-Class Investment Platform for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600">
              Nepal
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-sans">
            Direct NEPSE order execution, the low-cost <b>ATH50</b> index fund, physically vaulted gold ETF, and commercial real estate income — engineered with Aladdin-grade risk decomposition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onOpenApp('overview')}
              className="px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-102 transition-all flex items-center gap-2.5 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-rose-500" />
              <span>Launch KAWACH Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onOpenApp('trading')}
              className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121C2E] text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-xs flex items-center gap-2"
            >
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span>Live NEPSE Order Book</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Terminal Graphic Preview */}
        <div className="mt-14 max-w-5xl mx-auto rounded-3xl bg-[#0F1A2C] border border-[#1F304B] p-6 sm:p-8 text-[#EEF1F6] shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

          {/* Console Top Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-[#1C2C45] mb-6">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-[#9FB0C8]">
                KAWACH Institutional Risk Console • Connected to NEPSE Feed
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-800/40">
                Live Simulation Active
              </span>
            </div>
          </div>

          {/* Grid Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Shield preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#142137]/60 rounded-2xl border border-[#233550]">
              <svg className="w-28 h-36" viewBox="0 0 200 240">
                <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#1C2D48" />
                <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#2FA377" opacity="0.85" />
                <text x="100" y="130" textAnchor="middle" className="font-serif font-bold text-5xl fill-white">
                  {a.score.total || 82}
                </text>
                <text x="100" y="155" textAnchor="middle" className="font-sans font-semibold text-[11px] fill-[#DDE4EF] uppercase tracking-wider">
                  KAWACH SCORE
                </text>
              </svg>
              <div className="text-center mt-2 text-xs text-[#9FB0C8]">
                All SEBON concentration limits verified
              </div>
            </div>

            {/* Metrics */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-xl bg-[#142137]/60 border border-[#233550]">
                <div className="text-[11px] text-[#9FB0C8]">Sample Portfolio Value</div>
                <div className="font-serif font-bold text-2xl text-white mt-0.5">
                  {nprF(a.V || 6520000)}
                </div>
                <div className="text-[11px] text-emerald-400 mt-0.5">
                  +Rs 4,80,000 (+7.9%) unrealised gain
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#142137]/60 border border-[#233550]">
                <div className="text-[11px] text-[#9FB0C8]">1-Day 95% Parametric VaR</div>
                <div className="font-serif font-bold text-xl text-rose-400 mt-0.5">
                  {npr(a.var95 || 148000)}
                </div>
                <div className="text-[11px] text-[#9FB0C8]">
                  Diversification Benefit: <b className="text-emerald-400">Rs 45,200</b>
                </div>
              </div>
            </div>

            {/* Quick Action */}
            <div className="p-5 rounded-2xl bg-gradient-to-b from-[#182842] to-[#121F33] border border-[#2C456D] space-y-3">
              <div className="font-serif font-bold text-base text-white">
                Interactive Terminal Ready
              </div>
              <p className="text-xs text-[#9FB0C8] leading-relaxed">
                Test your own portfolio, simulate 2015 earthquake shocks, run Monte Carlo simulations, or place simulated NEPSE orders.
              </p>
              <button
                onClick={() => onOpenApp('overview')}
                className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Full Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Flagship Products Section */}
      <section id="products" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            INVESTMENT PRODUCTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Institutional Asset Management for Retail Investors
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Access index funds, physical bullion, commercial real estate, and live NEPSE trading with zero middlemen markup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: ATH50 Index Fund */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                  0.25% Low Fee ETF
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 mt-2">
                  Nepal Top-50 ETF (ATH50)
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Invest across all 50 blue-chip NEPSE companies with a single trade. Automatic 8% concentration capping.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Constituents:</span>
                  <b className="text-slate-900 dark:text-slate-100">Top 50 NEPSE</b>
                </div>
                <div className="flex justify-between">
                  <span>Expense Ratio:</span>
                  <b className="text-emerald-600 dark:text-emerald-400">0.25% p.a.</b>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenApp('ath50')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Explore ATH50 Fund</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: ARTHAGOLD 24K ETF */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                  999.9 Fine Bullion
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 mt-2">
                  ARTHAGOLD Bullion ETF
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  100% physical vaulted gold in Kathmandu. Zero making charges, zero purity loss, physical redemption from 10 Tolas.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Price / Tola:</span>
                  <b className="text-amber-600 dark:text-amber-400">
                    Rs {GOLD_DATA.pricePerTola.toLocaleString()}
                  </b>
                </div>
                <div className="flex justify-between">
                  <span>Vault Location:</span>
                  <b className="text-slate-900 dark:text-slate-100">Kathmandu Central</b>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenApp('gold_reit')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Explore Gold ETF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: ARTHAREIT Commercial Real Estate */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/80 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 uppercase tracking-wider">
                  8.4% Target Yield
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 mt-2">
                  ARTHAREIT Income Trust
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Earn quarterly rental dividend distributions from commercial Grade-A office buildings and IT tech parks in Nepal.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Rental Yield:</span>
                  <b className="text-emerald-600 dark:text-emerald-400">8.4% p.a.</b>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy:</span>
                  <b className="text-slate-900 dark:text-slate-100">{REIT_DATA.occupancyRate}</b>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenApp('gold_reit')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Explore REIT Trust</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: KAWACH Aladdin Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-6">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/80 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 uppercase tracking-wider">
                  KAWACH by Arthavest
                </span>
                <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100 mt-2">
                  KAWACH Risk Console
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Institutional multi-factor covariance matrix, Cholesky Monte Carlo, and historical stress tests for Nepali portfolios.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-xs font-mono space-y-1 text-slate-600 dark:text-slate-400">
                <div className="flex justify-between">
                  <span>Simulation:</span>
                  <b className="text-slate-900 dark:text-slate-100">2,000 Paths</b>
                </div>
                <div className="flex justify-between">
                  <span>Stress Shocks:</span>
                  <b className="text-rose-600 dark:text-rose-400">7 Scenarios</b>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenApp('risk')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity cursor-pointer"
            >
              <span>Explore KAWACH by Arthavest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Cost Transparency & SIP Calculator Section */}
      <section id="transparency" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ZERODHA-GRADE COST TRANSPARENCY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Stop Losing 1.50% Every Year to High Mutual Fund Fees
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              In Nepal, legacy mutual funds charge up to 1.50% - 2.0% annually regardless of performance. See how shifting to a 0.25% index fund keeps millions of rupees in your own account:
            </p>
          </div>

          {/* Interactive SIP Comparison Widget */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-5 bg-white dark:bg-[#121C2E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs text-xs">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                Simulate Your Wealth Compounding
              </h3>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Monthly Investment</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {nprF(quickSip)}
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={quickSip}
                  onChange={e => setQuickSip(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Investment Horizon</span>
                  <span className="font-mono text-base font-bold text-slate-900 dark:text-white">
                    {quickYears} Years
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={quickYears}
                  onChange={e => setQuickYears(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                Assumes 14.0% annualized NEPSE equity return. ATH50 fee is 0.25% vs traditional fund fee of 1.50% drag.
              </div>
            </div>

            {/* Results comparison card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F1A2C] to-[#16253E] border border-[#233550] text-[#EEF1F6] space-y-4 shadow-xl">
              <div className="text-xs text-[#9FB0C8] uppercase tracking-wider font-semibold">
                Projected Wealth Comparison ({quickYears} Years)
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3.5 rounded-xl bg-[#142137]/80 border border-emerald-500/30 flex justify-between items-center">
                  <div>
                    <span className="text-[#9FB0C8] text-[11px] block font-sans">
                      With ATH50 Index Fund (0.25% Fee):
                    </span>
                    <span className="font-serif font-bold text-2xl text-emerald-400">
                      {npr(fvEtf)}
                    </span>
                  </div>
                  <span className="text-xs font-sans font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-700/40">
                    Maximum Wealth
                  </span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#142137]/80 border border-white/5 flex justify-between items-center">
                  <div>
                    <span className="text-[#9FB0C8] text-[11px] block font-sans">
                      With Legacy Mutual Fund (1.50% Fee):
                    </span>
                    <span className="font-serif font-bold text-xl text-slate-300">
                      {npr(fvMf)}
                    </span>
                  </div>
                  <span className="text-xs font-sans text-rose-400 bg-rose-950/40 px-2.5 py-1 rounded-full border border-rose-800/30">
                    -1.50% Annual Drag
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center text-xs">
                <span className="font-medium text-amber-200">
                  Total Fee Savings Returned to You:
                </span>
                <span className="font-mono font-bold text-lg text-amber-300">
                  +{npr(savings)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Aladdin Risk Management Deep-Dive */}
      <section id="aladdin" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              RISK-FIRST PHILOSOPHY
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
              Inspired by BlackRock Aladdin, Tailored Specifically for NEPSE
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Global risk models assume liquid options and deep derivatives. In Nepal, managing risk requires modeling single-stock illiquidity, Nepal Rastra Bank margin lending caps (4/12 Cr policy), and high sector correlations.
            </p>

            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-slate-100 block">
                    Parametric VaR & Conditional VaR (Expected Shortfall)
                  </b>
                  <span className="text-slate-500">
                    Know exactly how many rupees you could lose on a 1-day, 5-day, or 21-day holding horizon at 95% and 99% confidence.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-slate-100 block">
                    Historical Stress Testing
                  </b>
                  <span className="text-slate-500">
                    Evaluate how your portfolio would have performed during the 2015 Gorkha earthquake (-32%), 2021 liquidity crunch (-38%), or sudden monsoon floods.
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-none mt-0.5" />
                <div>
                  <b className="text-slate-900 dark:text-slate-100 block">
                    SEBON Regulatory Compliance Auditing
                  </b>
                  <span className="text-slate-500">
                    Real-time breach alerts if a single holding exceeds 12%, a sector exceeds 35%, or top-3 holdings exceed 45%.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Console Visual */}
          <div className="p-6 rounded-3xl bg-[#0F1A2C] border border-[#1C2C45] text-[#F2F4F8] space-y-4 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-[#1C2C45]">
              <span className="font-serif font-bold text-base">Aladdin Factor Decomposition</span>
              <span className="text-[10px] font-mono text-[#9FB0C8]">Covariance Matrix: 13 Scrips</span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#142137] border border-[#233550] space-y-1">
                <div className="flex justify-between text-[#9FB0C8]">
                  <span>Commercial Banking Exposure</span>
                  <span className="font-mono font-bold text-white">34.2% (Within 35% limit)</span>
                </div>
                <div className="h-1.5 bg-[#1F304B] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[97%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#142137] border border-[#233550] space-y-1">
                <div className="flex justify-between text-[#9FB0C8]">
                  <span>Hydropower Exposure</span>
                  <span className="font-mono font-bold text-white">18.5% (Benchmark 13%)</span>
                </div>
                <div className="h-1.5 bg-[#1F304B] rounded-full overflow-hidden">
                  <div className="h-full bg-blue-400 rounded-full w-[65%]" />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#142137] border border-[#233550] space-y-1">
                <div className="flex justify-between text-[#9FB0C8]">
                  <span>Single Stock Maximum (UPPER)</span>
                  <span className="font-mono font-bold text-emerald-400">11.8% (Inside 12% ceiling)</span>
                </div>
                <div className="h-1.5 bg-[#1F304B] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-400 rounded-full w-[98%]" />
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => onOpenApp('risk')}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold flex items-center justify-center gap-1 mx-auto"
              >
                <span>Launch Deep Aladdin Analytics in Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Institutional Background & About Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xs space-y-6">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              ABOUT ATH CAPITAL & ARTHAVEST
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
              Institutional Rigour for Every Nepali Investor
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              ARTHAVEST INVESTMENT PRIVATE LIMITED is an institutional asset manager incorporated in Kathmandu, Nepal. Our mission is to democratize institutional-grade financial tools, transparent indexing, and risk architectures for the next generation of Nepali investors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-6 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Headquarters</span>
              <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                Kathmandu, Nepal
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Exchange</span>
              <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                NEPSE (T+2)
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Regulatory Framework</span>
              <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                SEBON & CDSC
              </div>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-semibold">Flagship Terminal</span>
              <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">
                KAWACH Console
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom Banner / CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#0B1424] via-[#121F33] to-[#0B1424] border border-[#233550] rounded-3xl p-8 sm:p-12 text-center text-white space-y-6 shadow-2xl">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold max-w-xl mx-auto leading-tight">
            Ready to Protect and Grow Your Capital?
          </h2>
          <p className="text-xs sm:text-sm text-[#9FB0C8] max-w-md mx-auto leading-relaxed">
            Open the full KAWACH terminal to import your MeroShare portfolio, calculate your Value at Risk, or join the priority ATH50 ETF registry.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenApp('overview')}
              className="px-8 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-lg hover:bg-slate-100 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-rose-600" />
              <span>Launch KAWACH Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onOpenApp('ath50')}
              className="px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/60 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Join ATH50 ETF Waitlist
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
