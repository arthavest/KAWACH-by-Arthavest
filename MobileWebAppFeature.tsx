import React, { useState } from 'react';
import {
  Holding,
  UniverseStock,
  TradeOrder,
  MarketState,
  AnalysisResult
} from '../types';
import { npr, nprF, pc, sg, cls } from '../utils/format';
import { PWAInstallButton } from '../components/pwa/PWAInstallButton';
import { OfflineIndicator } from '../components/pwa/OfflineIndicator';
import {
  TrendingUp,
  Briefcase,
  ShieldCheck,
  Layers,
  Search,
  ShoppingCart,
  Plus,
  Zap,
  Building2,
  Coins,
  ChevronRight,
  ArrowRight
} from 'lucide-react';

export interface MobileWebAppFeatureProps {
  marketState: MarketState;
  analysis: AnalysisResult;
  holdings: Holding[];
  allStocks: UniverseStock[];
  orders: TradeOrder[];
  cashBalance: number;
  onOpenTradeModal: (stock: UniverseStock, action: 'BUY' | 'SELL') => void;
  onSelectStockModal: (stock: UniverseStock) => void;
  onNavigateToConsole: (view: string) => void;
  onReturnToWebsite: () => void;
}

export const MobileWebAppFeature: React.FC<MobileWebAppFeatureProps> = ({
  marketState,
  analysis: a,
  holdings,
  allStocks,
  orders,
  cashBalance,
  onOpenTradeModal,
  onSelectStockModal,
  onNavigateToConsole,
  onReturnToWebsite
}) => {
  // Mobile touch navigation tab
  const [mobileTab, setMobileTab] = useState<'MARKET' | 'PORTFOLIO' | 'TRADE' | 'SHIELD' | 'FUNDS'>('MARKET');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStocks = allStocks.filter(
    s =>
      s.sym.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-md mx-auto min-h-screen bg-slate-50 dark:bg-[#070D18] border-x border-slate-200 dark:border-slate-800 flex flex-col justify-between shadow-2xl text-xs font-sans pb-20 select-none">
      <OfflineIndicator />

      {/* 1. Mobile Top App Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0B1424]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <svg className="w-6 h-8 flex-none" viewBox="0 0 200 240">
            <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#B4213A" />
            <path d="M100 46 L100 196 M100 46 L152 68 V112 C152 150 128 178 100 192" fill="none" stroke="#fff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" opacity=".92" />
          </svg>
          <div>
            <div className="font-serif font-bold text-base text-slate-900 dark:text-white leading-none">
              KAWACH MOBILE
            </div>
            <div className="text-[10px] text-slate-400 font-sans mt-0.5">ATH Capital Nepal PWA</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* PWA Install Button */}
          <PWAInstallButton className="text-[11px] py-1 px-2.5" />
          <div className="text-right">
            <div className="font-serif font-bold text-xs text-slate-900 dark:text-slate-100 font-mono">
              {marketState.index.toFixed(2)}
            </div>
            <div className={`text-[10px] font-semibold ${cls(marketState.pct)}`}>
              {sg(marketState.pct, 2)}
            </div>
          </div>
        </div>
      </header>

      {/* 2. Main Mobile Tab Views */}
      <main className="flex-1 p-4 space-y-4">
        {/* TAB 1: MARKET */}
        {mobileTab === 'MARKET' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            {/* Live Ticker Card */}
            <div className="bg-gradient-to-br from-[#0F1A2C] to-[#15233A] text-white p-4 rounded-2xl shadow-lg border border-[#233550] space-y-3">
              <div className="flex justify-between items-center text-xs text-[#9FB0C8]">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${marketState.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span>NEPSE Continuous Session</span>
                </div>
                <span className="font-mono text-[10px]">{marketState.timestamp}</span>
              </div>

              <div className="flex justify-between items-end">
                <div>
                  <div className="font-serif font-bold text-3xl">
                    {marketState.index.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                  <div className={`text-xs font-semibold ${cls(marketState.pct)} flex items-center gap-1`}>
                    <span>{marketState.change >= 0 ? '+' : ''}{marketState.change.toFixed(2)}</span>
                    <span>({sg(marketState.pct, 2)})</span>
                  </div>
                </div>

                <div className="text-right text-[11px]">
                  <span className="text-[#9FB0C8] block">Turnover</span>
                  <span className="font-bold text-white font-mono">{npr(marketState.turnover)}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-[#1F304B] flex justify-between text-[11px] text-[#9FB0C8]">
                <span>Adv: <b className="text-emerald-400">{marketState.advances}</b></span>
                <span>Dec: <b className="text-rose-400">{marketState.declines}</b></span>
                <span>Unch: <b>{marketState.unchanged}</b></span>
              </div>
            </div>

            {/* Quick Sector Carousel */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Sector Movement</span>
                <button
                  onClick={() => onNavigateToConsole('market')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold"
                >
                  View All
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {marketState.subIndices.slice(0, 4).map(sub => (
                  <div key={sub.name} className="p-2.5 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 truncate block text-[11px]">{sub.name}</span>
                    <div className="flex justify-between items-baseline mt-1">
                      <b className="font-serif text-slate-900 dark:text-slate-100">{sub.value.toFixed(0)}</b>
                      <span className={`font-mono font-bold text-[10px] ${cls(sub.pChange)}`}>
                        {sg(sub.pChange / 100, 1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Blue-Chips */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-slate-800 dark:text-slate-200">Active Securities</span>
                <span className="text-[11px] text-slate-400">Live Ticks</span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-[#121C2E] rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                {allStocks.slice(0, 6).map(s => (
                  <div
                    key={s.sym}
                    onClick={() => onSelectStockModal(s)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{s.sym}</span>
                        <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">{s.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400">Vol: {(s.volume / 1000).toFixed(0)}k</div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-slate-900 dark:text-slate-100">
                        {nprF(s.price)}
                      </div>
                      <div className={`text-[10px] font-semibold ${cls(s.pChange)}`}>
                        {sg(s.pChange / 100, 2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PORTFOLIO */}
        {mobileTab === 'PORTFOLIO' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                Total Valuation
              </span>
              <div className="font-serif font-bold text-3xl text-slate-900 dark:text-slate-100">
                {nprF(a.V)}
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className={`font-semibold ${cls(a.pnl)}`}>
                  {a.pnl >= 0 ? '+' : ''}{nprF(a.pnl)} ({sg(a.basis ? a.pnl / a.basis : 0, 2)})
                </span>
                <span className="text-slate-400">on cost {npr(a.basis)}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-500">
                <span>Holdings: <b>{holdings.length} scrips</b></span>
                <span>Eff N: <b>{a.effN.toFixed(1)}</b></span>
                <span>Beta: <b>{a.beta.toFixed(2)}</b></span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-800 dark:text-slate-200">Current Positions</span>
                <button
                  onClick={() => onNavigateToConsole('holdings')}
                  className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-0.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Scrip</span>
                </button>
              </div>

              <div className="space-y-2">
                {a.H.map((h, i) => (
                  <div
                    key={h.sym + i}
                    className="p-3 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{h.sym}</span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {h.qty} @ Rs {h.cost}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        LTP: Rs {h.ltp} • Wt: {pc(h.w, 1)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-slate-900 dark:text-slate-100">
                        {nprF(h.value)}
                      </div>
                      <div className={`text-[10px] font-semibold ${cls(h.pnl)}`}>
                        {h.pnl >= 0 ? '+' : ''}{nprF(h.pnl)} ({sg(h.pnlPct, 1)})
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TRADE */}
        {mobileTab === 'TRADE' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 uppercase font-bold block">
                  Available Trading Cash
                </span>
                <span className="font-serif font-bold text-lg text-emerald-900 dark:text-emerald-100">
                  {nprF(cashBalance)}
                </span>
              </div>
              <button
                onClick={() => onNavigateToConsole('trading')}
                className="text-[10px] bg-emerald-600 text-white font-bold px-2.5 py-1 rounded-lg"
              >
                Orders ({orders.length})
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search any NEPSE company..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#121C2E] text-xs text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              {filteredStocks.slice(0, 10).map(s => (
                <div
                  key={s.sym}
                  className="p-3 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                >
                  <div onClick={() => onSelectStockModal(s)} className="cursor-pointer flex-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <span>{s.sym}</span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono">
                        {s.sector.slice(0, 8)}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Rs {s.price} ({sg(s.pChange / 100, 2)})
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <button
                      onClick={() => onOpenTradeModal(s, 'BUY')}
                      className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs"
                    >
                      BUY
                    </button>
                    <button
                      onClick={() => onOpenTradeModal(s, 'SELL')}
                      className="px-3 py-1 rounded-lg bg-rose-600 text-white font-bold text-xs"
                    >
                      SELL
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SHIELD */}
        {mobileTab === 'SHIELD' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div className="p-5 rounded-2xl bg-[#0F1A2C] text-white border border-[#1C2C45] flex items-center gap-5 shadow-lg">
              <svg className="w-20 h-24 flex-none" viewBox="0 0 200 240">
                <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#182740" />
                <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#2FA377" opacity="0.85" />
                <text x="100" y="130" textAnchor="middle" className="font-serif font-bold text-5xl fill-white">
                  {a.score.total}
                </text>
                <text x="100" y="155" textAnchor="middle" className="font-sans font-semibold text-[11px] fill-[#DDE4EF] uppercase tracking-wider">
                  SCORE
                </text>
              </svg>

              <div className="space-y-1">
                <div className="font-serif font-bold text-base">Kawach Protection</div>
                <p className="text-[11px] text-[#9FB0C8] leading-tight">
                  Evaluates multi-sector diversification, downside VaR, and single-stock ceilings.
                </p>
                <div className="text-[11px] font-semibold text-emerald-400 pt-1">
                  1-Day VaR: {npr(a.var95)}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="font-bold text-slate-800 dark:text-slate-200">Alerts & Limits</span>
              {a.alerts.map((al, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                    al.kind === 'crit'
                      ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 text-rose-800 dark:text-rose-200'
                      : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 text-emerald-800 dark:text-emerald-200'
                  }`}
                >
                  <div className={`w-2 h-2 rounded-full mt-1.5 ${al.kind === 'crit' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                  <div>
                    <b className="block">{al.t}</b>
                    <span className="text-[11px] opacity-90">{al.d}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigateToConsole('stress')}
              className="w-full p-3 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-between font-semibold"
            >
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-rose-500" />
                <span>Simulate Earthquake & Margin Shock</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        )}

        {/* TAB 5: FUNDS */}
        {mobileTab === 'FUNDS' && (
          <div className="space-y-4 animate-in fade-in duration-150">
            <div
              onClick={() => onNavigateToConsole('ath50')}
              className="p-4 rounded-2xl bg-gradient-to-br from-[#0F1A2C] to-[#16253E] text-white border border-[#233550] shadow-md space-y-3 cursor-pointer"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-700/50 uppercase">
                    0.25% Low Fee
                  </span>
                  <h3 className="font-serif font-bold text-lg mt-1">Nepal Top-50 ETF (ATH50)</h3>
                </div>
                <Layers className="w-5 h-5 text-emerald-400" />
              </div>
              <p className="text-[11px] text-[#9FB0C8]">
                One trade for all 50 blue-chips with an 8% single-scrip maximum cap.
              </p>
              <div className="flex justify-between items-center text-xs pt-1 border-t border-[#1F304B] text-emerald-400 font-semibold">
                <span>Join Allocation Waitlist</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div
              onClick={() => onNavigateToConsole('gold_reit')}
              className="p-4 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>ARTHAGOLD 24K Bullion ETF</span>
                </div>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">Rs 1,72,800 / Tola</span>
              </div>
              <p className="text-[11px] text-slate-500">
                100% physically vaulted 999.9 gold in Kathmandu. Physical redemption from 10 Tolas.
              </p>
            </div>

            <div
              onClick={() => onNavigateToConsole('gold_reit')}
              className="p-4 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-sm space-y-2 cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-500" />
                  <span>ARTHAREIT Income Trust</span>
                </div>
                <span className="text-[10px] text-emerald-600 font-bold">8.4% Yield</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Quarterly cash dividends from Grade-A commercial properties in Kathmandu and Pokhara.
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 3. Mobile Fixed Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white/95 dark:bg-[#0B1424]/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 grid grid-cols-5 py-2 px-1 text-[10px] text-slate-500 dark:text-slate-400">
        <button
          onClick={() => setMobileTab('MARKET')}
          className={`flex flex-col items-center gap-1 py-1 ${
            mobileTab === 'MARKET' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Market</span>
        </button>

        <button
          onClick={() => setMobileTab('PORTFOLIO')}
          className={`flex flex-col items-center gap-1 py-1 ${
            mobileTab === 'PORTFOLIO' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Portfolio</span>
        </button>

        <button
          onClick={() => setMobileTab('TRADE')}
          className={`flex flex-col items-center gap-1 py-1 ${
            mobileTab === 'TRADE' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Trade</span>
        </button>

        <button
          onClick={() => setMobileTab('SHIELD')}
          className={`flex flex-col items-center gap-1 py-1 ${
            mobileTab === 'SHIELD' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Kawach</span>
        </button>

        <button
          onClick={() => setMobileTab('FUNDS')}
          className={`flex flex-col items-center gap-1 py-1 ${
            mobileTab === 'FUNDS' ? 'text-rose-600 dark:text-rose-400 font-bold' : ''
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Funds</span>
        </button>
      </nav>
    </div>
  );
};
