export interface Holding {
  sym: string;
  qty: number;
  cost: number;
  ltp: number;
  name?: string;
  sector?: string;
  purchaseDate?: string;
}

export interface AnalyzedHolding extends Holding {
  name: string;
  sector: string;
  value: number;
  basis: number;
  pnl: number;
  pnlPct: number;
  w: number; // portfolio weight
  vol: number; // annual volatility
  beta: number;
  rc: number; // percentage risk contribution
  mvar: number; // marginal VaR
}

export interface SectorMeta {
  vol: number;
  beta: number;
  ref: number; // Reference index benchmark weight
  g: 'F' | 'N'; // Financial or Non-financial sector group
}

export interface RiskLimits {
  stock: number; // e.g. 0.12 (12%)
  sector: number; // e.g. 0.35 (35%)
  top3: number; // e.g. 0.45 (45%)
  var: number; // e.g. 0.03 (3% 1-day VaR)
}

export interface KawachScore {
  total: number;
  parts: [string, number][]; // [name, score]
  penalties: number;
  breachesCount: number;
}

export interface MonteCarloResult {
  q05: number;
  q50: number;
  q95: number;
  samples: number[];
  bins: { x: number; count: number }[];
}

export interface RiskAlert {
  kind: 'watch' | 'crit' | 'ok';
  t: string;
  d: string;
}

export interface AnalysisResult {
  H: AnalyzedHolding[];
  V: number;
  basis: number;
  pnl: number;
  empty: boolean;
  score: KawachScore;
  alerts: RiskAlert[];
  var95: number; // 1-day 95% Parametric VaR in NPR
  var99: number; // 1-day 99% Parametric VaR in NPR
  cvar95: number; // 1-day 95% Expected Shortfall (CVaR) in NPR
  cvar99: number; // 1-day 99% Expected Shortfall (CVaR) in NPR
  divBenefit: number; // Undiversified risk minus Portfolio risk
  beta: number;
  volA: number;
  effN: number;
  secMap: Record<string, number>;
  top3Weight: number;
  maxStockWeight: number;
  maxSectorWeight: number;
  mc?: MonteCarloResult;
}

export interface UniverseStock {
  sym: string;
  name: string;
  sector: string;
  price: number;
  prevClose: number;
  change: number;
  pChange: number;
  high52: number;
  low52: number;
  volume: number;
  turnover: number;
  marketCap: number; // NPR in Crores
  eps: number;
  pe: number;
  pb: number;
  divYield: number;
  beta: number;
  volatility: number;
  ema200: number;
  sharesOutstanding: number; // in Units
}

export interface MarketIndex {
  name: string;
  value: number;
  change: number;
  pChange: number;
}

export interface MarketState {
  isOpen: boolean;
  session: 'Pre-Open' | 'Continuous' | 'Closed';
  index: number;
  change: number;
  pct: number;
  turnover: number; // NPR
  totalVolume: number;
  transactions: number;
  advances: number;
  declines: number;
  unchanged: number;
  timestamp: string;
  subIndices: MarketIndex[];
  source: 'live' | 'simulated';
}

export interface OrderBookEntry {
  orders: number;
  qty: number;
  price: number;
}

export interface MarketDepth {
  bids: OrderBookEntry[];
  asks: OrderBookEntry[];
  totalBidQty: number;
  totalAskQty: number;
}

export type OrderType = 'LIMIT' | 'MARKET' | 'SL_LIMIT';
export type OrderAction = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'EXECUTED' | 'CANCELLED';

export interface TradeOrder {
  id: string;
  sym: string;
  action: OrderAction;
  type: OrderType;
  qty: number;
  price: number;
  triggerPrice?: number;
  status: OrderStatus;
  timestamp: number;
  executedPrice?: number;
  turnover: number;
  commission: number;
  sebonFee: number;
  dpCharge: number;
  totalCost: number;
}

export interface StressScenario {
  id: string;
  name: string;
  d: string;
  historical?: string;
  fn?: (h: AnalyzedHolding) => number;
  map?: Record<string, number>;
}

export interface ScreenerSignal {
  sym: string;
  name: string;
  sector: string;
  price: number;
  ema: number;
  diffPct: number;
  type: 'buy' | 'sell';
  ago: number;
  sparkline: number[];
  volumeSurge: number;
}

export interface ConfluenceEvaluation {
  symbol: string;
  cmp: number;
  score: number; // 0 to 10
  action: 'STRONG BUY' | 'BUY' | 'NEUTRAL' | 'SELL' | 'AVOID';
  riskReward: number;
  entry: number;
  target1: number;
  target2: number;
  stopLoss: number;
  reasons: string[];
  warnings: string[];
}

export interface EtfConstituent {
  sym: string;
  name: string;
  sector: string;
  sharesInBasket: number;
  price: number;
  marketValue: number;
  weight: number;
  cappedWeight: number;
}

export interface KycProfile {
  fullName: string;
  email: string;
  phone: string;
  boid: string; // 16-digit Beneficiary Owner ID
  dmatProvider: string;
  citizenshipNo: string;
  bankName: string;
  bankAccountNo: string;
  isVerified: boolean;
  investorType: 'Individual' | 'Institutional' | 'NRN';
  riskProfile: 'Conservative' | 'Moderate' | 'Aggressive';
}
