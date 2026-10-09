import React, { useState } from 'react';
import { AnalysisResult, RiskLimits } from '../../types';
import { rho } from '../../services/riskEngine';
import { npr, nprF, pc } from '../../utils/format';
import { AlertTriangle, ShieldCheck, Activity, BarChart, Info } from 'lucide-react';

interface RiskViewProps {
  analysis: AnalysisResult;
  limits: RiskLimits;
  onUpdateLimit: (key: keyof RiskLimits, val: number) => void;
}

export const RiskView: React.FC<RiskViewProps> = ({ analysis: a, limits, onUpdateLimit }) => {
  const [horizon, setHorizon] = useState<'1D' | '5D' | '21D' | '1Y'>('1D');
  const [confidence, setConfidence] = useState<'90' | '95' | '99'>('95');
  const [heatMode, setHeatMode] = useState<'STOCK' | 'SECTOR'>('STOCK');

  if (a.empty) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        Portfolio is empty. Add holdings to see Aladdin risk models and correlation matrices.
      </div>
    );
  }

  // Calculate dynamic VaR and CVaR for selected horizon and confidence
  const daysMultiplier =
    horizon === '1D' ? 1 : horizon === '5D' ? Math.sqrt(5) : horizon === '21D' ? Math.sqrt(21) : Math.sqrt(240);
  const zScore = confidence === '90' ? 1.28155 : confidence === '95' ? 1.64485 : 2.32635;
  const cvarMultiplier = confidence === '90' ? 1.755 : confidence === '95' ? 2.0627 : 2.6652;

  const dailyVol = a.volA / Math.sqrt(240);
  const selectedVaR = zScore * dailyVol * daysMultiplier * a.V;
  const selectedCVaR = cvarMultiplier * dailyVol * daysMultiplier * a.V;

  // Correlation matrix data
  const order = [...a.H].sort((x, y) => x.sector.localeCompare(y.sector) || y.w - x.w);
  const sectors = Array.from(new Set(a.H.map(h => h.sector)));

  // Monte Carlo histogram SVG
  const mc = a.mc;
  const mcBins = mc?.bins || [];
  const maxBinCount = Math.max(...mcBins.map(b => b.count), 1);
  const svgW = 500;
  const svgH = 160;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Aladdin Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Portfolio Annualized Volatility</span>
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div className="font-serif text-3xl font-bold text-slate-900 dark:text-slate-100">
            {pc(a.volA, 1)}
          </div>
          <p className="text-[11px] text-slate-400">
            Daily sigma: {pc(dailyVol, 2)}. Target NEPSE volatility band is 24% - 28%.
          </p>
        </div>

        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Diversification Benefit</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-600 dark:text-emerald-400">
            {npr(a.divBenefit)}
          </div>
          <p className="text-[11px] text-slate-400">
            Amount saved by holding imperfectly correlated assets vs a single position.
          </p>
        </div>

        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Expected Shortfall (CVaR)</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="font-serif text-3xl font-bold text-rose-600 dark:text-rose-400">
            {npr(selectedCVaR)}
          </div>
          <p className="text-[11px] text-slate-400">
            Average conditional loss in tail events beyond the {confidence}% VaR cut.
          </p>
        </div>
      </div>

      {/* Limits & Value at Risk Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Regulatory & Custom Limits */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              Regulatory & Risk Limits
            </h3>
            <p className="text-xs text-slate-500">
              Audit against SEBON guidelines and institutional risk policies
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Single Stock Maximum Weight
                </span>
                <span className="text-[11px] text-slate-400">
                  Current maximum: {pc(a.maxStockWeight, 1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="50"
                  value={((limits.stock) * 100).toFixed(0)}
                  onChange={e => onUpdateLimit('stock', (parseFloat(e.target.value) || 12) / 100)}
                  className="w-16 text-right py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    a.maxStockWeight > limits.stock
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}
                >
                  {a.maxStockWeight > limits.stock ? 'BREACHED' : 'COMPLIANT'}
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Single Sector Maximum Weight
                </span>
                <span className="text-[11px] text-slate-400">
                  Current maximum: {pc(a.maxSectorWeight, 1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="60"
                  value={((limits.sector) * 100).toFixed(0)}
                  onChange={e => onUpdateLimit('sector', (parseFloat(e.target.value) || 35) / 100)}
                  className="w-16 text-right py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    a.maxSectorWeight > limits.sector
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}
                >
                  {a.maxSectorWeight > limits.sector ? 'BREACHED' : 'COMPLIANT'}
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Top-3 Concentration Ceiling
                </span>
                <span className="text-[11px] text-slate-400">
                  Current top-3: {pc(a.top3Weight, 1)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.5"
                  min="10"
                  max="80"
                  value={((limits.top3) * 100).toFixed(0)}
                  onChange={e => onUpdateLimit('top3', (parseFloat(e.target.value) || 45) / 100)}
                  className="w-16 text-right py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    a.top3Weight > limits.top3
                      ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}
                >
                  {a.top3Weight > limits.top3 ? 'WARNING' : 'COMPLIANT'}
                </span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">
                  Daily 95% VaR Threshold
                </span>
                <span className="text-[11px] text-slate-400">
                  Current 1-day: {pc(a.var95 / a.V, 2)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.5"
                  max="10"
                  value={((limits.var) * 100).toFixed(1)}
                  onChange={e => onUpdateLimit('var', (parseFloat(e.target.value) || 3) / 100)}
                  className="w-16 text-right py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono font-bold"
                />
                <span className="text-slate-500">%</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                    a.var95 / a.V > limits.var
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400'
                  }`}
                >
                  {a.var95 / a.V > limits.var ? 'EXCEEDED' : 'INSIDE'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Horizon Value at Risk Simulator */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Parametric VaR & CVaR Explorer
              </h3>
              <p className="text-xs text-slate-500">
                Tail risk calculated from covariance matrix
              </p>
            </div>

            {/* Horizon & Confidence switches */}
            <div className="flex gap-2">
              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                {(['1D', '5D', '21D', '1Y'] as const).map(h => (
                  <button
                    key={h}
                    onClick={() => setHorizon(h)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      horizon === h
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {h}
                  </button>
                ))}
              </div>

              <div className="flex bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs font-semibold">
                {(['90', '95', '99'] as const).map(c => (
                  <button
                    key={c}
                    onClick={() => setConfidence(c)}
                    className={`px-2 py-1 rounded-md transition-all ${
                      confidence === c
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                    }`}
                  >
                    {c}%
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800/80 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">
                Value at Risk ({horizon}, {confidence}% Conf.)
              </span>
              <span className="font-serif font-bold text-2xl text-slate-900 dark:text-slate-100">
                {npr(selectedVaR)}
              </span>
            </div>
            <div className="flex justify-between items-baseline">
              <span className="text-xs text-slate-500">
                Expected Shortfall (CVaR Tail Average)
              </span>
              <span className="font-serif font-bold text-xl text-rose-600 dark:text-rose-400">
                {npr(selectedCVaR)}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
              <span>Potential Loss as % of Capital</span>
              <span className="font-mono font-bold text-slate-700 dark:text-slate-300">
                {pc(selectedVaR / a.V, 2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Monte Carlo 2000-run Simulation Distribution Histogram */}
      {mc && mcBins.length > 0 && (
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex justify-between items-baseline">
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                21-Day Monte Carlo Simulated Return Distribution (2,000 Paths)
              </h3>
              <p className="text-xs text-slate-500">
                Cholesky-correlated multi-asset simulation based on empirical NEPSE sector covariance
              </p>
            </div>
            <div className="text-right text-xs">
              <span className="text-rose-500 font-bold">5% Worst Case: {npr(mc.q05)}</span> |{' '}
              <span className="text-slate-400">Median: {npr(mc.q50)}</span> |{' '}
              <span className="text-emerald-500 font-bold">95% Best Case: {npr(mc.q95)}</span>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-[#0B1320] p-4 rounded-xl border border-slate-200 dark:border-slate-800">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-36">
              {mcBins.map((b, i) => {
                const barW = svgW / mcBins.length - 2;
                const barH = (b.count / maxBinCount) * (svgH - 24);
                const x = i * (svgW / mcBins.length);
                const y = svgH - barH - 16;
                const isLoss = b.x < 0;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={barW}
                    height={barH}
                    rx="2"
                    fill={isLoss ? '#F43F5E' : '#10B981'}
                    opacity={b.x <= mc.q05 ? '0.95' : '0.45'}
                  />
                );
              })}
              {/* Zero line */}
              <line x1="0" y1={svgH - 16} x2={svgW} y2={svgH - 16} stroke="#64748B" strokeWidth="1" />
            </svg>
            <div className="flex justify-between text-[10px] text-slate-400 px-1 mt-1">
              <span>Worst Simulated Drawdown: {npr(mc.samples[0] || 0)}</span>
              <span>Distribution Center: {npr(mc.q50)}</span>
              <span>Best Simulated Upside: {npr(mc.samples[mc.samples.length - 1] || 0)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Correlation Matrix Heatmap */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              Cross-Asset Correlation Heatmap
            </h3>
            <p className="text-xs text-slate-500">
              Pairwise correlation coefficient $\rho$ based on NEPSE historical co-movements
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setHeatMode('STOCK')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                heatMode === 'STOCK'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              Scrip Level
            </button>
            <button
              onClick={() => setHeatMode('SECTOR')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                heatMode === 'SECTOR'
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              Sector Level
            </button>
          </div>
        </div>

        {heatMode === 'STOCK' && (
          <div className="overflow-x-auto">
            <div
              className="grid gap-1 text-[11px] font-mono min-w-[500px]"
              style={{
                gridTemplateColumns: `60px repeat(${order.length}, minmax(36px, 1fr))`
              }}
            >
              <div />
              {order.map(h => (
                <div key={h.sym} className="font-bold text-center text-slate-500 truncate">
                  {h.sym}
                </div>
              ))}

              {order.map(r => (
                <React.Fragment key={r.sym}>
                  <div className="font-bold flex items-center text-slate-700 dark:text-slate-300">
                    {r.sym}
                  </div>
                  {order.map(c => {
                    const p = rho(r, c);
                    return (
                      <div
                        key={r.sym + '-' + c.sym}
                        className="h-8 rounded flex items-center justify-center font-bold text-[10px]"
                        style={{
                          backgroundColor:
                            p === 1.0
                              ? '#3B82F6'
                              : p >= 0.7
                              ? 'rgba(59, 130, 246, 0.7)'
                              : p >= 0.5
                              ? 'rgba(59, 130, 246, 0.35)'
                              : 'rgba(59, 130, 246, 0.15)',
                          color: p >= 0.65 ? '#ffffff' : 'inherit'
                        }}
                      >
                        {p.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {heatMode === 'SECTOR' && (
          <div className="overflow-x-auto">
            <div
              className="grid gap-1 text-[11px] font-mono min-w-[500px]"
              style={{
                gridTemplateColumns: `140px repeat(${sectors.length}, minmax(60px, 1fr))`
              }}
            >
              <div />
              {sectors.map(s => (
                <div key={s} className="font-bold text-center text-slate-500 truncate text-[10px]">
                  {s.slice(0, 10)}
                </div>
              ))}

              {sectors.map(r => (
                <React.Fragment key={r}>
                  <div className="font-bold flex items-center text-slate-700 dark:text-slate-300 truncate text-[10px]">
                    {r}
                  </div>
                  {sectors.map(c => {
                    const p = rho({ sym: 'A', sector: r }, { sym: 'B', sector: c });
                    return (
                      <div
                        key={r + '-' + c}
                        className="h-8 rounded flex items-center justify-center font-bold text-[10px]"
                        style={{
                          backgroundColor:
                            r === c
                              ? '#3B82F6'
                              : p >= 0.6
                              ? 'rgba(59, 130, 246, 0.5)'
                              : 'rgba(59, 130, 246, 0.2)',
                          color: r === c || p >= 0.6 ? '#ffffff' : 'inherit'
                        }}
                      >
                        {p.toFixed(2)}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
