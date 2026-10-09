import React, { useState } from 'react';
import { ScreenerSignal, ConfluenceEvaluation, UniverseStock } from '../../types';
import { UNIVERSE_STOCKS } from '../../data/nepseData';
import { getScreenerSignals, evaluateConfluence } from '../../services/screenerEngine';
import { nprF, sg, cls } from '../../utils/format';
import { Search, Compass, CheckCircle2, AlertTriangle, ArrowRight, TrendingUp, BarChart2 } from 'lucide-react';

interface TechnicalScreenerViewProps {
  onSelectStockModal: (stock: UniverseStock) => void;
  onTradeStock: (stock: UniverseStock) => void;
}

export const TechnicalScreenerView: React.FC<TechnicalScreenerViewProps> = ({
  onSelectStockModal,
  onTradeStock
}) => {
  const [activeTab, setActiveTab] = useState<'EMA' | 'CONFLUENCE'>('EMA');

  // Screener signals
  const signals = getScreenerSignals();

  // Confluence Form State
  const [cfSymbol, setCfSymbol] = useState('NABIL');
  const [cfCmp, setCfCmp] = useState('520');
  const [cfEma20, setCfEma20] = useState('512');
  const [cfEma50, setCfEma50] = useState('498');
  const [cfMarketTrend, setCfMarketTrend] = useState<'Bullish' | 'Neutral' | 'Bearish'>('Bullish');
  const [cfSectorTrend, setCfSectorTrend] = useState<'Bullish' | 'Neutral' | 'Bearish'>('Bullish');
  const [cfStructure, setCfStructure] = useState<'higher_highs' | 'consolidation' | 'lower_lows'>('higher_highs');
  const [cfRsi, setCfRsi] = useState('58');
  const [cfMacd, setCfMacd] = useState<'bull' | 'neutral' | 'bear'>('bull');
  const [cfVolRatio, setCfVolRatio] = useState('1.8');
  const [cfBroker, setCfBroker] = useState(true);
  const [cfSupport, setCfSupport] = useState(true);
  const [cfSupportLevel, setCfSupportLevel] = useState('495');
  const [cfResistanceLevel, setCfResistanceLevel] = useState('590');
  const [evaluation, setEvaluation] = useState<ConfluenceEvaluation | null>(null);

  const handleEvaluate = (e: React.FormEvent) => {
    e.preventDefault();
    const cmp = parseFloat(cfCmp);
    if (!cmp) return;

    const res = evaluateConfluence({
      symbol: cfSymbol.toUpperCase(),
      cmp,
      ema20: parseFloat(cfEma20) || undefined,
      ema50: parseFloat(cfEma50) || undefined,
      marketTrend: cfMarketTrend,
      sectorTrend: cfSectorTrend,
      marketStructure: cfStructure,
      rsi: parseFloat(cfRsi) || 50,
      macdCross: cfMacd,
      volumeRatio: parseFloat(cfVolRatio) || 1.0,
      brokerAccumulation: cfBroker,
      nearSupport: cfSupport,
      supportLevel: parseFloat(cfSupportLevel) || undefined,
      resistanceLevel: parseFloat(cfResistanceLevel) || undefined
    });
    setEvaluation(res);
  };

  const handleSelectSymbol = (sym: string) => {
    setCfSymbol(sym);
    const stock = UNIVERSE_STOCKS.find(s => s.sym === sym);
    if (stock) {
      setCfCmp(stock.price.toString());
      setCfEma20(Math.round(stock.price * 0.98).toString());
      setCfEma50(Math.round(stock.price * 0.96).toString());
      setCfSupportLevel(Math.round(stock.price * 0.93).toString());
      setCfResistanceLevel(Math.round(stock.price * 1.15).toString());
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('EMA')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'EMA'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>200-Day EMA Crossover Screener ({signals.length})</span>
          {activeTab === 'EMA' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B4213A]" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('CONFLUENCE')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative ${
            activeTab === 'CONFLUENCE'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <span>Confluence Signal Checker</span>
          {activeTab === 'CONFLUENCE' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#B4213A]" />
          )}
        </button>
      </div>

      {activeTab === 'EMA' && (
        <div className="space-y-6">
          <div className="bg-slate-50 dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Stocks that crossed their 200-day exponential moving average in the last 14 sessions. A crossover from below signals a long-term trend reversal into a bull cycle (Golden Cross).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {signals.map(sig => {
              const stock = UNIVERSE_STOCKS.find(s => s.sym === sig.sym);
              const isBuy = sig.type === 'buy';

              // Sparkline coordinates
              const minP = Math.min(...sig.sparkline) * 0.98;
              const maxP = Math.max(...sig.sparkline) * 1.02;
              const spRange = maxP - minP || 1;
              const pts = sig.sparkline
                .map((p, i) => {
                  const x = (i / (sig.sparkline.length - 1)) * 120;
                  const y = 36 - ((p - minP) / spRange) * 36;
                  return `${x.toFixed(1)},${y.toFixed(1)}`;
                })
                .join(' ');

              return (
                <div
                  key={sig.sym}
                  className="p-4 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                            {sig.sym}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isBuy
                                ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400'
                                : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {isBuy ? 'GOLDEN CROSS' : 'DEATH CROSS'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {sig.name} ({sig.sector})
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                          {nprF(sig.price)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          200 EMA: Rs {sig.ema}
                        </div>
                      </div>
                    </div>

                    {/* Sparkline and metrics */}
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                      <svg viewBox="0 0 120 36" className="w-28 h-8 flex-none overflow-visible">
                        <polyline
                          fill="none"
                          stroke={isBuy ? '#10B981' : '#F43F5E'}
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          points={pts}
                        />
                      </svg>
                      <div className="text-right text-[11px]">
                        <span className="text-slate-400 block">{sig.ago} sessions ago</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-300">
                          {sig.diffPct >= 0 ? '+' : ''}{sig.diffPct}% vs EMA
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {stock && (
                      <button
                        onClick={() => onTradeStock(stock)}
                        className="flex-1 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold transition-colors"
                      >
                        Trade {sig.sym}
                      </button>
                    )}
                    {stock && (
                      <button
                        onClick={() => onSelectStockModal(stock)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs"
                      >
                        Analysis
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'CONFLUENCE' && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
          {/* Confluence Input Form */}
          <form
            onSubmit={handleEvaluate}
            className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Institutional Confluence Evaluator
                </h3>
                <p className="text-slate-500">
                  Calculates multi-layer setup score (trend + structure + volume + smart money)
                </p>
              </div>
              <Compass className="w-5 h-5 text-blue-500" />
            </div>

            {/* Scrip Selection */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Scrip Symbol</label>
                <select
                  value={cfSymbol}
                  onChange={e => handleSelectSymbol(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold text-slate-900 dark:text-white uppercase"
                >
                  {UNIVERSE_STOCKS.map(s => (
                    <option key={s.sym} value={s.sym}>
                      {s.sym} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Current Price (CMP)</label>
                <input
                  type="number"
                  step="0.5"
                  value={cfCmp}
                  onChange={e => setCfCmp(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">20 EMA</label>
                <input
                  type="number"
                  step="0.5"
                  value={cfEma20}
                  onChange={e => setCfEma20(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">50 EMA</label>
                <input
                  type="number"
                  step="0.5"
                  value={cfEma50}
                  onChange={e => setCfEma50(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                />
              </div>
            </div>

            {/* Macro & Market Structure */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-slate-500 font-medium mb-1">Market Structure</label>
                <select
                  value={cfStructure}
                  onChange={e => setCfStructure(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                >
                  <option value="higher_highs">Higher Highs & Higher Lows</option>
                  <option value="consolidation">Consolidation / Range-Bound</option>
                  <option value="lower_lows">Lower Highs & Lower Lows</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">NEPSE Benchmark Trend</label>
                <select
                  value={cfMarketTrend}
                  onChange={e => setCfMarketTrend(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                >
                  <option value="Bullish">Bullish (Above 20 & 50 DMA)</option>
                  <option value="Neutral">Neutral / Sideways</option>
                  <option value="Bearish">Bearish Downtrend</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Sector Index Trend</label>
                <select
                  value={cfSectorTrend}
                  onChange={e => setCfSectorTrend(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                >
                  <option value="Bullish">Bullish Sector Tailwind</option>
                  <option value="Neutral">Neutral Sector Performance</option>
                  <option value="Bearish">Bearish Sector Lag</option>
                </select>
              </div>
            </div>

            {/* Indicators & Institutional Footprints */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-slate-500 font-medium mb-1">RSI (14-Period)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cfRsi}
                  onChange={e => setCfRsi(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">MACD Momentum</label>
                <select
                  value={cfMacd}
                  onChange={e => setCfMacd(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                >
                  <option value="bull">Bullish Crossover above 0</option>
                  <option value="neutral">Flat / Indecisive</option>
                  <option value="bear">Bearish Histogram</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">Volume vs 20D Avg</label>
                <input
                  type="number"
                  step="0.1"
                  value={cfVolRatio}
                  onChange={e => setCfVolRatio(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726]"
                />
              </div>
            </div>

            {/* Key Levels & Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfSupport}
                  onChange={e => setCfSupport(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 dark:accent-white"
                />
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-slate-200">
                    At Demand / Key Support Zone
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Price rebounding from strong horizontal or trendline support
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={cfBroker}
                  onChange={e => setCfBroker(e.target.checked)}
                  className="w-4 h-4 accent-slate-900 dark:accent-white"
                />
                <div>
                  <span className="font-semibold block text-slate-800 dark:text-slate-200">
                    Smart Money / Top-Broker Net Buy
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Floor sheet confirms accumulation from top 5 brokers
                  </span>
                </div>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md cursor-pointer"
            >
              Calculate Confluence & Generate Trade Plan
            </button>
          </form>

          {/* Evaluation Result Card */}
          <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
              Confluence Signal Result
            </h3>

            {evaluation ? (
              <div className="space-y-4">
                {/* Score & Badge */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 text-center space-y-1">
                  <div className="text-3xl font-serif font-bold text-slate-900 dark:text-slate-100">
                    {evaluation.score} / 10
                  </div>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      evaluation.action === 'STRONG BUY'
                        ? 'bg-emerald-600 text-white'
                        : evaluation.action === 'BUY'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : evaluation.action === 'NEUTRAL'
                        ? 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                        : 'bg-rose-600 text-white'
                    }`}
                  >
                    {evaluation.action}
                  </span>
                </div>

                {/* Trade Execution Plan */}
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block uppercase tracking-wider text-[10px]">
                    Trade Execution Plan ({evaluation.symbol})
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                    <div>
                      <span className="text-slate-400">Entry:</span>{' '}
                      <b>Rs {evaluation.entry}</b>
                    </div>
                    <div>
                      <span className="text-rose-500">Stop Loss:</span>{' '}
                      <b>Rs {evaluation.stopLoss}</b>
                    </div>
                    <div>
                      <span className="text-emerald-500">Target 1:</span>{' '}
                      <b>Rs {evaluation.target1}</b>
                    </div>
                    <div>
                      <span className="text-emerald-500">Target 2:</span>{' '}
                      <b>Rs {evaluation.target2}</b>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800">
                    Risk-to-Reward Ratio: <b className="text-emerald-600 font-bold">1 : {evaluation.riskReward}</b>
                  </div>
                </div>

                {/* Positive factors */}
                {evaluation.reasons.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400 block text-[11px]">
                      Confluence Catalysts ({evaluation.reasons.length}):
                    </span>
                    {evaluation.reasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-none mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warnings */}
                {evaluation.warnings.length > 0 && (
                  <div className="space-y-1.5 text-xs pt-1">
                    <span className="font-semibold text-rose-500 block text-[11px]">
                      Risk Factors ({evaluation.warnings.length}):
                    </span>
                    {evaluation.warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-rose-600 dark:text-rose-400">
                        <AlertTriangle className="w-3.5 h-3.5 flex-none mt-0.5" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-8 text-center text-xs text-slate-400">
                Click "Calculate Confluence" to run the algorithmic multi-layer filter.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
