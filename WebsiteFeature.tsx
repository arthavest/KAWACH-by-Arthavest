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
  Smartphone,
  Globe,
  Sun,
  Moon,
  MapPin,
  Mail,
  Award,
  Download
} from 'lucide-react';
import { MarketState, AnalysisResult } from '../types';
import { GOLD_DATA, REIT_DATA } from '../data/nepseData';
import { npr, nprF, sg, cls } from '../utils/format';

export interface WebsiteFeatureProps {
  marketState: MarketState;
  analysis: AnalysisResult;
  onLaunchConsole: (tab?: string) => void;
  onLaunchMobileWebApp: () => void;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export const WebsiteFeature: React.FC<WebsiteFeatureProps> = ({
  marketState,
  analysis: a,
  onLaunchConsole,
  onLaunchMobileWebApp,
  isDark = true,
  onToggleTheme
}) => {
  // Section navigation
  const [activeSection, setActiveSection] = useState<'hero' | 'products' | 'transparency' | 'aladdin' | 'about'>('hero');

  // Interactive SIP compounding calculator state
  const [monthlySip, setMonthlySip] = useState<number>(20000);
  const [sipYears, setSipYears] = useState<number>(20);

  const rEtf = 0.14 / 12; // 14% p.a. - 0.25% fee
  const rMf = 0.125 / 12; // 14% p.a. - 1.50% legacy fee
  const nMonths = sipYears * 12;
  const fvEtf = monthlySip * ((Math.pow(1 + rEtf, nMonths) - 1) / rEtf) * (1 + rEtf);
  const fvMf = monthlySip * ((Math.pow(1 + rMf, nMonths) - 1) / rMf) * (1 + rMf);
  const feeSavings = fvEtf - fvMf;

  const scrollTo = (id: 'hero' | 'products' | 'transparency' | 'aladdin' | 'about') => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#F2F4F8] dark:bg-[#0A111E] text-[#101B2D] dark:text-[#E8ECF3] transition-colors flex flex-col font-sans">
      {/* 1. Live NEPSE Ticker Header */}
      <div className="bg-[#070D18] text-slate-300 py-2 px-4 text-xs border-b border-[#142137]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-slate-400">
              <span className={`w-2 h-2 rounded-full ${marketState.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-200">NEPSE Composite:</span>
            </span>
            <span className="font-mono font-bold text-white">
              {marketState.index.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className={`font-mono font-bold ${cls(marketState.pct)}`}>
              {sg(marketState.pct, 2)} ({marketState.change >= 0 ? '+' : ''}{marketState.change.toFixed(2)})
            </span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">
              Turnover: <b className="text-slate-200">{npr(marketState.turnover)}</b>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-slate-400 text-[11px]">
              T+2 Settlement • SEBON Framework
            </span>
            <button
              onClick={() => onLaunchConsole('trading')}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
            >
              <span>Live Order Depth</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Institutional Navbar */}
      <nav className="sticky top-0 z-40 bg-white/95 dark:bg-[#0B1424]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Logo */}
          <div onClick={() => scrollTo('hero')} className="flex items-center gap-3 cursor-pointer select-none">
            <svg className="w-8 h-10 flex-none" viewBox="0 0 200 240">
              <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#B4213A" />
              <path d="M100 46 L100 196 M100 46 L152 68 V112 C152 150 128 178 100 192" fill="none" stroke="#fff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" opacity=".92" />
            </svg>
            <div>
              <div className="font-serif font-bold text-xl text-slate-900 dark:text-white flex items-center gap-2">
                <span>ATH CAPITAL</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-sans font-normal border border-slate-200 dark:border-slate-700">
                  NEPAL
                </span>
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans">
                ARTHAVEST INVESTMENT • KAWACH
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
            <button onClick={() => scrollTo('hero')} className="hover:text-slate-900 dark:hover:text-white">Overview</button>
            <button onClick={() => scrollTo('products')} className="hover:text-slate-900 dark:hover:text-white">Funds & ETFs</button>
            <button onClick={() => scrollTo('transparency')} className="hover:text-slate-900 dark:hover:text-white">Cost Transparency</button>
            <button onClick={() => scrollTo('aladdin')} className="hover:text-slate-900 dark:hover:text-white">KAWACH by Arthavest</button>
            <button onClick={() => scrollTo('about')} className="hover:text-slate-900 dark:hover:text-white">About</button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5">
            {onToggleTheme && (
              <button
                onClick={onToggleTheme}
                className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
              </button>
            )}

            <a
              href="/kawach-index.html"
              download="index.html"
              className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              title="Download standalone index.html"
            >
              <Download className="w-3.5 h-3.5 text-rose-500" />
              <span>Download HTML</span>
            </a>

            <button
              onClick={onLaunchMobileWebApp}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mobile Webapp</span>
            </button>

            <button
              onClick={() => onLaunchConsole('overview')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-95 cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5 text-rose-500" />
              <span>Launch Console</span>
            </button>
          </div>
        </div>
      </nav>

      {/* 3. Hero Section */}
      <section id="hero" className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/5 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-600 animate-pulse" />
            <span>ALADDIN-GRADE RISK • ZERODHA-GRADE COST TRANSPARENCY</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08]">
            World-Class Investment Platform for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 via-amber-600 to-emerald-600">
              Nepal
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Direct NEPSE execution, the low-cost <b>ATH50</b> index fund, physically vaulted gold ETF, and commercial real estate income — engineered with Aladdin-grade risk decomposition.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onLaunchConsole('overview')}
              className="px-7 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm shadow-xl hover:shadow-2xl hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-rose-500" />
              <span>Launch KAWACH Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onLaunchMobileWebApp}
              className="px-6 py-3.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#121C2E] text-slate-800 dark:text-slate-200 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Open Mobile Webapp (PWA)</span>
            </button>
          </div>
        </div>

        {/* Hero Interactive Terminal Graphic */}
        <div className="max-w-5xl mx-auto rounded-3xl bg-[#0F1A2C] border border-[#1F304B] p-6 sm:p-8 text-[#EEF1F6] shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Dynamic Shield Preview */}
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
                All SEBON regulatory limits verified
              </div>
            </div>

            {/* Live Metrics */}
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
                Interactive Console Ready
              </div>
              <p className="text-xs text-[#9FB0C8] leading-relaxed">
                Test your holdings, simulate earthquake shocks, run 2,000-run Monte Carlo simulations, or trade with paper funds.
              </p>
              <button
                onClick={() => onLaunchConsole('overview')}
                className="w-full py-2.5 rounded-xl bg-white text-slate-900 font-bold text-xs shadow-md hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Explore Full Terminal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Products Section */}
      <section id="products" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            FUNDS & ASSET PRODUCTS
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white">
            Institutional Quality for Every Nepali Investor
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Index funds, vaulted gold, commercial real estate, and live NEPSE trading with zero middlemen markup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Product 1: ATH50 Index ETF */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Layers className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 uppercase">
                0.25% Low Fee
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                Nepal Top-50 ETF (ATH50)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Invest across all 50 blue-chip NEPSE companies with a single trade. Automatic 8% concentration capping.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole('ath50')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Explore ATH50 Fund</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product 2: ARTHAGOLD Bullion ETF */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <Coins className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400 uppercase">
                999.9 Fine 24K Gold
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                ARTHAGOLD Bullion ETF
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                100% physical vaulted gold in Kathmandu. Zero making charges, zero purity loss, physical redemption from 10 Tolas.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole('gold_reit')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Explore Gold ETF</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product 3: ARTHAREIT Commercial Income Trust */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-center text-blue-600 dark:text-blue-400">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400 uppercase">
                8.4% Target Yield
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                ARTHAREIT Income Trust
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Quarterly rental dividend distributions from Grade-A commercial properties and IT tech parks in Kathmandu and Pokhara.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole('gold_reit')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Explore REIT Trust</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Product 4: KAWACH Risk Engine */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                <Shield className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-400 uppercase">
                KAWACH by Arthavest
              </span>
              <h3 className="font-serif font-bold text-xl text-slate-900 dark:text-white">
                KAWACH Risk Console
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Multi-factor covariance matrix, Cholesky Monte Carlo simulations, and historical stress tests tailored for NEPSE.
              </p>
            </div>
            <button
              onClick={() => onLaunchConsole('risk')}
              className="w-full py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span>Explore KAWACH by Arthavest</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Cost Transparency Section */}
      <section id="transparency" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10">
        <div className="bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              ZERODHA-GRADE COST TRANSPARENCY
            </span>
            <h2 className="font-serif text-3xl font-bold text-slate-900 dark:text-white">
              Fee Compounding Over 20 Years
            </h2>
            <p className="text-xs text-slate-500">
              Legacy mutual funds charge up to 1.50% - 2.0% regardless of performance. See how shifting to a 0.25% index fund preserves millions:
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center text-xs">
            <div className="bg-white dark:bg-[#121C2E] p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h4 className="font-serif font-bold text-base text-slate-900 dark:text-white">
                Interactive Wealth Simulator
              </h4>
              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Monthly Investment</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{nprF(monthlySip)}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="100000"
                  step="5000"
                  value={monthlySip}
                  onChange={e => setMonthlySip(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>

              <div>
                <div className="flex justify-between font-semibold mb-1">
                  <span>Investment Horizon</span>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">{sipYears} Years</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="30"
                  step="1"
                  value={sipYears}
                  onChange={e => setSipYears(parseInt(e.target.value))}
                  className="w-full accent-emerald-600"
                />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0F1A2C] to-[#16253E] border border-[#233550] text-[#EEF1F6] space-y-3 font-mono">
              <div className="p-3 rounded-xl bg-[#142137] border border-emerald-500/30 flex justify-between items-center">
                <div>
                  <span className="text-[#9FB0C8] text-[10px] block font-sans">With ATH50 (0.25% fee):</span>
                  <span className="font-serif font-bold text-xl text-emerald-400">{npr(fvEtf)}</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-700/40">
                  Maximum Wealth
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#142137] border border-white/5 flex justify-between items-center">
                <div>
                  <span className="text-[#9FB0C8] text-[10px] block font-sans">With Legacy Fund (1.50% fee):</span>
                  <span className="font-serif font-bold text-lg text-slate-300">{npr(fvMf)}</span>
                </div>
                <span className="text-[10px] font-sans text-rose-400 bg-rose-950 px-2 py-0.5 rounded-full border border-rose-800/30">
                  -1.50% Drag
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex justify-between items-center font-sans">
                <span className="font-medium text-amber-200">Fee Savings Kept By You:</span>
                <span className="font-mono font-bold text-base text-amber-300">+{npr(feeSavings)}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Institutional Footer */}
      <footer id="about" className="mt-auto bg-[#070D18] text-[#93A0B5] border-t border-[#162338] pt-12 pb-8 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#142137]">
            <div className="space-y-1">
              <div className="font-serif font-bold text-lg text-white">ARTHAVEST INVESTMENT PRIVATE LIMITED</div>
              <div className="text-[11px] text-slate-400">Hattisar & Durbarmarg Hub, Kathmandu, Nepal • contact@arthavest.com.np</div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => onLaunchConsole('overview')}
                className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-xs"
              >
                Launch Console
              </button>
              <button
                onClick={onLaunchMobileWebApp}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
              >
                Mobile Webapp
              </button>
            </div>
          </div>
          <div className="text-[11px] text-[#556680] text-center">
            © 2026 ARTHAVEST INVESTMENT PRIVATE LIMITED • ATH Capital Nepal. Regulated under SEBON and CDSC framework.
          </div>
        </div>
      </footer>
    </div>
  );
};
