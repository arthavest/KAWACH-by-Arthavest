import React, { useState } from 'react';
import {
  UniverseStock,
  TradeOrder,
  OrderAction
} from '../../types';
import { MarketFeedService } from '../../services/marketFeed';
import { npr, nprF, sg, cls } from '../../utils/format';
import {
  Search,
  ShoppingCart,
  TrendingUp,
  History,
  RotateCcw,
  CheckCircle2,
  Clock,
  ArrowRight,
  Filter
} from 'lucide-react';

interface TradingViewProps {
  allStocks: UniverseStock[];
  orders: TradeOrder[];
  cashBalance: number;
  onResetCash: () => void;
  onOpenTradeModal: (stock: UniverseStock, action: OrderAction) => void;
  onSelectStockModal: (stock: UniverseStock) => void;
}

export const TradingView: React.FC<TradingViewProps> = ({
  allStocks,
  orders,
  cashBalance,
  onResetCash,
  onOpenTradeModal,
  onSelectStockModal
}) => {
  const [search, setSearch] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [activeTab, setActiveTab] = useState<'WATCHLIST' | 'TRADES'>('WATCHLIST');

  const filteredStocks = allStocks.filter(s => {
    const matchSearch =
      s.sym.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchSector = selectedSector === 'ALL' || s.sector === selectedSector;
    return matchSearch && matchSector;
  });

  const sectors = ['ALL', ...Array.from(new Set(allStocks.map(s => s.sector)))];

  const totalTradedTurnover = orders.reduce((sum, o) => sum + o.turnover, 0);
  const totalCommissionPaid = orders.reduce((sum, o) => sum + o.commission, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Paper Funds Bar */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Paper Trading Cash Available
            </div>
            <div className="font-serif text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              {nprF(cashBalance)}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Total Trades Placed</div>
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              {orders.length} orders ({npr(totalTradedTurnover)})
            </div>
          </div>

          <div className="text-right hidden sm:block">
            <div className="text-xs text-slate-400">Brokerage Paid</div>
            <div className="font-mono font-bold text-slate-800 dark:text-slate-200 text-sm">
              Rs {totalCommissionPaid.toFixed(2)}
            </div>
          </div>

          <button
            onClick={onResetCash}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Reset cash to Rs 10 Lakh"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Funds (Rs 10L)</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('WATCHLIST')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'WATCHLIST'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>NEPSE Market Watch ({allStocks.length})</span>
          {activeTab === 'WATCHLIST' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B4213A]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('TRADES')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'TRADES'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>Executed Trades & Orders ({orders.length})</span>
          {activeTab === 'TRADES' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B4213A]" />
          )}
        </button>
      </div>

      {activeTab === 'WATCHLIST' && (
        <div className="space-y-4">
          {/* Search & Sector Filters */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search symbol or company name (e.g. NABIL, UPPER)..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <Filter className="w-3.5 h-3.5 text-slate-400 flex-none ml-1" />
              {sectors.map(sec => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedSector === sec
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Scrip Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredStocks.map(s => (
              <div
                key={s.sym}
                className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <button
                        onClick={() => onSelectStockModal(s)}
                        className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 hover:text-blue-600 flex items-center gap-1.5"
                      >
                        <span>{s.sym}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-mono font-normal">
                          {s.sector}
                        </span>
                      </button>
                      <div className="text-[11px] text-slate-400 truncate max-w-[200px]">
                        {s.name}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                        {nprF(s.price)}
                      </div>
                      <div className={`text-xs font-semibold ${cls(s.pChange)}`}>
                        {sg(s.pChange / 100, 2)}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/60 text-[10px] text-slate-400">
                    <div>
                      <span>Vol:</span>{' '}
                      <b className="text-slate-700 dark:text-slate-300 font-mono">
                        {(s.volume / 1000).toFixed(0)}k
                      </b>
                    </div>
                    <div>
                      <span>P/E:</span>{' '}
                      <b className="text-slate-700 dark:text-slate-300 font-mono">
                        {s.pe.toFixed(1)}
                      </b>
                    </div>
                    <div className="text-right">
                      <span>Beta:</span>{' '}
                      <b className="text-slate-700 dark:text-slate-300 font-mono">
                        {s.beta.toFixed(2)}
                      </b>
                    </div>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onOpenTradeModal(s, 'BUY')}
                    className="flex-1 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    BUY
                  </button>
                  <button
                    onClick={() => onOpenTradeModal(s, 'SELL')}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    SELL
                  </button>
                  <button
                    onClick={() => onSelectStockModal(s)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                    title="View Chart & Depth"
                  >
                    Depth
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'TRADES' && (
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Order ID & Time</th>
                  <th className="py-3 px-3">Scrip</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Side</th>
                  <th className="py-3 px-3 text-right">Qty</th>
                  <th className="py-3 px-3 text-right">Price</th>
                  <th className="py-3 px-3 text-right">Gross Turnover</th>
                  <th className="py-3 px-3 text-right">Commission</th>
                  <th className="py-3 px-3 text-right">Net Value</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-400">
                      No trades executed yet. Pick any stock from the watchlist to trade.
                    </td>
                  </tr>
                ) : (
                  orders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="font-mono font-medium text-slate-800 dark:text-slate-200">
                          {o.id}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(o.timestamp).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 dark:text-slate-100">
                        {o.sym}
                      </td>
                      <td className="py-3 px-3 text-[11px] text-slate-500 font-mono">
                        {o.type}
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            o.action === 'BUY'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {o.action}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                        {o.qty.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {nprF(o.executedPrice || o.price)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                        {nprF(o.turnover)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        Rs {o.commission.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 dark:text-slate-100">
                        {nprF(o.totalCost)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Executed</span>
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
