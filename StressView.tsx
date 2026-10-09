import React, { useState } from 'react';
import { AnalysisResult, AnalyzedHolding } from '../../types';
import { STRESS_SCENARIOS, SECTOR_NAMES } from '../../data/nepseData';
import { npr, nprF, pc, sg, cls } from '../../utils/format';
import { Zap, Sliders, History, AlertTriangle } from 'lucide-react';

interface StressViewProps {
  analysis: AnalysisResult;
}

export const StressView: React.FC<StressViewProps> = ({ analysis: a }) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>('bear');
  const [customShocks, setCustomShocks] = useState<Record<string, number>>({});

  if (a.empty) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 text-center text-slate-500">
        Portfolio is empty. Add holdings to test stress shocks.
      </div>
    );
  }

  const activeScenario = STRESS_SCENARIOS.find(s => s.id === selectedScenarioId) || STRESS_SCENARIOS[0];

  // Calculate shock for each holding
  const calculateShock = (h: AnalyzedHolding): number => {
    if (selectedScenarioId === 'custom') {
      return (customShocks[h.sector] || 0) / 100;
    }
    if (activeScenario.fn) {
      return activeScenario.fn(h);
    }
    if (activeScenario.map) {
      return (activeScenario.map[h.sector] || -8) / 100;
    }
    return -0.15;
  };

  const results = a.H.map(h => {
    const shockPct = calculateShock(h);
    const lossNpr = h.value * shockPct;
    return {
      sym: h.sym,
      name: h.name,
      sector: h.sector,
      value: h.value,
      shockPct,
      lossNpr
    };
  });

  const totalShockLoss = results.reduce((acc, r) => acc + r.lossNpr, 0);
  const totalShockPct = a.V > 0 ? totalShockLoss / a.V : 0;

  const handleCustomSliderChange = (sec: string, val: number) => {
    setCustomShocks(prev => ({ ...prev, [sec]: val }));
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Shock Result Banner */}
      <div className="bg-[#0F1A2C] text-[#F2F4F8] border border-[#1C2C45] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-400 uppercase tracking-wider">
            <Zap className="w-4 h-4" />
            <span>Estimated Stress Loss</span>
          </div>
          <div className="font-serif text-4xl md:text-5xl font-bold tracking-tight text-rose-400">
            {nprF(totalShockLoss)}
          </div>
          <p className="text-xs text-[#9FB0C8]">
            Portfolio drops by <b className="text-white">{sg(totalShockPct, 2)}</b> under the{' '}
            <b className="text-white">{activeScenario.name}</b> shock.
          </p>
        </div>

        <div className="bg-[#142137] border border-[#233550] p-4 rounded-xl text-xs space-y-1.5 md:max-w-xs">
          <div className="text-[#9FB0C8] font-medium">Scenario Context</div>
          <div className="text-white leading-relaxed">{activeScenario.d}</div>
          {activeScenario.historical && (
            <div className="text-[#7D91AF] text-[11px] pt-1">
              Historical anchor: {activeScenario.historical}
            </div>
          )}
        </div>
      </div>

      {/* Scenario Selector & Custom Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
        {/* Scenarios List */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 py-1 flex items-center justify-between">
            <span>Historical & Macro Shocks</span>
            <History className="w-3.5 h-3.5" />
          </div>

          <div className="space-y-1.5">
            {STRESS_SCENARIOS.map(scen => (
              <button
                key={scen.id}
                onClick={() => setSelectedScenarioId(scen.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                  selectedScenarioId === scen.id
                    ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 shadow-xs'
                    : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                }`}
              >
                <b className="block font-semibold">{scen.name}</b>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                  {scen.d}
                </span>
              </button>
            ))}

            <button
              onClick={() => setSelectedScenarioId('custom')}
              className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                selectedScenarioId === 'custom'
                  ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-100 shadow-xs'
                  : 'border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300'
              }`}
            >
              <div className="flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-blue-500" />
                <b className="font-semibold">Custom Multi-Factor Stress Builder</b>
              </div>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-0.5">
                Dial custom percentage shocks for every sector
              </span>
            </button>
          </div>
        </div>

        {/* Right Pane: Scrip Impact Breakdown or Custom Sliders */}
        <div className="space-y-6">
          {selectedScenarioId === 'custom' && (
            <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                Custom Sector Shock Controls
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {SECTOR_NAMES.map(sec => {
                  const val = customShocks[sec] || 0;
                  return (
                    <div key={sec} className="space-y-1 p-2 rounded-lg bg-slate-50 dark:bg-[#0E1726]">
                      <div className="flex justify-between font-medium">
                        <span className="truncate">{sec}</span>
                        <span className={`font-mono font-bold ${cls(val)}`}>
                          {val >= 0 ? '+' : ''}
                          {val}%
                        </span>
                      </div>
                      <input
                        type="range"
                        min="-50"
                        max="50"
                        value={val}
                        onChange={e => handleCustomSliderChange(sec, parseInt(e.target.value))}
                        className="w-full accent-rose-600"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Holdings Stress Impact Table */}
          <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
                  Individual Position Stress Impact
                </h3>
                <p className="text-xs text-slate-500">
                  Calculated downside rupee impact sorted by dollar loss
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Scrip</th>
                    <th className="py-3 px-3">Sector</th>
                    <th className="py-3 px-3 text-right">Current Value</th>
                    <th className="py-3 px-3 text-right">Shock %</th>
                    <th className="py-3 px-4 text-right">Rupee Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[...results]
                    .sort((a, b) => a.lossNpr - b.lossNpr)
                    .map(r => (
                      <tr key={r.sym} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                          {r.sym}
                        </td>
                        <td className="py-3 px-3 text-slate-500 text-[11px]">{r.sector}</td>
                        <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                          {nprF(r.value)}
                        </td>
                        <td className={`py-3 px-3 text-right font-mono font-bold ${cls(r.shockPct)}`}>
                          {sg(r.shockPct, 1)}
                        </td>
                        <td className={`py-3 px-4 text-right font-mono font-bold ${cls(r.lossNpr)}`}>
                          {nprF(r.lossNpr)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
