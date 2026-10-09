import React from 'react';
import { AnalysisResult, RiskLimits } from '../../types';
import { SECTORS } from '../../data/nepseData';
import { npr, nprF, pc, sg, cls } from '../../utils/format';
import { ShieldCheck, AlertCircle, TrendingUp, Layers, ArrowUpRight } from 'lucide-react';

interface OverviewViewProps {
  analysis: AnalysisResult;
  limits: RiskLimits;
  onNavigate: (view: any) => void;
  onOpenTrade: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  analysis: a,
  limits,
  onNavigate,
  onOpenTrade
}) => {
  if (a.empty) {
    return (
      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-2xl p-8 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-slate-800 dark:text-slate-200">
          Your Portfolio is Empty
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          Add your NEPSE scrips or import from MeroShare / TMS to calculate Aladdin-grade risk scores, Value at Risk, and stress tests.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={() => onNavigate('holdings')}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs shadow-sm"
          >
            Go to Holdings & Import
          </button>
        </div>
      </div>
    );
  }

  const s = a.score;
  const col = s.total >= 75 ? '#2FA377' : s.total >= 55 ? '#D9A03A' : '#D64560';
  const pl = a.pnl;
  const plp = a.basis ? pl / a.basis : 0;

  // Sorted scrips for Risk vs Weight pair
  const sortedByRc = [...a.H].sort((x, y) => y.rc - x.rc).slice(0, 8);
  const mxr = Math.max(...sortedByRc.map(h => Math.max(h.w, h.rc))) || 0.1;

  // Sectors with active holdings or high ref weight
  const secNames = Object.keys(SECTORS);
  const activeSectors = secNames
    .filter(n => a.secMap[n] || SECTORS[n].ref > 0.05)
    .map(n => ({ n, w: a.secMap[n] || 0, r: SECTORS[n].ref }))
    .sort((x, y) => y.w - x.w);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="bg-[#0F1A2C] text-[#F2F4F8] rounded-2xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-6 md:gap-12 items-center border border-[#1C2C45] shadow-xl">
        {/* Dynamic SVG Shield */}
        <div className="flex flex-col items-center justify-center flex-none">
          <svg className="w-44 h-52 md:w-52 md:h-60 flex-none" viewBox="0 0 200 240" aria-label={`Kawach Score ${s.total}`}>
            <defs>
              <clipPath id="shClip">
                <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" />
              </clipPath>
            </defs>
            {/* Outline Background */}
            <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#142137" stroke="#253856" strokeWidth="4" />
            {/* Filled Level */}
            <g clipPath="url(#shClip)">
              <rect
                x="0"
                y={240 - (s.total / 100) * 240}
                width="200"
                height="240"
                fill={col}
                opacity="0.85"
                className="transition-all duration-1000 ease-out"
              />
            </g>
            {/* Inner Shield Overlay Lines */}
            <path
              d="M100 40 L100 200 M100 40 L156 64 V112 C156 154 130 184 100 198"
              fill="none"
              stroke="#fff"
              strokeWidth="6"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity=".45"
            />
            {/* Score Text */}
            <text x="100" y="125" textAnchor="middle" className="font-serif font-bold text-5xl fill-white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>
              {s.total}
            </text>
            <text x="100" y="148" textAnchor="middle" className="font-sans font-semibold text-[11px] fill-[#DDE4EF] tracking-wider uppercase">
              KAWACH SCORE
            </text>
          </svg>
        </div>

        {/* Hero Info */}
        <div className="space-y-4">
          <div>
            <div className="text-xs font-medium text-[#9FB0C8] uppercase tracking-wider">
              Total Portfolio Valuation
            </div>
            <div className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white mt-1">
              {nprF(a.V)}
            </div>
            <div className="flex items-center gap-2 mt-2 text-sm">
              <span className={`font-semibold ${cls(pl)}`}>
                {pl >= 0 ? '+' : '−'}
                {nprF(Math.abs(pl)).replace('−', '')} ({sg(plp, 2)})
              </span>
              <span className="text-[#9FB0C8]">unrealised gain on cost of {npr(a.basis)}</span>
            </div>
          </div>

          {/* 4 Score Parts Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#1F304B]">
            {s.parts.map(([name, val], i) => (
              <div key={i} className="text-xs space-y-1">
                <div className="flex justify-between text-[#B9C7DC]">
                  <span>{name}</span>
                  <span className="font-mono font-bold text-white">{val}/100</span>
                </div>
                <div className="h-1.5 w-full bg-[#1A2840] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${val}%`,
                      backgroundColor: val >= 70 ? '#2FA377' : val >= 45 ? '#D9A03A' : '#D64560'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#8EA2C0] leading-relaxed pt-1">
            Kawach score quantifies downside resilience across multi-sector correlations, beta exposure, and single-stock ceilings.
            {s.breachesCount > 0 ? (
              <span className="text-[#FFA4B2] font-semibold ml-1">
                ({s.breachesCount} limit {s.breachesCount > 1 ? 'breaches detected' : 'breach detected'}).
              </span>
            ) : (
              <span className="text-[#7BE4B5] font-semibold ml-1"> All SEBON & custom limits are respected.</span>
            )}
          </p>
        </div>
      </section>

      {/* KPIs Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">1-Day VaR (95%)</div>
          <div className="font-serif text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            {npr(a.var95)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {pc(a.var95 / a.V, 2)} of total capital
          </div>
        </div>

        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">1-Month 5% Worst Case</div>
          <div className="font-serif text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            {npr(Math.abs(a.mc?.q05 || 0))}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {pc(Math.abs(a.mc?.q05 || 0) / a.V, 1)} via Monte Carlo
          </div>
        </div>

        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Portfolio Beta</div>
          <div className="font-serif text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            {a.beta.toFixed(2)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {a.beta > 1 ? 'High volatility vs NEPSE' : 'Defensive vs NEPSE'}
          </div>
        </div>

        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-xl shadow-xs">
          <div className="text-xs text-slate-500 dark:text-slate-400">Effective Scrips (Eff. N)</div>
          <div className="font-serif text-2xl font-bold mt-1 text-slate-900 dark:text-slate-100">
            {a.effN.toFixed(1)} / {a.H.length}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Herfindahl diversification index
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Risk & Compliance Alerts
        </h3>
        {a.alerts.map((al, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              al.kind === 'crit'
                ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200'
                : al.kind === 'watch'
                ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/60 text-amber-800 dark:text-amber-200'
                : 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/60 text-emerald-800 dark:text-emerald-200'
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-none ${
                al.kind === 'crit' ? 'bg-rose-500' : al.kind === 'watch' ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
            />
            <div>
              <b className="block font-semibold">{al.t}</b>
              <span className="opacity-90">{al.d}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Section: Risk vs Weight & Sector Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Risk Contribution vs Weight */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                Where Your Risk Comes From
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Holding Weight (Light Blue) vs Risk Contribution (Crimson)
              </p>
            </div>
            <button
              onClick={() => onNavigate('risk')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              Full Aladdin Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {sortedByRc.map(h => (
              <div key={h.sym} className="grid grid-cols-[60px_1fr_80px] items-center gap-3 text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200">{h.sym}</span>
                <div className="space-y-1">
                  {/* Weight bar */}
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-400 dark:bg-blue-500 rounded-full"
                      style={{ width: `${(h.w / mxr) * 100}%` }}
                    />
                  </div>
                  {/* Risk contribution bar */}
                  <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-500 rounded-full"
                      style={{ width: `${(h.rc / mxr) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[11px] text-right font-mono text-slate-500">
                  {pc(h.w, 0)} / <span className="text-rose-500 font-bold">{pc(h.rc, 0)}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between text-[11px] text-slate-400">
            <span>When Risk &gt; Weight, the position amplifies volatility.</span>
            <span>Diversification Benefit: {npr(a.divBenefit)}</span>
          </div>
        </div>

        {/* Sector Allocation vs NEPSE Reference */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-slate-100">
                Sector Allocation vs NEPSE Weight
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your portfolio sector exposure vs exchange benchmark weight
              </p>
            </div>
            <button
              onClick={() => onNavigate('market')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
            >
              NEPSE Sectors <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {activeSectors.slice(0, 8).map(sec => {
              const maxS = 0.55;
              const isBreached = sec.w > limits.sector;
              return (
                <div key={sec.n} className="grid grid-cols-[120px_1fr_60px] items-center gap-3 text-xs">
                  <span className="truncate text-slate-700 dark:text-slate-300 font-medium">
                    {sec.n}
                  </span>
                  <div className="relative h-3 bg-slate-100 dark:bg-slate-800 rounded-md overflow-hidden">
                    {/* Fill */}
                    <div
                      className={`h-full rounded-md ${isBreached ? 'bg-rose-500' : 'bg-slate-700 dark:bg-slate-400'}`}
                      style={{ width: `${Math.min(100, (sec.w / maxS) * 100)}%` }}
                    />
                    {/* Reference marker */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-amber-400 z-10"
                      style={{ left: `${(sec.r / maxS) * 100}%` }}
                      title={`NEPSE Benchmark: ${pc(sec.r, 0)}`}
                    />
                  </div>
                  <span className="text-right font-mono font-medium text-slate-700 dark:text-slate-300">
                    {pc(sec.w, 1)}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-slate-700 dark:bg-slate-400" />
              <span>Your Weight</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-3 bg-amber-400" />
              <span>NEPSE Benchmark Weight</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
