import { ScreenerSignal, ConfluenceEvaluation } from '../types';
import { UNIVERSE_STOCKS, SECTORS } from '../data/nepseData';

function strHash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateStockSeries(sym: string, days: number = 260): number[] {
  const stock = UNIVERSE_STOCKS.find(s => s.sym === sym);
  const price = stock ? stock.price : 400;
  const sector = stock ? stock.sector : 'Commercial Banks';
  const sectMeta = SECTORS[sector] || SECTORS['Others'];
  const dailySig = sectMeta.vol / Math.sqrt(240);
  const rng = mulberry(strHash(sym) ^ 0x9e3779b9);

  const path: number[] = [100];
  for (let i = 1; i < days; i++) {
    const u1 = Math.max(rng(), 1e-12);
    const u2 = rng();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    const ret = z * dailySig - 0.5 * dailySig * dailySig;
    path.push(path[i - 1] * Math.exp(ret));
  }

  const scale = price / path[days - 1];
  return path.map(p => Math.round(p * scale * 10) / 10);
}

export function calculateEma(series: number[], period: number = 200): (number | null)[] {
  const k = 2 / (period + 1);
  if (series.length < period) return new Array(series.length).fill(null);

  let sma = 0;
  for (let i = 0; i < period; i++) sma += series[i];
  sma /= period;

  const out: (number | null)[] = new Array(series.length).fill(null);
  out[period - 1] = sma;

  for (let i = period; i < series.length; i++) {
    out[i] = series[i] * k + (out[i - 1] as number) * (1 - k);
  }

  return out;
}

export function detectCrossover(series: number[], ema: (number | null)[], lookback: number = 10): { type: 'buy' | 'sell'; idx: number; ago: number } | null {
  const n = series.length;
  for (let i = n - 1; i >= Math.max(200, n - lookback); i--) {
    if (ema[i] == null || ema[i - 1] == null) continue;
    const now = series[i] - (ema[i] as number);
    const prev = series[i - 1] - (ema[i - 1] as number);

    if (prev <= 0 && now > 0) return { type: 'buy', idx: i, ago: n - 1 - i };
    if (prev >= 0 && now < 0) return { type: 'sell', idx: i, ago: n - 1 - i };
  }
  return null;
}

export function getScreenerSignals(): ScreenerSignal[] {
  const days = 260;
  const list: ScreenerSignal[] = [];

  for (const stock of UNIVERSE_STOCKS) {
    const series = generateStockSeries(stock.sym, days);
    const ema = calculateEma(series, 200);
    const cross = detectCrossover(series, ema, 14);

    const latestEma = ema[days - 1] || stock.price;
    const diffPct = Math.round(((stock.price - latestEma) / latestEma) * 1000) / 10;
    const sparkline = series.slice(-30);
    const volumeSurge = Math.round((stock.volume / (stock.volume * 0.72 + 1000)) * 10) / 10;

    if (cross) {
      list.push({
        sym: stock.sym,
        name: stock.name,
        sector: stock.sector,
        price: stock.price,
        ema: Math.round(latestEma * 10) / 10,
        diffPct,
        type: cross.type,
        ago: cross.ago,
        sparkline,
        volumeSurge
      });
    }
  }

  return list.sort((a, b) => a.ago - b.ago);
}

export function evaluateConfluence(params: {
  symbol: string;
  cmp: number;
  ema20?: number;
  ema50?: number;
  marketTrend: 'Bullish' | 'Neutral' | 'Bearish';
  sectorTrend: 'Bullish' | 'Neutral' | 'Bearish';
  marketStructure: 'higher_highs' | 'consolidation' | 'lower_lows';
  rsi: number;
  macdCross: 'bull' | 'bear' | 'neutral';
  volumeRatio: number; // e.g. 1.8x average volume
  brokerAccumulation: boolean;
  nearSupport: boolean;
  supportLevel?: number;
  resistanceLevel?: number;
}): ConfluenceEvaluation {
  const {
    symbol,
    cmp,
    ema20,
    ema50,
    marketTrend,
    sectorTrend,
    marketStructure,
    rsi,
    macdCross,
    volumeRatio,
    brokerAccumulation,
    nearSupport,
    supportLevel,
    resistanceLevel
  } = params;

  let score = 0;
  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. Trend & Structure (Max 3 pts)
  if (marketStructure === 'higher_highs') {
    score += 1.5;
    reasons.push('Bullish market structure: Higher Highs & Higher Lows confirmed.');
  } else if (marketStructure === 'lower_lows') {
    warnings.push('Bearish market structure: Lower Lows sequence.');
  }

  const emaOk = (ema20 == null || cmp > ema20) && (ema50 == null || cmp > ema50);
  if (emaOk) {
    score += 1.5;
    reasons.push('Price is trading above key moving averages (20 EMA & 50 EMA).');
  } else {
    warnings.push('Price is trading below short-term moving averages.');
  }

  // 2. Macro Alignment (Max 2 pts)
  if (marketTrend === 'Bullish') {
    score += 1;
    reasons.push('NEPSE composite benchmark is in an uptrend.');
  } else if (marketTrend === 'Bearish') {
    warnings.push('Broader NEPSE composite trend is Bearish.');
  }

  if (sectorTrend === 'Bullish') {
    score += 1;
    reasons.push('Sector index provides tailwind momentum.');
  } else if (sectorTrend === 'Bearish') {
    warnings.push('Sector index is lagging.');
  }

  // 3. Key Levels & Support (Max 2 pts)
  if (nearSupport) {
    score += 2;
    reasons.push('Confluence at major historical demand zone / dynamic support.');
  }

  // 4. Volume & Smart Money (Max 1.5 pts)
  if (volumeRatio >= 1.5) {
    score += 1;
    reasons.push(`Strong institutional breakout volume (${volumeRatio.toFixed(1)}x of 20-day average).`);
  }
  if (brokerAccumulation) {
    score += 0.5;
    reasons.push('Floor sheet analysis shows top 5 broker net accumulation.');
  }

  // 5. Momentum Indicators (Max 1.5 pts)
  if (rsi >= 50 && rsi <= 68) {
    score += 0.75;
    reasons.push(`Healthy bullish momentum (RSI ${rsi.toFixed(0)} with room before overbought).`);
  } else if (rsi > 75) {
    warnings.push(`RSI is overbought (${rsi.toFixed(0)}), risk of pull-back.`);
  } else if (rsi < 40) {
    warnings.push(`RSI is weak (${rsi.toFixed(0)}).`);
  }

  if (macdCross === 'bull') {
    score += 0.75;
    reasons.push('MACD histogram printed a fresh bullish cross above zero line.');
  }

  const finalScore = Math.min(10, Math.round(score * 10) / 10);

  let action: ConfluenceEvaluation['action'] = 'NEUTRAL';
  if (finalScore >= 8.0) action = 'STRONG BUY';
  else if (finalScore >= 6.5) action = 'BUY';
  else if (finalScore <= 3.5) action = 'AVOID';
  else if (finalScore <= 5.0) action = 'NEUTRAL';

  // Calculate trade plan levels
  const supp = supportLevel || Math.round(cmp * 0.94);
  const stopLoss = Math.round((supp - (cmp - supp) * 0.25) * 10) / 10;
  const riskAmount = Math.max(1, cmp - stopLoss);

  const target1 = Math.round((cmp + riskAmount * 2.0) * 10) / 10;
  const target2 = resistanceLevel || Math.round((cmp + riskAmount * 3.5) * 10) / 10;
  const riskReward = Math.round(((target1 - cmp) / riskAmount) * 10) / 10;

  return {
    symbol,
    cmp,
    score: finalScore,
    action,
    riskReward,
    entry: cmp,
    target1,
    target2,
    stopLoss,
    reasons,
    warnings
  };
}
