import React from 'react';
import { MarketState } from '../types';
import { npr, sg, cls } from '../utils/format';

interface MarketTapeProps {
  title: string;
  subtitle: string;
  marketState: MarketState;
}

export const MarketTape: React.FC<MarketTapeProps> = ({ title, subtitle, marketState }) => {
  return (
    <header className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
      <div>
        <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight text-slate-900 dark:text-slate-100">
          {title}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl font-sans">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Market Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-700/60 shadow-xs text-xs">
          <span
            className={`w-2 h-2 rounded-full ${
              marketState.isOpen ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'
            }`}
          />
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {marketState.session}
          </span>
        </div>

        {/* Live NEPSE Index */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-700/60 px-3.5 py-1.5 rounded-xl shadow-xs flex items-center gap-3">
          <div>
            <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              NEPSE
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                {marketState.index.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className={`text-xs font-semibold ${cls(marketState.pct)}`}>
                {sg(marketState.pct, 2)} ({marketState.change >= 0 ? '+' : ''}
                {marketState.change.toFixed(2)})
              </span>
            </div>
          </div>

          <div className="hidden sm:block border-l border-slate-200 dark:border-slate-700/60 pl-3">
            <div className="text-[10px] text-slate-400">Turnover</div>
            <div className="text-xs font-medium text-slate-800 dark:text-slate-200">
              {npr(marketState.turnover)}
            </div>
          </div>

          <div className="hidden lg:block border-l border-slate-200 dark:border-slate-700/60 pl-3 text-[11px] text-slate-500">
            <span className="text-emerald-500 font-semibold">{marketState.advances}↑</span>{' '}
            <span className="text-rose-500 font-semibold">{marketState.declines}↓</span>{' '}
            <span className="text-slate-400">{marketState.unchanged}=</span>
          </div>
        </div>
      </div>
    </header>
  );
};
