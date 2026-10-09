import React from 'react';
import { MarketState, AnalysisResult } from '../../types';
import { NEPSE_MACRO } from '../../data/nepseData';
import { npr, nprF, sg, cls } from '../../utils/format';
import { Landmark, TrendingUp, ShieldCheck, Scale, CheckCircle2 } from 'lucide-react';

interface MarketViewProps {
  marketState: MarketState;
  analysis: AnalysisResult;
}

export const MarketView: React.FC<MarketViewProps> = ({ marketState, analysis: a }) => {
  // Calculate implied portfolio movement today based on sector sub-index returns
  let impliedReturn = 0;
  if (!a.empty) {
    impliedReturn = a.H.reduce((acc, h) => {
      const subIdx = marketState.subIndices.find(s =>
        h.sector.toLowerCase().includes(s.name.toLowerCase()) ||
        s.name.toLowerCase().includes(h.sector.toLowerCase())
      );
      const ret = subIdx ? subIdx.pChange / 100 : marketState.pct;
      return acc + h.w * ret;
    }, 0);
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Implied Movement Banner */}
      {!a.empty && (
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
              Implied Sector Movement Today
            </div>
            <div className="font-serif text-2xl font-bold mt-0.5 text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className={cls(impliedReturn)}>{sg(impliedReturn, 2)}</span>
              <span className="text-sm font-sans font-normal text-slate-500">
                ({impliedReturn >= 0 ? '+' : ''}{nprF(impliedReturn * a.V)})
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              If your holdings track their respective sector indices today.
            </p>
          </div>
          <div className="text-xs text-slate-500 bg-slate-50 dark:bg-[#0E1726] p-3 rounded-xl border border-slate-100 dark:border-slate-800">
            Market breadth: <b className="text-emerald-500">{marketState.advances} Advancing</b> /{' '}
            <b className="text-rose-500">{marketState.declines} Declining</b>
          </div>
        </div>
      )}

      {/* Sub-Indices Grid */}
      <div>
        <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-3">
          NEPSE Sector Indices Performance
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
          {marketState.subIndices.map(sub => (
            <div
              key={sub.name}
              className="p-3.5 rounded-xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-1"
            >
              <div className="font-medium text-slate-600 dark:text-slate-400 truncate">
                {sub.name}
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                  {sub.value.toFixed(1)}
                </span>
                <span className={`font-mono font-bold ${cls(sub.pChange)}`}>
                  {sg(sub.pChange / 100, 2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Macro Indicators & Central Bank Policies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Macro Indicators */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-5 h-5 text-blue-500" />
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              Nepal Macro & NRB Monetary Indicators
            </h3>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            <div className="py-3 flex justify-between">
              <div>
                <b className="block text-slate-800 dark:text-slate-200">NRB Policy Repo Rate</b>
                <span className="text-[11px] text-slate-400">{NEPSE_MACRO.nrbPolicyNote}</span>
              </div>
              <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {NEPSE_MACRO.nrbPolicyRate}
              </span>
            </div>

            <div className="py-3 flex justify-between">
              <div>
                <b className="block text-slate-800 dark:text-slate-200">Inflation (Consumer Price Index)</b>
                <span className="text-[11px] text-slate-400">{NEPSE_MACRO.inflationNote}</span>
              </div>
              <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {NEPSE_MACRO.inflationCpi}
              </span>
            </div>

            <div className="py-3 flex justify-between">
              <div>
                <b className="block text-slate-800 dark:text-slate-200">Foreign Exchange Reserves</b>
                <span className="text-[11px] text-slate-400">{NEPSE_MACRO.fxReservesNote}</span>
              </div>
              <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {NEPSE_MACRO.fxReservesNpr}
              </span>
            </div>

            <div className="py-3 flex justify-between">
              <div>
                <b className="block text-slate-800 dark:text-slate-200">Remittance Inflow Growth</b>
                <span className="text-[11px] text-slate-400">{NEPSE_MACRO.remittanceNote}</span>
              </div>
              <span className="font-serif font-bold text-base text-emerald-600 dark:text-emerald-400">
                {NEPSE_MACRO.remittanceGrowth}
              </span>
            </div>

            <div className="py-3 flex justify-between">
              <div>
                <b className="block text-slate-800 dark:text-slate-200">Currency Board Peg</b>
                <span className="text-[11px] text-slate-400">{NEPSE_MACRO.rupeePegNote}</span>
              </div>
              <span className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                {NEPSE_MACRO.rupeePeg}
              </span>
            </div>
          </div>
        </div>

        {/* NEPSE Market Rules & Circuit Breakers */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-500" />
            <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
              NEPSE Exchange Rules & Circuit Breakers
            </h3>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Index Circuit Breaker Halts
              </span>
              <div className="space-y-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                {NEPSE_MACRO.circuitBreakers.map((cb, i) => (
                  <div key={i} className="flex justify-between">
                    <span>
                      {cb.period} (±{cb.threshold}):
                    </span>
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {cb.action}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Settlement & Delivery
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {NEPSE_MACRO.settlementCycle}. Shares are transferred via EDIS on MeroShare, and payout is completed via IPS / connectIPS directly into linked bank accounts.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <span className="font-semibold text-slate-800 dark:text-slate-200 block mb-1">
                Single Stock Daily Price Limit
              </span>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                Individual stocks are capped at a 10% daily upper circuit and 10% lower circuit limit from the previous day's close.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
