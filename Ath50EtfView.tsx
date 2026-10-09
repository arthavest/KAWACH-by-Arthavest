import React, { useState } from 'react';
import { ATH50_CONSTITUENTS } from '../../data/nepseData';
import { npr, nprF, pc } from '../../utils/format';
import { Layers, CheckCircle2, TrendingUp, Sparkles, Shield, Calculator, FileCheck, ArrowRight } from 'lucide-react';

export const Ath50EtfView: React.FC = () => {
  // SIP calculator state
  const [monthlySip, setMonthlySip] = useState<number>(15000);
  const [sipYears, setSipYears] = useState<number>(15);
  const [expectedReturnPct, setExpectedReturnPct] = useState<number>(14.5);

  // Waitlist form state
  const [emailInput, setEmailInput] = useState('');
  const [boidInput, setBoidInput] = useState('');
  const [registered, setRegistered] = useState(false);

  // Calculate Indicative NAV (iNAV)
  const totalBasketValue = ATH50_CONSTITUENTS.reduce((acc, c) => acc + c.marketValue, 0);
  const basketUnits = 100000;
  const inav = Math.round((totalBasketValue / basketUnits) * 100) / 100;

  // SIP math
  const nMonths = sipYears * 12;
  const monthlyRate = expectedReturnPct / 100 / 12;
  const futureValueEtf =
    monthlySip * ((Math.pow(1 + monthlyRate, nMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  const investedAmount = monthlySip * nMonths;

  // Traditional Mutual Fund with 1.50% drag
  const mfRate = (expectedReturnPct - 1.25) / 100 / 12;
  const futureValueMf =
    monthlySip * ((Math.pow(1 + mfRate, nMonths) - 1) / mfRate) * (1 + mfRate);
  const feeSavings = futureValueEtf - futureValueMf;

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;
    setRegistered(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Hero Banner matching KAWACH branding */}
      <section className="bg-gradient-to-br from-[#0F1A2C] via-[#111A2C] to-[#0A0F1B] border border-amber-500/30 rounded-3xl p-6 md:p-10 text-[#EEF1F6] relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>NEPAL'S FIRST LOW-COST INDEX ETF • LAUNCHING SOON</span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl font-bold tracking-tight text-white leading-tight">
            Nepal Top-50 ETF (ATH50)
          </h2>

          <p className="text-sm md:text-base text-[#95A0B7] leading-relaxed">
            Invest in all top 50 blue-chip companies on the Nepal Stock Exchange through a single listed fund. Instant institutional diversification that eliminates single-stock risk at 1/6th the cost of legacy mutual funds.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
            <div className="bg-[#142137]/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-[#6E7891] block text-[10px] uppercase font-sans">Indicative iNAV</span>
              <span className="font-serif font-bold text-xl text-white">Rs {inav.toFixed(2)}</span>
            </div>
            <div className="bg-[#142137]/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-[#6E7891] block text-[10px] uppercase font-sans">Expense Ratio (TER)</span>
              <span className="font-serif font-bold text-xl text-emerald-400">0.25% p.a.</span>
            </div>
            <div className="bg-[#142137]/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-[#6E7891] block text-[10px] uppercase font-sans">Constituents</span>
              <span className="font-serif font-bold text-xl text-white">Top 50 NEPSE</span>
            </div>
            <div className="bg-[#142137]/80 backdrop-blur-md p-3 rounded-xl border border-white/5">
              <span className="text-[#6E7891] block text-[10px] uppercase font-sans">Single Stock Cap</span>
              <span className="font-serif font-bold text-xl text-amber-300">8.0% Max</span>
            </div>
          </div>
        </div>
      </section>

      {/* Low Cost Revolution & SIP Wealth Compounder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* SIP Calculator */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-emerald-500" />
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                ATH50 Systematic Investment Plan (SIP)
              </h3>
              <p className="text-xs text-slate-500">
                Simulate long-term wealth compounding in Nepali index units
              </p>
            </div>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Monthly SIP Contribution</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {nprF(monthlySip)}
                </span>
              </div>
              <input
                type="range"
                min="2000"
                max="100000"
                step="1000"
                value={monthlySip}
                onChange={e => setMonthlySip(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Investment Horizon</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {sipYears} Years
                </span>
              </div>
              <input
                type="range"
                min="3"
                max="30"
                step="1"
                value={sipYears}
                onChange={e => setSipYears(parseInt(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="text-slate-600 dark:text-slate-400">Expected Annual Return</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {expectedReturnPct}%
                </span>
              </div>
              <input
                type="range"
                min="8"
                max="22"
                step="0.5"
                value={expectedReturnPct}
                onChange={e => setExpectedReturnPct(parseFloat(e.target.value))}
                className="w-full accent-emerald-600"
              />
            </div>
          </div>

          {/* Results Box */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Total Capital Invested:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {npr(investedAmount)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Future Value with ATH50 (0.25% fee):</span>
              <span className="font-serif font-bold text-base text-emerald-600 dark:text-emerald-400">
                {npr(futureValueEtf)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Future Value with Legacy Fund (1.50% fee):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                {npr(futureValueMf)}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-amber-600 dark:text-amber-400">
              <span>Cost Savings Kept In Your Pocket:</span>
              <span className="font-mono text-sm">+{npr(feeSavings)}</span>
            </div>
          </div>
        </div>

        {/* Early Investor Registration */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <div>
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                Priority Unit Allocation Waitlist
              </h3>
              <p className="text-xs text-slate-500">
                Get notified first when the IPO / NFO opens for public subscription
              </p>
            </div>
          </div>

          {registered ? (
            <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h4 className="font-serif font-bold text-lg text-emerald-900 dark:text-emerald-100">
                Registration Confirmed!
              </h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-sm mx-auto">
                You are on the priority allocation list. We will send the SEBON NFO prospectus and direct DMAT subscription instructions to <b>{emailInput}</b>.
              </p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  Email Address for Prospectus
                </label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1">
                  16-Digit CDSC BOID / DMAT Number (Optional)
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={boidInput}
                  onChange={e => setBoidInput(e.target.value)}
                  placeholder="1301... (16 digits)"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-blue-500" />
                  <span>SEBON Regulatory Filing in Progress</span>
                </div>
                <p>
                  Sponsor: ARTHAVEST INVESTMENT PRIVATE LIMITED. Fund Manager & Depository partner licensed by SEBON.
                </p>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Join ATH50 Priority Allocation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Index Basket Constituents Table */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div>
            <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
              ATH50 Basket Composition & Single Scrip Capping
            </h3>
            <p className="text-xs text-slate-500">
              Live constituents with 8.0% prudential concentration ceiling
            </p>
          </div>
          <div className="text-xs text-slate-500 font-mono">
            Basket Size: <b>100,000 Units</b>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Scrip</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">LTP (Rs)</th>
                <th className="py-3 px-3 text-right">Shares in Basket</th>
                <th className="py-3 px-3 text-right">Basket Value</th>
                <th className="py-3 px-4 text-right">Capped Weight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {ATH50_CONSTITUENTS.map(c => (
                <tr key={c.sym} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">
                    {c.sym}
                  </td>
                  <td className="py-3 px-3 text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {c.name}
                  </td>
                  <td className="py-3 px-3 text-slate-500 text-[11px]">{c.sector}</td>
                  <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 dark:text-slate-200">
                    {nprF(c.price)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">{c.sharesInBasket.toLocaleString()}</td>
                  <td className="py-3 px-3 text-right font-mono text-slate-700 dark:text-slate-300">
                    {nprF(c.marketValue)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    {pc(c.cappedWeight, 1)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
