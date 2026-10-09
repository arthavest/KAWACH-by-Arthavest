import React, { useState, useEffect, useMemo } from 'react';
import {
  Holding,
  RiskLimits,
  UniverseStock,
  TradeOrder,
  OrderAction,
  KycProfile
} from './types';
import { SAMPLE_HOLDINGS, UNIVERSE_MAP } from './data/nepseData';
import { MarketFeedService } from './services/marketFeed';
import { analyzePortfolio } from './services/riskEngine';
import { ViewKey } from './components/NavigationRail';

// The Three Dedicated Standalone Features
import { WebsiteFeature } from './features/WebsiteFeature';
import { MobileWebAppFeature } from './features/MobileWebAppFeature';
import { TerminalConsoleFeature } from './features/TerminalConsoleFeature';

import { PWAInstallButton } from './components/pwa/PWAInstallButton';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';

import { Globe, Terminal, Smartphone, Download } from 'lucide-react';

export type PlatformMode = 'website' | 'terminal' | 'mobile';

export default function App() {
  const marketFeed = MarketFeedService.getInstance();

  // Platform Mode: 'website' (Public Portal), 'terminal' (Desktop Console), 'mobile' (Native Mobile WebApp)
  const [platformMode, setPlatformMode] = useState<PlatformMode>(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return 'mobile';
    }
    return 'website';
  });

  // Dark mode state
  const [isDark, setIsDark] = useState<boolean>(() => {
    const saved = localStorage.getItem('kawach:dark');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Navigation state inside terminal
  const [currentView, setCurrentView] = useState<ViewKey>('overview');

  // Holdings state
  const [holdings, setHoldings] = useState<Holding[]>(() => {
    try {
      const saved = localStorage.getItem('kawach:holdings');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return SAMPLE_HOLDINGS;
  });

  // Risk limits
  const [limits, setLimits] = useState<RiskLimits>(() => {
    try {
      const saved = localStorage.getItem('kawach:limits');
      if (saved) return JSON.parse(saved);
    } catch {}
    return { stock: 0.12, sector: 0.35, top3: 0.45, var: 0.03 };
  });

  // Tax rate (default 7.5%)
  const [taxRate, setTaxRate] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kawach:tax');
      if (saved) return JSON.parse(saved);
    } catch {}
    return 0.075;
  });

  // Paper trading wallet
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('kawach:cash');
      if (saved) return parseFloat(saved);
    } catch {}
    return 1000000; // NPR 10 Lakhs paper money
  });

  // Executed trade orders
  const [orders, setOrders] = useState<TradeOrder[]>(() => {
    try {
      const saved = localStorage.getItem('kawach:orders');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // KYC Profile
  const [profile, setProfile] = useState<KycProfile>(() => {
    try {
      const saved = localStorage.getItem('kawach:profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      fullName: 'Mahendra Dahal',
      email: 'mahendradahal68@gmail.com',
      phone: '+977-9801234567',
      boid: '1301280001849204',
      dmatProvider: 'Nabil Investment Banking Limited',
      citizenshipNo: '27-01-76-04921',
      bankName: 'Nabil Bank Limited',
      bankAccountNo: '01020304050607',
      isVerified: true,
      investorType: 'Individual',
      riskProfile: 'Moderate'
    };
  });

  // Market feed state
  const [marketState, setMarketState] = useState(marketFeed.getState());
  const [simSpeed, setSimSpeed] = useState(marketFeed.getSimSpeed());
  const [isSimActive, setIsSimActive] = useState(true);

  // Sync dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.removeAttribute('data-theme');
    }
    localStorage.setItem('kawach:dark', isDark ? 'true' : 'false');
  }, [isDark]);

  // Persist state
  useEffect(() => {
    localStorage.setItem('kawach:holdings', JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem('kawach:limits', JSON.stringify(limits));
  }, [limits]);

  useEffect(() => {
    localStorage.setItem('kawach:tax', JSON.stringify(taxRate));
  }, [taxRate]);

  useEffect(() => {
    localStorage.setItem('kawach:cash', cashBalance.toString());
  }, [cashBalance]);

  useEffect(() => {
    localStorage.setItem('kawach:orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('kawach:profile', JSON.stringify(profile));
  }, [profile]);

  // Subscribe to real-time market feed
  useEffect(() => {
    const unsub = marketFeed.subscribe(st => {
      setMarketState(st);
      setHoldings(prev =>
        prev.map(h => {
          const liveStock = marketFeed.getStock(h.sym);
          if (liveStock && liveStock.price !== h.ltp) {
            return { ...h, ltp: liveStock.price };
          }
          return h;
        })
      );
    });
    return unsub;
  }, [marketFeed]);

  // Portfolio Aladdin Risk Analysis
  const analysis = useMemo(() => {
    return analyzePortfolio(holdings, limits);
  }, [holdings, limits]);

  // Holdings manipulation
  const handleUpdateHolding = (idx: number, updated: Partial<Holding>) => {
    setHoldings(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], ...updated };
      return next;
    });
  };

  const handleRemoveHolding = (idx: number) => {
    setHoldings(prev => prev.filter((_, i) => i !== idx));
  };

  const handleAddHolding = (newHolding: Holding) => {
    setHoldings(prev => {
      const existingIdx = prev.findIndex(h => h.sym === newHolding.sym);
      if (existingIdx !== -1) {
        const curr = prev[existingIdx];
        const totalQty = curr.qty + newHolding.qty;
        const totalCost = (curr.qty * curr.cost + newHolding.qty * newHolding.cost) / totalQty;
        const next = [...prev];
        next[existingIdx] = {
          ...curr,
          qty: totalQty,
          cost: Math.round(totalCost * 100) / 100,
          ltp: newHolding.ltp
        };
        return next;
      }
      return [...prev, newHolding];
    });
  };

  const handleImportHoldings = (newHoldings: Holding[]) => {
    setHoldings(newHoldings);
  };

  const handleUpdateLimit = (key: keyof RiskLimits, val: number) => {
    setLimits(prev => ({ ...prev, [key]: val }));
  };

  const handleExecuteOrder = (order: TradeOrder) => {
    setOrders(prev => [order, ...prev]);

    if (order.action === 'BUY') {
      setCashBalance(prev => Math.max(0, prev - order.totalCost));
      handleAddHolding({
        sym: order.sym,
        qty: order.qty,
        cost: order.executedPrice || order.price,
        ltp: order.executedPrice || order.price,
        name: UNIVERSE_MAP[order.sym]?.name || order.sym,
        sector: UNIVERSE_MAP[order.sym]?.sector || 'Others'
      });
    } else {
      setCashBalance(prev => prev + order.totalCost);
      setHoldings(prev => {
        const next = [...prev];
        const idx = next.findIndex(h => h.sym === order.sym);
        if (idx !== -1) {
          const remQty = next[idx].qty - order.qty;
          if (remQty <= 0) {
            return next.filter((_, i) => i !== idx);
          } else {
            next[idx] = { ...next[idx], qty: remQty };
          }
        }
        return next;
      });
    }
  };

  const handleResetCash = () => {
    setCashBalance(1000000);
    setOrders([]);
  };

  const handleDownloadIndexFile = () => {
    const a = document.createElement('a');
    a.href = '/kawach-index.html';
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const allStocks = marketFeed.getAllStocks();

  return (
    <div className="min-h-screen bg-[#F2F4F8] dark:bg-[#0A111E] text-[#101B2D] dark:text-[#E8ECF3] transition-colors">
      <OfflineIndicator />

      {/* Top Experience Switcher: Website vs Mobile Webapp vs Desktop Console */}
      <div className="bg-[#0B1424] text-white py-1.5 px-4 border-b border-[#162338] sticky top-0 z-50 flex items-center justify-between text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium hidden sm:inline text-[11px]">Select Platform:</span>
          <div className="flex bg-[#142137] p-0.5 rounded-lg border border-[#233550]">
            <button
              onClick={() => setPlatformMode('website')}
              className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                platformMode === 'website'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Website</span>
            </button>

            <button
              onClick={() => setPlatformMode('mobile')}
              className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                platformMode === 'mobile'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Webapp</span>
            </button>

            <button
              onClick={() => setPlatformMode('terminal')}
              className={`px-3 py-1 rounded-md font-semibold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer ${
                platformMode === 'terminal'
                  ? 'bg-[#B4213A] text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Console</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadIndexFile}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-semibold text-[11px] shadow-sm cursor-pointer transition-all active:scale-95"
            title="Download standalone single-file index.html"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download index.html</span>
            <span className="sm:hidden">Download</span>
          </button>
          <PWAInstallButton className="hidden sm:flex text-[11px] py-1 px-2.5" />
        </div>
      </div>

      {/* FEATURE 1: ATH CAPITAL PUBLIC MARKETING WEBSITE */}
      {platformMode === 'website' && (
        <WebsiteFeature
          marketState={marketState}
          analysis={analysis}
          onLaunchConsole={tab => {
            if (tab) setCurrentView(tab as ViewKey);
            setPlatformMode('terminal');
          }}
          onLaunchMobileWebApp={() => setPlatformMode('mobile')}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
        />
      )}

      {/* FEATURE 2: NATIVE MOBILE WEBAPP (PWA TOUCH EXPERIENCE) */}
      {platformMode === 'mobile' && (
        <div className="py-2 sm:py-6 bg-slate-100 dark:bg-black/40 min-h-[calc(100vh-38px)]">
          <MobileWebAppFeature
            marketState={marketState}
            analysis={analysis}
            holdings={holdings}
            allStocks={allStocks}
            orders={orders}
            cashBalance={cashBalance}
            onOpenTradeModal={(stock, action) => {
              // Open console with trading modal
              setCurrentView('trading');
              setPlatformMode('terminal');
            }}
            onSelectStockModal={stock => {
              setCurrentView('trading');
              setPlatformMode('terminal');
            }}
            onNavigateToConsole={tab => {
              setCurrentView(tab as ViewKey);
              setPlatformMode('terminal');
            }}
            onReturnToWebsite={() => setPlatformMode('website')}
          />
        </div>
      )}

      {/* FEATURE 3: FULL KAWACH INSTITUTIONAL TERMINAL CONSOLE */}
      {platformMode === 'terminal' && (
        <TerminalConsoleFeature
          currentView={currentView}
          onSelectView={setCurrentView}
          marketState={marketState}
          analysis={analysis}
          holdings={holdings}
          limits={limits}
          taxRate={taxRate}
          cashBalance={cashBalance}
          orders={orders}
          profile={profile}
          allStocks={allStocks}
          simSpeed={simSpeed}
          isSimActive={isSimActive}
          isDark={isDark}
          onToggleTheme={() => setIsDark(d => !d)}
          onSetSimSpeed={spd => {
            setSimSpeed(spd);
            marketFeed.setSimSpeed(spd);
          }}
          onToggleSim={() => {
            setIsSimActive(a => !a);
            marketFeed.toggleSimulation();
          }}
          onUpdateHolding={handleUpdateHolding}
          onRemoveHolding={handleRemoveHolding}
          onAddHolding={handleAddHolding}
          onImportHoldings={handleImportHoldings}
          onSetTaxRate={setTaxRate}
          onUpdateLimit={handleUpdateLimit}
          onExecuteOrder={handleExecuteOrder}
          onResetCash={handleResetCash}
          onUpdateProfile={u => setProfile(p => ({ ...p, ...u }))}
          onReturnToWebsite={() => setPlatformMode('website')}
        />
      )}
    </div>
  );
}
