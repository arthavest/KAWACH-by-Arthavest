import { MarketState, MarketDepth, UniverseStock } from '../types';
import { UNIVERSE_STOCKS } from '../data/nepseData';

const BASE_NEPSE_INDEX = 2684.52;
const BASE_TURNOVER = 4852300000; // ~4.85 Arba

export class MarketFeedService {
  private static instance: MarketFeedService;
  private state: MarketState;
  private stocksMap: Map<string, UniverseStock>;
  private listeners: Set<(state: MarketState) => void> = new Set();
  private timer: number | null = null;
  private isSimulationActive: boolean = true;
  private simSpeed: number = 1; // 1x, 2x, 5x

  private constructor() {
    this.stocksMap = new Map();
    UNIVERSE_STOCKS.forEach(s => this.stocksMap.set(s.sym, { ...s }));

    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // NEPSE trading hours: Sunday (0) to Thursday (4), 11:00 AM to 3:00 PM
    const isTradingDay = day >= 0 && day <= 4;
    const isTradingHours = (hour === 11 && minute >= 0) || (hour > 11 && hour < 15);
    const isPreOpen = isTradingDay && hour === 10 && minute >= 30;

    const session = isPreOpen ? 'Pre-Open' : isTradingHours ? 'Continuous' : 'Closed';
    const isOpen = isTradingHours || isPreOpen;

    this.state = {
      isOpen,
      session,
      index: BASE_NEPSE_INDEX,
      change: 18.42,
      pct: 0.0069,
      turnover: BASE_TURNOVER,
      totalVolume: 12450800,
      transactions: 68420,
      advances: 148,
      declines: 84,
      unchanged: 12,
      timestamp: now.toLocaleTimeString('en-US', { hour12: false }) + ' NPT',
      subIndices: [
        { name: 'Banking', value: 1540.22, change: 12.4, pChange: 0.81 },
        { name: 'Development Banks', value: 4850.12, change: 48.6, pChange: 1.01 },
        { name: 'Finance', value: 2950.40, change: 35.2, pChange: 1.21 },
        { name: 'Hotels & Tourism', value: 5890.30, change: 74.5, pChange: 1.28 },
        { name: 'Hydropower', value: 3120.80, change: -18.4, pChange: -0.59 },
        { name: 'Investment', value: 112.50, change: 1.2, pChange: 1.08 },
        { name: 'Life Insurance', value: 12480.90, change: 135.0, pChange: 1.09 },
        { name: 'Manufacturing', value: 7240.10, change: 42.0, pChange: 0.58 },
        { name: 'Microfinance', value: 5120.40, change: 58.2, pChange: 1.15 },
        { name: 'Non-Life Insurance', value: 11840.20, change: 110.5, pChange: 0.94 },
        { name: 'Others', value: 1890.60, change: 14.8, pChange: 0.79 },
        { name: 'Trading', value: 3640.20, change: 45.1, pChange: 1.25 }
      ],
      source: 'simulated'
    };

    this.tryFetchYonepse();
    this.startSimulation();
  }

  public static getInstance(): MarketFeedService {
    if (!MarketFeedService.instance) {
      MarketFeedService.instance = new MarketFeedService();
    }
    return MarketFeedService.instance;
  }

  public getState(): MarketState {
    return { ...this.state };
  }

  public getStock(sym: string): UniverseStock | undefined {
    return this.stocksMap.get(sym);
  }

  public getAllStocks(): UniverseStock[] {
    return Array.from(this.stocksMap.values());
  }

  public subscribe(cb: (state: MarketState) => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  public setSimSpeed(speed: number) {
    this.simSpeed = speed;
    this.restartSimulation();
  }

  public getSimSpeed(): number {
    return this.simSpeed;
  }

  public toggleSimulation(active?: boolean) {
    this.isSimulationActive = active !== undefined ? active : !this.isSimulationActive;
    if (this.isSimulationActive) {
      this.startSimulation();
    } else if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  public getMarketDepth(sym: string): MarketDepth {
    const stock = this.stocksMap.get(sym);
    const ltp = stock ? stock.price : 500;
    const spread = Math.max(0.5, Math.round(ltp * 0.002 * 10) / 10);

    const bids = [
      { orders: 3, qty: 1200, price: Math.round((ltp - spread * 1) * 10) / 10 },
      { orders: 5, qty: 3400, price: Math.round((ltp - spread * 2) * 10) / 10 },
      { orders: 8, qty: 6500, price: Math.round((ltp - spread * 3) * 10) / 10 },
      { orders: 12, qty: 11200, price: Math.round((ltp - spread * 4) * 10) / 10 },
      { orders: 15, qty: 18400, price: Math.round((ltp - spread * 5) * 10) / 10 }
    ];

    const asks = [
      { orders: 2, qty: 1100, price: Math.round((ltp + spread * 1) * 10) / 10 },
      { orders: 6, qty: 4200, price: Math.round((ltp + spread * 2) * 10) / 10 },
      { orders: 9, qty: 7800, price: Math.round((ltp + spread * 3) * 10) / 10 },
      { orders: 11, qty: 12500, price: Math.round((ltp + spread * 4) * 10) / 10 },
      { orders: 14, qty: 16900, price: Math.round((ltp + spread * 5) * 10) / 10 }
    ];

    return {
      bids,
      asks,
      totalBidQty: bids.reduce((a, b) => a + b.qty, 0),
      totalAskQty: asks.reduce((a, b) => a + b.qty, 0)
    };
  }

  private async tryFetchYonepse() {
    try {
      const ctl = new AbortController();
      const to = setTimeout(() => ctl.abort(), 4000);
      const res = await fetch('https://shubhamnpk.github.io/yonepse/data/summary.json', {
        signal: ctl.signal,
        cache: 'no-store'
      });
      clearTimeout(to);
      if (res.ok) {
        const data = await res.json();
        if (data && data.index) {
          this.state.index = data.index;
          this.state.change = data.pointChange || this.state.change;
          this.state.pct = (data.percentageChange || 0) / 100;
          this.state.turnover = data.turnover || this.state.turnover;
          this.state.source = 'live';
          this.notify();
        }
      }
    } catch {
      // Fallback silently to realistic live simulation
    }
  }

  private startSimulation() {
    if (this.timer) clearInterval(this.timer);
    const intervalMs = Math.max(800, Math.round(2500 / this.simSpeed));

    this.timer = window.setInterval(() => {
      if (!this.isSimulationActive) return;

      // Small Brownian tick on index
      const delta = (Math.random() - 0.48) * 0.85;
      this.state.index = Math.round((this.state.index + delta) * 100) / 100;
      this.state.change = Math.round((this.state.change + delta) * 100) / 100;
      this.state.pct = Math.round((this.state.change / (this.state.index - this.state.change)) * 10000) / 10000;
      this.state.turnover += Math.floor(Math.random() * 850000);
      this.state.totalVolume += Math.floor(Math.random() * 1800);
      this.state.transactions += Math.floor(Math.random() * 12);

      const now = new Date();
      this.state.timestamp = now.toLocaleTimeString('en-US', { hour12: false }) + ' NPT';

      // Pick 2-3 random stocks to update tick
      const stocks = Array.from(this.stocksMap.values());
      const pickCount = Math.min(3, stocks.length);
      for (let i = 0; i < pickCount; i++) {
        const target = stocks[Math.floor(Math.random() * stocks.length)];
        const step = target.price > 1000 ? 5 : target.price > 300 ? 1 : 0.5;
        const tickDir = Math.random() > 0.49 ? 1 : -1;
        const newPrice = Math.max(10, Math.round((target.price + tickDir * step) * 10) / 10);
        target.price = newPrice;
        target.change = Math.round((newPrice - target.prevClose) * 10) / 10;
        target.pChange = Math.round((target.change / target.prevClose) * 10000) / 100;
        target.volume += Math.floor(Math.random() * 200 + 10);
        target.turnover += newPrice * 100;
        this.stocksMap.set(target.sym, { ...target });
      }

      this.notify();
    }, intervalMs);
  }

  private restartSimulation() {
    this.startSimulation();
  }

  private notify() {
    const s = this.getState();
    this.listeners.forEach(cb => cb(s));
  }
}
