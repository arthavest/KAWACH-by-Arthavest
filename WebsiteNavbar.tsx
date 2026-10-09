import React from 'react';
import { ArrowRight, Terminal, Sun, Moon, Shield, ExternalLink } from 'lucide-react';
import { MarketState } from '../../types';
import { npr, sg, cls } from '../../utils/format';

interface WebsiteNavbarProps {
  onOpenApp: (tab?: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  activeSection: string;
  onSelectSection: (section: string) => void;
  marketState: MarketState;
}

export const WebsiteNavbar: React.FC<WebsiteNavbarProps> = ({
  onOpenApp,
  isDark,
  onToggleTheme,
  activeSection,
  onSelectSection,
  marketState
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0B1424]/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Live Market Mini-Ticker Bar */}
      <div className="bg-[#070D18] text-slate-300 py-1.5 px-4 text-[11px] border-b border-[#142137]">
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

          <div className="flex items-center gap-4">
            <span className="hidden md:inline text-slate-400 text-[10px]">
              T+2 Rolling Settlement • Regulated by SEBON
            </span>
            <button
              onClick={() => onOpenApp('trading')}
              className="text-[10px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
            >
              <span>Live Order Book</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div
          onClick={() => onSelectSection('hero')}
          className="flex items-center gap-3 cursor-pointer select-none"
        >
          <svg className="w-8 h-10 flex-none" viewBox="0 0 200 240" aria-hidden="true">
            <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#B4213A" />
            <path
              d="M100 46 L100 196 M100 46 L152 68 V112 C152 150 128 178 100 192"
              fill="none"
              stroke="#fff"
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity=".92"
            />
          </svg>
          <div>
            <div className="font-serif font-bold text-xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>ATH CAPITAL</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-sans font-normal border border-slate-200 dark:border-slate-700">
                NEPAL
              </span>
            </div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-sans -mt-0.5">
              ARTHAVEST INVESTMENT • KAWACH
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <button
            onClick={() => onSelectSection('hero')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeSection === 'hero' ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectSection('products')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeSection === 'products' ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            Funds & ETFs
          </button>
          <button
            onClick={() => onSelectSection('aladdin')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeSection === 'aladdin' ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            KAWACH by Arthavest
          </button>
          <button
            onClick={() => onSelectSection('transparency')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeSection === 'transparency' ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            Cost Transparency
          </button>
          <button
            onClick={() => onSelectSection('about')}
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
              activeSection === 'about' ? 'text-slate-900 dark:text-white font-bold' : ''
            }`}
          >
            About Us
          </button>
        </nav>

        {/* CTA & Theme toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          <button
            onClick={() => onOpenApp('overview')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0B1424] dark:bg-white text-white dark:text-slate-900 font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Terminal className="w-3.5 h-3.5 text-rose-500" />
            <span>Launch KAWACH Console</span>
          </button>
        </div>
      </div>
    </header>
  );
};
