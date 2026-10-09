import React from 'react';
import { Shield, Target, Lock, Heart, Award, MapPin, Mail, Phone } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200 text-xs">
      {/* Brand Hero */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <svg className="w-10 h-12 flex-none" viewBox="0 0 200 240" aria-hidden="true">
            <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#B4213A" />
            <path
              d="M100 46 L100 196 M100 46 L152 68 V112 C152 150 128 178 100 192"
              fill="none"
              stroke="#fff"
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
              opacity=".92"
            />
          </svg>
          <div>
            <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
              ARTHAVEST INVESTMENT PRIVATE LIMITED
            </h2>
            <div className="text-slate-500 font-deva text-sm">अर्थभेस्ट इन्भेष्टमेन्ट प्रा. लि. • काठमाडौँ, नेपाल</div>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          ARTHAVEST is an institutional investment management firm based in Kathmandu, Nepal. We build modern, risk-first investment infrastructure inspired by <b>BlackRock Aladdin</b> (institutional risk decomposition, stress testing, and factor modeling) and <b>Zerodha</b> (radical cost transparency, ultra-low fees, and clean retail interfaces).
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Founded</span>
            <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">2026</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Primary Market</span>
            <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">NEPSE</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Regulator</span>
            <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">SEBON</div>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] uppercase font-semibold">Flagship System</span>
            <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">KAWACH (कवच)</div>
          </div>
        </div>
      </div>

      {/* Core Principles */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
          Our Four Design Principles
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Shield className="w-4 h-4 text-rose-600" />
              <span>Risk Before Return</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              A proper portfolio system should tell an investor what could go wrong before it tells them what could go right. Kawach opens on risk limits, concentration, and downside stress, not on speculative hype.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Target className="w-4 h-4 text-emerald-600" />
              <span>Built for One Market (NEPSE)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Kawach is not a generic US/European tool trimmed down for Nepal. Sector volatilities, correlations, 240-day calendars, T+2 settlement, and NRB lending caps are modeled specifically from the ground up.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Award className="w-4 h-4 text-amber-600" />
              <span>Radical Cost Transparency</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              We believe high mutual fund fees (1.50% - 2.50%) silently destroy compound returns in Nepal. We are pioneering the 0.25% index fund revolution (ATH50) and open cost calculators.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 shadow-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-slate-100">
              <Lock className="w-4 h-4 text-blue-600" />
              <span>Client Privacy & Data Sovereignty</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
              Your holdings and quantities are stored in your own browser's encrypted local storage. Nothing is sold, scraped, or transmitted to third-party ad networks.
            </p>
          </div>
        </div>
      </div>

      {/* Office & Contact */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between gap-4">
        <div className="space-y-1">
          <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>Kathmandu Registered Office</span>
          </div>
          <div className="text-slate-500 text-[11px]">
            Hattisar & Durbarmarg Financial Hub, Kathmandu, Nepal
          </div>
        </div>

        <div className="flex items-center gap-6 text-[11px] text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-blue-500" />
            <span>contact@arthavest.com.np</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-emerald-500" />
            <span>+977-1-4428900</span>
          </div>
        </div>
      </div>
    </div>
  );
};
