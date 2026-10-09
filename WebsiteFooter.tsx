import React from 'react';
import { Shield, Mail, Phone, MapPin, ExternalLink, Terminal } from 'lucide-react';

interface WebsiteFooterProps {
  onOpenApp: (tab?: string) => void;
  onSelectSection: (section: string) => void;
}

export const WebsiteFooter: React.FC<WebsiteFooterProps> = ({ onOpenApp, onSelectSection }) => {
  return (
    <footer className="bg-[#070D18] text-[#93A0B5] border-t border-[#162338] pt-16 pb-12 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <svg className="w-8 h-10 flex-none" viewBox="0 0 200 240" aria-hidden="true">
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
                <div className="font-serif font-bold text-xl text-white tracking-wide">
                  ATH CAPITAL
                </div>
                <div className="font-deva text-xs text-[#9FB0C8]">अर्थभेस्ट इन्भेष्टमेन्ट • काठमाडौँ</div>
              </div>
            </div>

            <p className="text-xs text-[#8E9DB5] leading-relaxed max-w-sm">
              World-class investment architecture for Nepal: NEPSE execution, the ATH50 index fund, gold & real estate ETFs, and Aladdin-grade risk decomposition.
            </p>

            <div className="pt-2 text-[11px] space-y-1 text-[#6F819E]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>Hattisar & Durbarmarg Hub, Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>contact@arthavest.com.np</span>
              </div>
            </div>
          </div>

          {/* Column 1: Investment Products */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-white">
              Funds & Products
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenApp('ath50')}
                  className="hover:text-white transition-colors"
                >
                  Nepal Top-50 ETF (ATH50)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('gold_reit')}
                  className="hover:text-white transition-colors"
                >
                  ARTHAGOLD Bullion ETF
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('gold_reit')}
                  className="hover:text-white transition-colors"
                >
                  ARTHAREIT Real Estate Trust
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('trading')}
                  className="hover:text-white transition-colors"
                >
                  NEPSE Live Order Book
                </button>
              </li>
            </ul>
          </div>

          {/* Column 2: Technology & Tools */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-white">
              Aladdin Risk Console
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenApp('overview')}
                  className="hover:text-white transition-colors"
                >
                  KAWACH Protection Shield
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('risk')}
                  className="hover:text-white transition-colors"
                >
                  Parametric VaR & CVaR
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('stress')}
                  className="hover:text-white transition-colors"
                >
                  Historical Stress Testing
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('screener')}
                  className="hover:text-white transition-colors"
                >
                  200-Day EMA Screener
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('brokerage')}
                  className="hover:text-white transition-colors"
                >
                  Brokerage & Tax Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Institutional */}
          <div className="space-y-3">
            <div className="text-[11px] uppercase tracking-wider font-bold text-white">
              Governance & Regulator
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onOpenApp('method')}
                  className="hover:text-white transition-colors"
                >
                  Mathematical Methodology
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('about')}
                  className="hover:text-white transition-colors"
                >
                  About ARTHAVEST
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('kyc')}
                  className="hover:text-white transition-colors"
                >
                  CDSC MeroShare KYC
                </button>
              </li>
              <li>
                <button
                  onClick={() => onOpenApp('overview')}
                  className="hover:text-white transition-colors flex items-center gap-1 text-rose-400 font-semibold"
                >
                  <Terminal className="w-3 h-3" />
                  <span>Launch Terminal</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal & Regulatory Disclaimer */}
        <div className="border-t border-[#142137] pt-8 text-[11px] text-[#637592] leading-relaxed space-y-3">
          <p>
            <b>Regulatory Notice:</b> ARTHAVEST INVESTMENT PRIVATE LIMITED is incorporated in Kathmandu, Nepal under the Companies Act of Nepal. Fund schemes and ETFs are subject to SEBON approval and licensing prior to public subscription. Past performance is no guarantee of future returns. Equity, gold, and real estate investments are subject to market risks.
          </p>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-[#556680] pt-2">
            <div>
              © 2026 ARTHAVEST INVESTMENT PRIVATE LIMITED • ATH Capital Nepal. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>SEBON Disclosures</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
