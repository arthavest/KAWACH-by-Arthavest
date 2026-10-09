import React, { useState } from 'react';
import {
  Holding,
  RiskLimits,
  UniverseStock,
  TradeOrder,
  OrderAction,
  KycProfile,
  MarketState,
  AnalysisResult
} from '../types';
import { NavigationRail, ViewKey } from '../components/NavigationRail';
import { MarketTape } from '../components/MarketTape';
import { StockDetailModal } from '../components/StockDetailModal';
import { TradeModal } from '../components/TradeModal';

import { OverviewView } from '../components/views/OverviewView';
import { HoldingsView } from '../components/views/HoldingsView';
import { TradingView } from '../components/views/TradingView';
import { RiskView } from '../components/views/RiskView';
import { StressView } from '../components/views/StressView';
import { MarketView } from '../components/views/MarketView';
import { TechnicalScreenerView } from '../components/views/TechnicalScreenerView';
import { Ath50EtfView } from '../components/views/Ath50EtfView';
import { GoldAndReitView } from '../components/views/GoldAndReitView';
import { BrokerageCalcView } from '../components/views/BrokerageCalcView';
import { KycProfileView } from '../components/views/KycProfileView';
import { MethodView } from '../components/views/MethodView';
import { AboutView } from '../components/views/AboutView';

export interface TerminalConsoleFeatureProps {
  currentView: ViewKey;
  onSelectView: (v: ViewKey) => void;
  marketState: MarketState;
  analysis: AnalysisResult;
  holdings: Holding[];
  limits: RiskLimits;
  taxRate: number;
  cashBalance: number;
  orders: TradeOrder[];
  profile: KycProfile;
  allStocks: UniverseStock[];
  simSpeed: number;
  isSimActive: boolean;
  isDark: boolean;
  onToggleTheme: () => void;
  onSetSimSpeed: (speed: number) => void;
  onToggleSim: () => void;
  onUpdateHolding: (idx: number, updated: Partial<Holding>) => void;
  onRemoveHolding: (idx: number) => void;
  onAddHolding: (h: Holding) => void;
  onImportHoldings: (h: Holding[]) => void;
  onSetTaxRate: (rate: number) => void;
  onUpdateLimit: (k: keyof RiskLimits, val: number) => void;
  onExecuteOrder: (order: TradeOrder) => void;
  onResetCash: () => void;
  onUpdateProfile: (u: Partial<KycProfile>) => void;
  onReturnToWebsite?: () => void;
}

const VIEW_TITLES: Record<ViewKey, [string, string]> = {
  overview: [
    'Portfolio Protection Console',
    'How well is your capital protected, and what vulnerabilities need immediate attention.'
  ],
  holdings: [
    'Holdings & WACC Registry',
    'Live positions, Weighted Average Cost of Capital, and real-time capital gains tax estimation.'
  ],
  trading: [
    'NEPSE Live Order Terminal',
    'Zerodha-style paper trading, 5-level market depth, and instant order execution.'
  ],
  risk: [
    'KAWACH by Arthavest',
    'Parametric VaR, Expected Shortfall (CVaR), Cholesky Monte Carlo, and correlation heatmaps.'
  ],
  stress: [
    'Historical Shocks & Stress Tests',
    'Simulate earthquakes, margin lending caps, liquidity freezes, and custom sector shocks in rupees.'
  ],
  market: [
    'NEPSE Market Dashboard & Macro',
    'All 12 sector sub-indices, Nepal Rastra Bank monetary indicators, and circuit breaker norms.'
  ],
  screener: [
    'Technical Screener & Confluence',
    '200-day EMA Golden Cross scanner and multi-timeframe algorithmic confluence evaluator.'
  ],
  ath50: [
    'Nepal Top-50 ETF (ATH50)',
    'Radical 0.25% low-cost index investing across NEPSE blue-chips with systematic SIP compounder.'
  ],
  gold_reit: [
    'ARTHAGOLD & ARTHAREIT Funds',
    'Physically vaulted 24K gold bullion ETF and commercial real estate income trust with 8.4% yield.'
  ],
  brokerage: [
    'Radical Cost Transparency Calculator',
    'Exact rupee breakdown of SEBON commission slabs, SEBON fees, DP charges, and breakeven exits.'
  ],
  kyc: [
    'Investor KYC & Profile',
    'SEBON-compliant investor verification, 16-digit CDSC BOID, and risk profiling.'
  ],
  method: [
    'Mathematical Methodology',
    'Transparent formulas: Parametric VaR, Box-Muller normal transforms, and Herfindahl diversification.'
  ],
  about: [
    'About ARTHAVEST INVESTMENT',
    'Institutional capital management firm based in Kathmandu, Nepal.'
  ]
};

export const TerminalConsoleFeature: React.FC<TerminalConsoleFeatureProps> = ({
  currentView,
  onSelectView,
  marketState,
  analysis,
  holdings,
  limits,
  taxRate,
  cashBalance,
  orders,
  profile,
  allStocks,
  simSpeed,
  isSimActive,
  isDark,
  onToggleTheme,
  onSetSimSpeed,
  onToggleSim,
  onUpdateHolding,
  onRemoveHolding,
  onAddHolding,
  onImportHoldings,
  onSetTaxRate,
  onUpdateLimit,
  onExecuteOrder,
  onResetCash,
  onUpdateProfile,
  onReturnToWebsite
}) => {
  const [selectedStockForModal, setSelectedStockForModal] = useState<UniverseStock | null>(null);
  const [tradeModalStock, setTradeModalStock] = useState<UniverseStock | null>(null);
  const [tradeAction, setTradeAction] = useState<OrderAction>('BUY');

  const handleOpenTrade = (stock: UniverseStock, action: OrderAction = 'BUY') => {
    setTradeModalStock(stock);
    setTradeAction(action);
  };

  const [pageTitle, pageSubtitle] = VIEW_TITLES[currentView];

  return (
    <div className="flex min-h-[calc(100vh-38px)] bg-[#F2F4F8] dark:bg-[#0A111E] text-[#101B2D] dark:text-[#E8ECF3] transition-colors">
      {/* 1. Desktop Sticky Navigation Rail */}
      <div className="hidden lg:block sticky top-[38px] h-[calc(100vh-38px)] flex-none">
        <NavigationRail
          currentView={currentView}
          onSelectView={onSelectView}
          isDark={isDark}
          onToggleTheme={onToggleTheme}
          simSpeed={simSpeed}
          onSetSimSpeed={onSetSimSpeed}
          isSimActive={isSimActive}
          onToggleSim={onToggleSim}
        />
      </div>

      {/* 2. Main Console Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Navigation Header */}
        <div className="lg:hidden bg-[#0B1424] text-white p-4 border-b border-[#1B283D] flex items-center justify-between sticky top-[38px] z-40">
          <div className="flex items-center gap-2">
            <svg className="w-7 h-9 flex-none" viewBox="0 0 200 240">
              <path d="M100 8 L184 38 V112 C184 172 148 212 100 232 C52 212 16 172 16 112 V38 Z" fill="#B4213A" />
              <path d="M100 46 L100 196 M100 46 L152 68 V112 C152 150 128 178 100 192" fill="none" stroke="#fff" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" opacity=".92" />
            </svg>
            <span className="font-serif font-bold text-lg">KAWACH CONSOLE</span>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={currentView}
              onChange={e => onSelectView(e.target.value as ViewKey)}
              className="bg-[#142137] text-xs font-semibold py-1 px-2.5 rounded-lg border border-[#253856] text-white"
            >
              <option value="overview">Overview</option>
              <option value="holdings">Holdings & WACC</option>
              <option value="trading">NEPSE Trading</option>
              <option value="risk">KAWACH by Arthavest</option>
              <option value="stress">Stress Tests</option>
              <option value="market">Nepal Market</option>
              <option value="screener">Technical Screener</option>
              <option value="ath50">Nepal Top-50 ETF</option>
              <option value="gold_reit">Gold ETF & REIT</option>
              <option value="brokerage">Brokerage Calculator</option>
              <option value="kyc">Investor KYC</option>
              <option value="method">Methodology</option>
              <option value="about">About Arthavest</option>
            </select>
          </div>
        </div>

        {/* View Container */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
          <MarketTape
            title={pageTitle}
            subtitle={pageSubtitle}
            marketState={marketState}
          />

          {currentView === 'overview' && (
            <OverviewView
              analysis={analysis}
              limits={limits}
              onNavigate={onSelectView}
              onOpenTrade={() => onSelectView('trading')}
            />
          )}

          {currentView === 'holdings' && (
            <HoldingsView
              holdings={holdings}
              analyzedHoldings={analysis.H}
              totalValue={analysis.V}
              totalBasis={analysis.basis}
              totalPnl={analysis.pnl}
              taxRate={taxRate}
              onUpdateHolding={onUpdateHolding}
              onRemoveHolding={onRemoveHolding}
              onAddHolding={onAddHolding}
              onImportHoldings={onImportHoldings}
              onSetTaxRate={onSetTaxRate}
              onSelectStockModal={setSelectedStockForModal}
              onTradeStock={s => handleOpenTrade(s, 'BUY')}
            />
          )}

          {currentView === 'trading' && (
            <TradingView
              allStocks={allStocks}
              orders={orders}
              cashBalance={cashBalance}
              onResetCash={onResetCash}
              onOpenTradeModal={handleOpenTrade}
              onSelectStockModal={setSelectedStockForModal}
            />
          )}

          {currentView === 'risk' && (
            <RiskView
              analysis={analysis}
              limits={limits}
              onUpdateLimit={onUpdateLimit}
            />
          )}

          {currentView === 'stress' && <StressView analysis={analysis} />}

          {currentView === 'market' && (
            <MarketView marketState={marketState} analysis={analysis} />
          )}

          {currentView === 'screener' && (
            <TechnicalScreenerView
              onSelectStockModal={setSelectedStockForModal}
              onTradeStock={s => handleOpenTrade(s, 'BUY')}
            />
          )}

          {currentView === 'ath50' && <Ath50EtfView />}

          {currentView === 'gold_reit' && <GoldAndReitView />}

          {currentView === 'brokerage' && <BrokerageCalcView />}

          {currentView === 'kyc' && (
            <KycProfileView
              profile={profile}
              onUpdateProfile={onUpdateProfile}
            />
          )}

          {currentView === 'method' && <MethodView />}

          {currentView === 'about' && <AboutView />}

          {/* Footer */}
          <footer className="mt-16 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row justify-between items-center gap-3">
            <div>
              <b>KAWACH (कवच)</b> by ARTHAVEST INVESTMENT PRIVATE LIMITED. Kathmandu, Nepal.
            </div>
            {onReturnToWebsite && (
              <button
                onClick={onReturnToWebsite}
                className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline font-semibold"
              >
                Return to ATH Capital Public Website →
              </button>
            )}
          </footer>
        </main>
      </div>

      {/* Stock Detail Modal */}
      {selectedStockForModal && (
        <StockDetailModal
          stock={selectedStockForModal}
          onClose={() => setSelectedStockForModal(null)}
          onTrade={(s, action) => {
            setSelectedStockForModal(null);
            handleOpenTrade(s, action);
          }}
        />
      )}

      {/* Order Entry Modal */}
      {tradeModalStock && (
        <TradeModal
          stock={tradeModalStock}
          initialAction={tradeAction}
          cashBalance={cashBalance}
          onClose={() => setTradeModalStock(null)}
          onExecuteOrder={onExecuteOrder}
        />
      )}
    </div>
  );
};
