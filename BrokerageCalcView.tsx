import React, { useState } from 'react';
import { calculateTradeBreakdown } from '../../services/brokerageCalculator';
import { nprF, sg, cls } from '../../utils/format';
import { Calculator, ArrowRight, ShieldCheck, Scale, Info } from 'lucide-react';

export const BrokerageCalcView: React.FC = () => {
  const [buyPrice, setBuyPrice] = useState<number>(500);
  const [sellPrice, setSellPrice] = useState<number>(550);
  const [qty, setQty] = useState<number>(500);
  const [holdingType, setHoldingType] = useState<'short_term' | 'long_term' | 'institutional'>('short_term');

  const b = calculateTradeBreakdown(buyPrice, sellPrice, qty, holdingType);

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="bg-slate-50 dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div>
          <h2 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" />
            Radical Cost Transparency Calculator
          </h2>
          <p className="text-slate-500 mt-0.5">
            SEBON-regulated broker commission tiers, SEBON 0.015% charge, CDSC DP charge, and capital gains tax.
          </p>
        </div>
        <div className="text-[11px] text-slate-400 bg-white dark:bg-[#0E1726] p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex-none">
          NEPSE Minimum Broker Fee: <b>Rs 10.00</b> | CDSC DP Fee: <b>Rs 25.00</b>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Input Parameters */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5 text-xs">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            Trade Parameters
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-medium mb-1">Buy Price (NPR)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={buyPrice}
                onChange={e => setBuyPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Sell Price (NPR)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                value={sellPrice}
                onChange={e => setSellPrice(Math.max(1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Quantity (Shares)</label>
            <input
              type="number"
              step="10"
              min="10"
              value={qty}
              onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold text-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Holding Duration & Tax Tier</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: 'short_term', label: 'Short-Term (< 365d)', rate: '7.5%' },
                { key: 'long_term', label: 'Long-Term (≥ 365d)', rate: '5.0%' },
                { key: 'institutional', label: 'Corporate / Inst.', rate: '10.0%' }
              ].map(t => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setHoldingType(t.key as any)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    holdingType === t.key
                      ? 'border-slate-900 dark:border-white bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold'
                      : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <div className="text-[11px] font-semibold">{t.label}</div>
                  <div className="text-[10px] opacity-75">{t.rate} CGT</div>
                </button>
              ))}
            </div>
          </div>

          {/* Breakeven highlight */}
          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 text-xs flex justify-between items-center">
            <div>
              <span className="font-semibold text-blue-900 dark:text-blue-100 block">
                Breakeven Exit Price
              </span>
              <span className="text-[11px] text-blue-700 dark:text-blue-300">
                Points needed to cover round-trip fees: +{b.pointsToBreakeven} pts
              </span>
            </div>
            <div className="font-serif font-bold text-xl text-blue-900 dark:text-blue-100">
              Rs {b.breakevenPrice.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Card */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs font-mono">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 font-sans">
            Cost & Profit Breakdown
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-3">
            {/* Buy Side */}
            <div className="space-y-1.5 pb-2">
              <span className="text-[10px] font-sans font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                BUY TRANSACTION
              </span>
              <div className="flex justify-between text-slate-500">
                <span>Buy Turnover:</span>
                <span className="text-slate-800 dark:text-slate-200">{nprF(b.buyTurnover)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Broker Commission:</span>
                <span className="text-slate-800 dark:text-slate-200">Rs {b.buyCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SEBON Regulatory Fee (0.015%):</span>
                <span className="text-slate-800 dark:text-slate-200">Rs {b.buySebonFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1">
                <span>Total Buy Capital Outlay:</span>
                <span>{nprF(b.buyTotalCost)}</span>
              </div>
            </div>

            {/* Sell Side */}
            <div className="space-y-1.5 py-3">
              <span className="text-[10px] font-sans font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                SELL TRANSACTION
              </span>
              <div className="flex justify-between text-slate-500">
                <span>Sell Turnover:</span>
                <span className="text-slate-800 dark:text-slate-200">{nprF(b.sellTurnover)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Broker Commission:</span>
                <span className="text-slate-800 dark:text-slate-200">Rs {b.sellCommission.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>SEBON Regulatory Fee (0.015%):</span>
                <span className="text-slate-800 dark:text-slate-200">Rs {b.sellSebonFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>DP Fee (CDSC MeroShare):</span>
                <span className="text-slate-800 dark:text-slate-200">Rs {b.sellDpCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100 pt-1">
                <span>Net Sell Receivable:</span>
                <span>{nprF(b.sellNetReceivable)}</span>
              </div>
            </div>

            {/* Taxes & Net P&L */}
            <div className="space-y-2 pt-3">
              <div className="flex justify-between text-slate-500">
                <span>Gross Trade Profit:</span>
                <span className="text-slate-800 dark:text-slate-200">{nprF(b.grossProfit)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Capital Gains Tax ({b.taxRatePct}%):</span>
                <span className="text-rose-500 font-bold">Rs {b.capitalGainsTax.toFixed(2)}</span>
              </div>
              <div className={`flex justify-between text-base font-bold pt-2 border-t border-slate-200 dark:border-slate-800 ${cls(b.netProfit)}`}>
                <span>Net Profit / Loss:</span>
                <span>
                  {nprF(b.netProfit)} ({sg(b.netProfitPct / 100, 2)})
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEBON Official Brokerage Tier Reference Table */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
          Official SEBON Broker Commission Slabs (Effective)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-slate-500">
              <tr>
                <th className="py-2.5 px-3">Transaction Turnover Slab</th>
                <th className="py-2.5 px-3 text-right">Commission Rate</th>
                <th className="py-2.5 px-3">Regulatory Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="py-2.5 px-3">Up to NPR 50,000</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">0.40%</td>
                <td className="py-2.5 px-3 text-slate-500">Min. fee Rs 10 per transaction</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">NPR 50,001 to NPR 500,000</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">0.37%</td>
                <td className="py-2.5 px-3 text-slate-500">Standard retail volume</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">NPR 500,001 to NPR 2,000,000</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">0.34%</td>
                <td className="py-2.5 px-3 text-slate-500">High-net-worth retail volume</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">NPR 2,000,001 to NPR 10,000,000</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">0.30%</td>
                <td className="py-2.5 px-3 text-slate-500">Institutional slab</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3">Above NPR 10,000,000 (1 Crore+)</td>
                <td className="py-2.5 px-3 text-right font-mono font-bold text-blue-600">0.27%</td>
                <td className="py-2.5 px-3 text-slate-500">Bulk institutional block trades</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
