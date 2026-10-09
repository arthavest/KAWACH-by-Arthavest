import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, Shield, BarChart3, ShoppingCart } from 'lucide-react';
import { UniverseStock } from '../types';
import { MarketFeedService } from '../services/marketFeed';
import { generateStockSeries, calculateEma } from '../services/screenerEngine';
import { npr, nprF, sg, cls } from '../utils/format';

interface StockDetailModalProps {
  stock: UniverseStock | null;
  onClose: () => void;
  onTrade: (stock: UniverseStock, action: 'BUY' | 'SELL') => void;
}

export const StockDetailModal: React.FC<StockDetailModalProps> = ({ stock, onClose, onTrade }) => {
  if (!stock) return null;

  const [timeframe, setTimeframe] = useState<'1M' | '3M' | '1Y'>('3M');
  const marketFeed = MarketFeedService.getInstance();
  const depth = marketFeed.getMarketDepth(stock.sym);

  const days = timeframe === '1M' ? 30 : timeframe === '3M' ? 90 : 260;
  const series = generateStockSeries(stock.sym, days);
  const ema = calculateEma(series, Math.min(days, 200));

  // Build SVG chart coordinates
  const minPrice = Math.min(...series) * 0.96;
  const maxPrice = Math.max(...series) * 1.04;
  const range = maxPrice - minPrice || 1;
  const width = 500;
  const height = 180;

  const points = series
    .map((p, i) => {
      const x = (i / (series.length - 1)) * width;
      const y = height - ((p - minPrice) / range) * height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');

  const isUp = series[series.length - 1] >= series[0];
  const chartColor = isUp ? '#10B981' : '#F43F5E';

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1726]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
              {stock.sym.slice(0, 3)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100">
                  {stock.sym}
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
                  {stock.sector}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{stock.name}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
                {nprF(stock.price)}
              </div>
              <div className={`text-xs font-semibold ${cls(stock.pChange)}`}>
                {sg(stock.pChange / 100, 2)} ({stock.change >= 0 ? '+' : ''}
                {stock.change.toFixed(2)})
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Chart header & SVG */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-slate-400" />
                Price Action & 200 EMA
              </div>
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
                {(['1M', '3M', '1Y'] as const).map(tf => (
                  <button
                    key={tf}
                    onClick={() => setTimeframe(tf)}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                      timeframe === tf
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-[#0B1320] border border-slate-200 dark:border-slate-800/80 rounded-xl p-3">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-44 overflow-visible">
                <defs>
                  <linearGradient id={`grad-${stock.sym}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={chartColor} stopOpacity="0.25" />
                    <stop offset="100%" stopColor={chartColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                {/* Horizontal reference lines */}
                {[0.25, 0.5, 0.75].map((ratio, i) => (
                  <line
                    key={i}
                    x1="0"
                    y1={height * ratio}
                    x2={width}
                    y2={height * ratio}
                    stroke="currentColor"
                    strokeDasharray="4 4"
                    className="text-slate-200 dark:text-slate-800"
                  />
                ))}
                {/* Area under curve */}
                <polygon
                  points={`0,${height} ${points} ${width},${height}`}
                  fill={`url(#grad-${stock.sym})`}
                />
                {/* Main price line */}
                <polyline fill="none" stroke={chartColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points={points} />
              </svg>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>{days} sessions ago</span>
                <span>Latest session: {nprF(stock.price)}</span>
              </div>
            </div>
          </div>

          {/* Fundamentals Grid */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Financial Ratios & Metrics
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">P/E Ratio</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  {stock.pe.toFixed(1)}x
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">P/B Ratio</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  {stock.pb.toFixed(2)}x
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">EPS (TTM)</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  Rs {stock.eps.toFixed(1)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">Dividend Yield</div>
                <div className="font-serif font-bold text-base mt-0.5 text-emerald-600 dark:text-emerald-400">
                  {stock.divYield.toFixed(1)}%
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">52-Week Range</div>
                <div className="font-medium text-xs mt-0.5 text-slate-800 dark:text-slate-200">
                  Rs {stock.low52} - {stock.high52}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">Market Beta</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  {stock.beta.toFixed(2)}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">200-day EMA</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  Rs {stock.ema200}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800">
                <div className="text-slate-400">Market Cap</div>
                <div className="font-serif font-bold text-base mt-0.5 text-slate-900 dark:text-slate-100">
                  Rs {stock.marketCap} Cr
                </div>
              </div>
            </div>
          </div>

          {/* 5-Depth Market Depth */}
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
              Market Depth (5-Level Bids & Asks)
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              {/* Bids */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1.5 flex justify-between">
                  <span>BUY BIDS</span>
                  <span>QTY</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {depth.bids.map((b, i) => (
                    <div key={i} className="px-3 py-1.5 flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                        Rs {b.price.toFixed(1)}
                      </span>
                      <span>{b.qty.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asks */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-rose-50 dark:bg-rose-950/30 text-rose-700 dark:text-rose-400 font-bold px-3 py-1.5 flex justify-between">
                  <span>SELL ASKS</span>
                  <span>QTY</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {depth.asks.map((a, i) => (
                    <div key={i} className="px-3 py-1.5 flex justify-between text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-rose-600 dark:text-rose-400">
                        Rs {a.price.toFixed(1)}
                      </span>
                      <span>{a.qty.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#0E1726] flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Turnover: <span className="font-medium text-slate-800 dark:text-slate-200">{npr(stock.turnover)}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                onClose();
                onTrade(stock, 'BUY');
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <ShoppingCart className="w-4 h-4" />
              BUY {stock.sym}
            </button>
            <button
              onClick={() => {
                onClose();
                onTrade(stock, 'SELL');
              }}
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              SELL {stock.sym}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
