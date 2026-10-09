import React from 'react';
import {
  ShieldCheck,
  Briefcase,
  TrendingUp,
  AlertTriangle,
  Zap,
  LineChart,
  Search,
  Layers,
  Coins,
  Calculator,
  UserCheck,
  BookOpen,
  Info,
  Sun,
  Moon,
  Activity
} from 'lucide-react';

export type ViewKey =
  | 'overview'
  | 'holdings'
  | 'trading'
  | 'risk'
  | 'stress'
  | 'market'
  | 'screener'
  | 'ath50'
  | 'gold_reit'
  | 'brokerage'
  | 'kyc'
  | 'method'
  | 'about';

interface NavigationRailProps {
  currentView: ViewKey;
  onSelectView: (v: ViewKey) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  simSpeed: number;
  onSetSimSpeed: (speed: number) => void;
  isSimActive: boolean;
  onToggleSim: () => void;
}

interface NavItem {
  key: ViewKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tag?: string;
  section?: string;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'overview', label: 'Overview', icon: ShieldCheck, section: 'Portfolio' },
  { key: 'holdings', label: 'Holdings & WACC', icon: Briefcase },
  { key: 'trading', label: 'NEPSE Trading', icon: TrendingUp, tag: 'TMS' },

  { key: 'risk', label: 'KAWACH by Arthavest', icon: AlertTriangle, section: 'Analytics' },
  { key: 'stress', label: 'Stress Tests', icon: Zap },
  { key: 'market', label: 'Nepal Market', icon: LineChart },
  { key: 'screener', label: 'Technical Screener', icon: Search, tag: '200 EMA' },

  { key: 'ath50', label: 'Nepal Top-50 ETF', icon: Layers, tag: 'New', section: 'Funds & Products' },
  { key: 'gold_reit', label: 'Gold ETF & REIT', icon: Coins, tag: 'Vaulted' },
  { key: 'brokerage', label: 'Brokerage Calculator', icon: Calculator },
  { key: 'kyc', label: 'Investor KYC', icon: UserCheck },

  { key: 'method', label: 'Methodology', icon: BookOpen, section: 'Company' },
  { key: 'about', label: 'About Arthavest', icon: Info }
];

export const NavigationRail: React.FC<NavigationRailProps> = ({
  currentView,
  onSelectView,
  isDark,
  onToggleTheme,
  simSpeed,
  onSetSimSpeed,
  isSimActive,
  onToggleSim
}) => {
  return (
    <aside className="w-64 flex-none bg-[#0B1424] text-[#DDE4EF] flex flex-col justify-between p-5 border-r border-[#1B283D] min-h-screen select-none">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-3 mb-4">
          <svg className="w-9 h-11 flex-none" viewBox="0 0 200 240" aria-hidden="true">
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
            <div className="font-serif font-bold text-2xl tracking-wide text-white leading-none">
              KAWACH
            </div>
            <div className="font-deva text-xs text-[#9FB0C8] font-medium mt-1">कवच • ARTHAVEST</div>
          </div>
        </div>

        <div className="text-[11px] leading-relaxed text-[#8E9DB5] mb-5 border-b border-[#1A263C] pb-3">
          <span className="font-semibold text-[#DDE4EF] block">ARTHAVEST INVESTMENT</span>
          Aladdin-grade risk engine & NEPSE terminal
        </div>

        {/* Navigation list */}
        <nav className="flex flex-col gap-0.5" aria-label="Main Navigation">
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const isActive = currentView === item.key;
            return (
              <React.Fragment key={item.key}>
                {item.section && idx > 0 && (
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#5A6E8C] px-3 pt-3 pb-1">
                    {item.section}
                  </div>
                )}
                {item.section && idx === 0 && (
                  <div className="text-[10px] uppercase tracking-wider font-semibold text-[#5A6E8C] px-3 pb-1">
                    {item.section}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => onSelectView(item.key)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left ${
                    isActive
                      ? 'bg-[#1C2C45] text-white shadow-sm border-l-3 border-[#B4213A]'
                      : 'text-[#9FB0C8] hover:bg-[#131F33] hover:text-[#E8ECF3]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 flex-none ${isActive ? 'text-[#E2586F]' : 'text-[#7D91AF]'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.tag && (
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded font-semibold flex-none ${
                        item.tag === 'New'
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-700/50'
                          : item.tag === 'TMS'
                          ? 'bg-blue-950/80 text-blue-400 border border-blue-700/50'
                          : 'bg-[#1C2C45] text-[#A9BFD9]'
                      }`}
                    >
                      {item.tag}
                    </span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </nav>
      </div>

      {/* Footer controls */}
      <div className="pt-4 border-t border-[#1A263C] text-[11px] text-[#7A8CA6] flex flex-col gap-3">
        {/* Live Simulation Speed Controller */}
        <div className="bg-[#070D18] p-2.5 rounded-lg border border-[#162338]">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isSimActive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span className="font-semibold text-slate-300 text-[11px]">Tick Feed</span>
            </div>
            <button
              onClick={onToggleSim}
              className="text-[10px] text-[#A9BFD9] hover:text-white px-1.5 py-0.5 rounded bg-[#132035]"
            >
              {isSimActive ? 'Pause' : 'Resume'}
            </button>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span>Speed</span>
            <div className="flex gap-1">
              {[1, 2, 5].map(spd => (
                <button
                  key={spd}
                  onClick={() => onSetSimSpeed(spd)}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                    simSpeed === spd ? 'bg-[#B4213A] text-white font-bold' : 'bg-[#132035] text-slate-400'
                  }`}
                >
                  {spd}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Theme and status */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-[10px]">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>NEPSE API Active</span>
          </div>
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg bg-[#132035] hover:bg-[#1C2C45] text-[#DDE4EF] transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-300" />}
          </button>
        </div>

        <div className="text-[10px] leading-tight text-[#5B6D88]">
          KAWACH v2.4 • Kathmandu, Nepal. Model estimates, not investment advice.
        </div>
      </div>
    </aside>
  );
};
