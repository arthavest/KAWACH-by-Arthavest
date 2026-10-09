import React, { useState } from 'react';
import { GOLD_DATA, REIT_DATA } from '../../data/nepseData';
import { npr, nprF } from '../../utils/format';
import { Coins, Building2, Shield, CheckCircle2, ArrowRight, Percent, Award } from 'lucide-react';

export const GoldAndReitView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GOLD' | 'REIT'>('GOLD');

  // Gold Calculator state
  const [goldTolas, setGoldTolas] = useState<number>(5);
  const totalGoldVal = goldTolas * GOLD_DATA.pricePerTola;

  // REIT Calculator state
  const [reitInvestment, setReitInvestment] = useState<number>(500000);
  const annualDividend = reitInvestment * 0.084;
  const quarterlyDividend = annualDividend / 4;

  // Waitlist state
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistConfirmed, setWaitlistConfirmed] = useState(false);

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistEmail.includes('@')) {
      setWaitlistConfirmed(true);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Navigation tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveTab('GOLD')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'GOLD'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Coins className="w-4 h-4 text-amber-500" />
          <span>ARTHAGOLD • Nepal Physical Gold ETF</span>
          {activeTab === 'GOLD' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('REIT')}
          className={`pb-3 px-4 text-xs font-bold transition-all relative flex items-center gap-2 ${
            activeTab === 'REIT'
              ? 'text-slate-900 dark:text-white'
              : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Building2 className="w-4 h-4 text-blue-500" />
          <span>ARTHAREIT • Commercial Real Estate Income Fund</span>
          {activeTab === 'REIT' && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
          )}
        </button>
      </div>

      {activeTab === 'GOLD' && (
        <div className="space-y-8">
          {/* Gold Hero */}
          <div className="bg-gradient-to-br from-[#1A1810] via-[#241E11] to-[#0E0C07] border border-amber-500/40 rounded-3xl p-6 md:p-10 text-[#F5F2EA] shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>999.9 FINE 24K PHYSICAL VAULTED GOLD</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight">
              ARTHAGOLD Bullion ETF
            </h2>

            <p className="text-sm md:text-base text-[#D4CBB8] max-w-2xl leading-relaxed">
              Demat units 100% backed by physical 24 Karat gold stored in an insured institutional vault in Kathmandu. Trade gold on NEPSE with zero making charges, zero purity risk, and complete liquidity.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-amber-200/60 block text-[10px] uppercase font-sans">1 Tola (11.664g)</span>
                <span className="font-serif font-bold text-xl text-amber-300">
                  {nprF(GOLD_DATA.pricePerTola)}
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-amber-200/60 block text-[10px] uppercase font-sans">10 Grams</span>
                <span className="font-serif font-bold text-xl text-amber-300">
                  {nprF(GOLD_DATA.pricePer10g)}
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-amber-200/60 block text-[10px] uppercase font-sans">Management Fee</span>
                <span className="font-serif font-bold text-xl text-white">0.35% p.a.</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-amber-200/60 block text-[10px] uppercase font-sans">Physical Delivery</span>
                <span className="font-serif font-bold text-xl text-emerald-400">Min 10 Tola</span>
              </div>
            </div>
          </div>

          {/* Calculator and Audit Specs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-500" />
                Gold Allocation Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Calculate units equivalent to physical gold in Tolas
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Target Gold Quantity</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {goldTolas} Tolas ({(goldTolas * 11.664).toFixed(1)} grams)
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={goldTolas}
                    onChange={e => setGoldTolas(parseInt(e.target.value))}
                    className="w-full accent-amber-500"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Official FENEGOSIDA Rate:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200">
                      Rs {GOLD_DATA.pricePerTola.toLocaleString()} / Tola
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Physical Gold Making Loss Saved:</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                      ~12% (Rs {(totalGoldVal * 0.12).toFixed(0)})
                    </span>
                  </div>
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-slate-100">
                    <span>Equivalent ARTHAGOLD Value:</span>
                    <span className="font-mono text-base text-amber-600 dark:text-amber-400">
                      {nprF(totalGoldVal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Audit & Vault Security */}
            <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3 text-xs">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-500" />
                Custody & Proof of Reserves
              </h3>

              <div className="space-y-2.5 text-slate-600 dark:text-slate-400">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
                  <b className="block text-slate-800 dark:text-slate-200 mb-0.5">Physical Vault Location</b>
                  <span>{GOLD_DATA.vaultLocation}. Multi-signatory, biometric secured institutional vault.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
                  <b className="block text-slate-800 dark:text-slate-200 mb-0.5">Independent Purity Audit</b>
                  <span>Assayed and verified by {GOLD_DATA.auditor}. Quarterly physical bar inspections.</span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
                  <b className="block text-slate-800 dark:text-slate-200 mb-0.5">Physical Delivery Redemption</b>
                  <span>Investors holding 10 Tolas or more can request physical delivery of certified gold bars in Kathmandu.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'REIT' && (
        <div className="space-y-8">
          {/* REIT Hero */}
          <div className="bg-gradient-to-br from-[#0C1729] via-[#102038] to-[#080E1C] border border-blue-500/40 rounded-3xl p-6 md:p-10 text-[#F0F4FA] shadow-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>COMMERCIAL REAL ESTATE YIELD FUND</span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl font-bold text-white tracking-tight">
              ARTHAREIT Income Trust
            </h2>

            <p className="text-sm md:text-base text-[#B0C4DF] max-w-2xl leading-relaxed">
              Earn regular quarterly rental cash yields from premier commercial properties across Kathmandu, Lalitpur, and Pokhara. Demat liquidity with institutional tenancy covenants.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs font-mono">
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-blue-200/60 block text-[10px] uppercase font-sans">Target Rental Yield</span>
                <span className="font-serif font-bold text-xl text-emerald-400">
                  {REIT_DATA.targetYield}
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-blue-200/60 block text-[10px] uppercase font-sans">Distribution</span>
                <span className="font-serif font-bold text-xl text-white">Quarterly</span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-blue-200/60 block text-[10px] uppercase font-sans">Portfolio Valuation</span>
                <span className="font-serif font-bold text-xl text-white">
                  {REIT_DATA.portfolioValue}
                </span>
              </div>
              <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <span className="text-blue-200/60 block text-[10px] uppercase font-sans">Occupancy</span>
                <span className="font-serif font-bold text-xl text-blue-300">
                  {REIT_DATA.occupancyRate}
                </span>
              </div>
            </div>
          </div>

          {/* Properties & Yield Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Yield Calculator */}
            <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-emerald-500" />
                Quarterly Cash Rental Calculator
              </h3>
              <p className="text-xs text-slate-500">
                Direct dividend payout calculation based on 8.4% target rental yield
              </p>

              <div className="space-y-4 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Investment Amount</span>
                    <span className="font-mono text-slate-900 dark:text-white font-bold">
                      {nprF(reitInvestment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="50000"
                    value={reitInvestment}
                    onChange={e => setReitInvestment(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Annual Rental Income:</span>
                    <span className="font-mono text-slate-800 dark:text-slate-200 font-bold">
                      {nprF(annualDividend)} / year
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600 dark:text-emerald-400">
                    <span>Quarterly Cash Payout into Bank:</span>
                    <span className="font-serif text-lg">
                      {nprF(quarterlyDividend)} / quarter
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties List */}
            <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-500" />
                Asset Portfolio Breakdown
              </h3>

              <div className="space-y-2.5 text-xs">
                {REIT_DATA.properties.map((prop, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="flex justify-between font-bold text-slate-900 dark:text-slate-100">
                      <span>{prop.name}</span>
                      <span className="text-emerald-500 font-mono">{prop.occupancy} Occupancy</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{prop.location} • {prop.sqFt}</div>
                    <div className="text-[11px] text-slate-500">{prop.tenants}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
