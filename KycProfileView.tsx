import React, { useState } from 'react';
import { KycProfile } from '../../types';
import { UserCheck, ShieldCheck, CheckCircle2, Building, CreditCard, Award } from 'lucide-react';

interface KycProfileViewProps {
  profile: KycProfile;
  onUpdateProfile: (updated: Partial<KycProfile>) => void;
}

export const KycProfileView: React.FC<KycProfileViewProps> = ({ profile, onUpdateProfile }) => {
  const [boidInput, setBoidInput] = useState(profile.boid || '1301280001849204');
  const [nameInput, setNameInput] = useState(profile.fullName || 'Mahendra Dahal');
  const [emailInput, setEmailInput] = useState(profile.email || 'mahendradahal68@gmail.com');
  const [phoneInput, setPhoneInput] = useState(profile.phone || '+977-9801234567');
  const [dmatProvider, setDmatProvider] = useState(profile.dmatProvider || 'Nabil Investment Banking Limited');
  const [bankName, setBankName] = useState(profile.bankName || 'Nabil Bank Limited');
  const [accountNo, setAccountNo] = useState(profile.bankAccountNo || '01020304050607');
  const [citizenshipNo, setCitizenshipNo] = useState(profile.citizenshipNo || '27-01-76-04921');
  const [riskProfile, setRiskProfile] = useState<KycProfile['riskProfile']>(profile.riskProfile || 'Moderate');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      fullName: nameInput,
      email: emailInput,
      phone: phoneInput,
      boid: boidInput,
      dmatProvider,
      bankName,
      bankAccountNo: accountNo,
      citizenshipNo,
      riskProfile,
      isVerified: true
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-slate-900 dark:text-slate-100">
                {profile.fullName || nameInput}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>KYC VERIFIED</span>
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono mt-0.5">
              BOID: {profile.boid || boidInput} • DP: {profile.dmatProvider || dmatProvider}
            </div>
          </div>
        </div>

        <div className="text-right text-xs">
          <span className="text-slate-400 block">Investor Risk Category</span>
          <span className="font-bold text-blue-600 dark:text-blue-400 font-serif text-base">
            {riskProfile} Investor
          </span>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Investor profile & CDSC BOID details successfully updated!</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSave} className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          SEBON & CDSC Regulatory Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-500 font-medium mb-1">Full Legal Name</label>
            <input
              type="text"
              required
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={emailInput}
              onChange={e => setEmailInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Contact Phone</label>
            <input
              type="text"
              value={phoneInput}
              onChange={e => setPhoneInput(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
            />
          </div>

          <div>
            <label className="block text-slate-500 font-medium mb-1">Citizenship / National ID No.</label>
            <input
              type="text"
              value={citizenshipNo}
              onChange={e => setCitizenshipNo(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium font-mono"
            />
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-4">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            DMAT & Banking Integration
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-500 font-medium mb-1">
                16-Digit BOID (Beneficiary Owner ID)
              </label>
              <input
                type="text"
                maxLength={16}
                value={boidInput}
                onChange={e => setBoidInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">DMAT Provider (DP)</label>
              <select
                value={dmatProvider}
                onChange={e => setDmatProvider(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
              >
                <option value="Nabil Investment Banking Limited">Nabil Investment Banking Limited</option>
                <option value="NIC Asia Capital Limited">NIC Asia Capital Limited</option>
                <option value="Global IME Capital Limited">Global IME Capital Limited</option>
                <option value="Sanima Capital Limited">Sanima Capital Limited</option>
                <option value="Muktinath Capital Limited">Muktinath Capital Limited</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Settlement Bank Name</label>
              <select
                value={bankName}
                onChange={e => setBankName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium"
              >
                <option value="Nabil Bank Limited">Nabil Bank Limited</option>
                <option value="NIC Asia Bank Limited">NIC Asia Bank Limited</option>
                <option value="Global IME Bank Limited">Global IME Bank Limited</option>
                <option value="Everest Bank Limited">Everest Bank Limited</option>
                <option value="Standard Chartered Bank Nepal">Standard Chartered Bank Nepal</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-500 font-medium mb-1">Bank Account Number</label>
              <input
                type="text"
                value={accountNo}
                onChange={e => setAccountNo(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-4 space-y-3">
          <h4 className="font-semibold text-slate-800 dark:text-slate-200">
            Risk Tolerance Profiling
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'Conservative',
                desc: 'Focus on capital preservation, commercial banks, and dividend yield.'
              },
              {
                id: 'Moderate',
                desc: 'Balanced growth with index beta close to 1.0 and selective hydropower.'
              },
              {
                id: 'Aggressive',
                desc: 'Maximum upside, high exposure to beta > 1.2 hydro and microfinance.'
              }
            ].map(r => (
              <label
                key={r.id}
                className={`p-3 rounded-xl border cursor-pointer transition-all ${
                  riskProfile === r.id
                    ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-950/30 font-semibold'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <input
                    type="radio"
                    name="risk_pref"
                    checked={riskProfile === r.id}
                    onChange={() => setRiskProfile(r.id as any)}
                    className="accent-blue-600"
                  />
                  <span className="text-slate-900 dark:text-white font-bold">{r.id}</span>
                </div>
                <p className="text-[11px] text-slate-500">{r.desc}</p>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs shadow-md cursor-pointer"
        >
          Save & Verify KYC Details
        </button>
      </form>
    </div>
  );
};
