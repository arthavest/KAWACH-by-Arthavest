import { Holding, AnalyzedHolding, RiskLimits, AnalysisResult, KawachScore, RiskAlert, MonteCarloResult } from '../types';
import { SECTORS, UNIVERSE_MAP } from '../data/nepseData';

const DAYS = 240; // NEPSE trading days per year

export function metaHolding(h: Holding) {
  const u = UNIVERSE_MAP[h.sym];
  return {
    name: u ? u.name : h.name || h.sym,
    sector: u ? u.sector : h.sector && SECTORS[h.sector] ? h.sector : 'Others',
    ltp: h.ltp || (u ? u.price : 100)
  };
}

export function rho(a: { sym: string; sector: string }, b: { sym: string; sector: string }): number {
  if (a.sym === b.sym) return 1.0;
  if (a.sector === b.sector) return 0.75;
  const sA = SECTORS[a.sector] || SECTORS['Others'];
  const sB = SECTORS[b.sector] || SECTORS['Others'];
  return sA.g === sB.g ? 0.55 : 0.45;
}

// PRNG for deterministic, reproducible Monte Carlo runs
function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Cholesky decomposition L L^T = Sigma
function cholesky(A: number[][]): number[][] {
  const n = A.length;
  const L: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j <= i; j++) {
      let sum = 0;
      for (let k = 0; k < j; k++) sum += L[i][k] * L[j][k];
      if (i === j) {
        const val = A[i][i] - sum;
        L[i][j] = Math.sqrt(Math.max(val, 1e-10));
      } else {
        L[i][j] = (A[i][j] - sum) / (L[j][j] || 1e-5);
      }
    }
  }
  return L;
}

export function runMonteCarlo(
  H: AnalyzedHolding[],
  V: number,
  covDaily: number[][],
  days: number = 21,
  runs: number = 2000
): MonteCarloResult {
  const n = H.length;
  if (n === 0 || V <= 0) {
    return { q05: 0, q50: 0, q95: 0, samples: [], bins: [] };
  }

  // Scale cov to horizon
  const covT: number[][] = covDaily.map(row => row.map(v => v * days));
  const L = cholesky(covT);
  const rng = mulberry32(1337);

  const samples: number[] = new Array(runs);
  const z: number[] = new Array(n);

  for (let r = 0; r < runs; r++) {
    // Generate standard normal variates (Box-Muller)
    for (let i = 0; i < n; i += 2) {
      const u1 = Math.max(rng(), 1e-12);
      const u2 = rng();
      const mag = Math.sqrt(-2.0 * Math.log(u1));
      z[i] = mag * Math.cos(2.0 * Math.PI * u2);
      if (i + 1 < n) z[i + 1] = mag * Math.sin(2.0 * Math.PI * u2);
    }

    // Multiply L * z to get correlated returns
    let portRet = 0;
    for (let i = 0; i < n; i++) {
      let ri = 0;
      for (let k = 0; k <= i; k++) ri += L[i][k] * z[k];
      portRet += H[i].w * ri;
    }
    samples[r] = portRet * V;
  }

  samples.sort((a, b) => a - b);
  const q05 = samples[Math.floor(runs * 0.05)];
  const q50 = samples[Math.floor(runs * 0.50)];
  const q95 = samples[Math.floor(runs * 0.95)];

  // Create 15 histogram bins
  const min = samples[0];
  const max = samples[runs - 1];
  const binWidth = (max - min) / 15 || 1;
  const bins: { x: number; count: number }[] = Array.from({ length: 15 }, (_, i) => ({
    x: min + (i + 0.5) * binWidth,
    count: 0
  }));

  for (let r = 0; r < runs; r++) {
    const idx = Math.min(14, Math.max(0, Math.floor((samples[r] - min) / binWidth)));
    bins[idx].count++;
  }

  return { q05, q50, q95, samples, bins };
}

export function analyzePortfolio(holdings: Holding[], limits: RiskLimits): AnalysisResult {
  const H: AnalyzedHolding[] = holdings.map(h => {
    const m = metaHolding(h);
    const sMeta = SECTORS[m.sector] || SECTORS['Others'];
    const qty = Math.max(0, +h.qty || 0);
    const cost = Math.max(0, +h.cost || 0);
    const ltp = Math.max(0, +h.ltp || m.ltp);
    const val = qty * ltp;
    const basis = qty * cost;
    const pnl = val - basis;
    const pnlPct = basis > 0 ? pnl / basis : 0;

    return {
      sym: h.sym.toUpperCase(),
      name: m.name,
      sector: m.sector,
      qty,
      cost,
      ltp,
      value: val,
      basis,
      pnl,
      pnlPct,
      w: 0,
      vol: sMeta.vol,
      beta: sMeta.beta,
      rc: 0,
      mvar: 0
    };
  });

  const V = H.reduce((sum, h) => sum + h.value, 0);
  const basis = H.reduce((sum, h) => sum + h.basis, 0);
  const pnl = V - basis;

  if (H.length === 0 || V <= 0) {
    return {
      H,
      V: 0,
      basis: 0,
      pnl: 0,
      empty: true,
      score: { total: 0, parts: [], penalties: 0, breachesCount: 0 },
      alerts: [{ kind: 'watch', t: 'Portfolio is empty', d: 'Add your holdings to calculate risk metrics.' }],
      var95: 0,
      var99: 0,
      cvar95: 0,
      cvar99: 0,
      divBenefit: 0,
      beta: 1.0,
      volA: 0.28,
      effN: 0,
      secMap: {},
      top3Weight: 0,
      maxStockWeight: 0,
      maxSectorWeight: 0
    };
  }

  // Calculate weights
  H.forEach(h => {
    h.w = h.value / V;
  });

  const n = H.length;
  const covDaily: number[][] = [];
  for (let i = 0; i < n; i++) {
    covDaily.push([]);
    const volD_i = H[i].vol / Math.sqrt(DAYS);
    for (let j = 0; j < n; j++) {
      const volD_j = H[j].vol / Math.sqrt(DAYS);
      covDaily[i][j] = rho(H[i], H[j]) * volD_i * volD_j;
    }
  }

  // Portfolio daily variance and vol
  const sW: number[] = covDaily.map(row => row.reduce((acc, c, j) => acc + c * H[j].w, 0));
  const varD = H.reduce((acc, h, i) => acc + h.w * sW[i], 0);
  const volD = Math.sqrt(Math.max(varD, 1e-12));
  const volA = volD * Math.sqrt(DAYS);

  // Risk Contribution (RC%) and Marginal VaR (mvar)
  H.forEach((h, i) => {
    // marginal variance d(varD)/d(w_i) = 2 * sW[i]
    // marginal volatility = sW[i] / volD
    const marginalVol = sW[i] / volD;
    h.rc = varD > 0 ? (h.w * sW[i]) / varD : h.w;
    h.mvar = 1.64485 * marginalVol * V;
  });

  // Parametric Value at Risk (1-day, 95% = 1.645, 99% = 2.326)
  const var95 = 1.64485 * volD * V;
  const var99 = 2.32635 * volD * V;

  // Expected Shortfall (CVaR) for normal distribution:
  // ES_alpha = (phi(z_alpha) / (1 - alpha)) * volD * V
  // For 95%: phi(1.64485) = 0.10313 -> ES = (0.10313 / 0.05) = 2.0627 * volD * V
  // For 99%: phi(2.32635) = 0.02665 -> ES = (0.02665 / 0.01) = 2.665 * volD * V
  const cvar95 = 2.0627 * volD * V;
  const cvar99 = 2.6652 * volD * V;

  // Undiversified VaR
  const undivVar95 = H.reduce((sum, h) => sum + 1.64485 * (h.vol / Math.sqrt(DAYS)) * h.value, 0);
  const divBenefit = Math.max(0, undivVar95 - var95);

  // Portfolio Beta
  const beta = H.reduce((acc, h) => acc + h.w * h.beta, 0);

  // Effective N (Herfindahl-Hirschman index inverse)
  const hhi = H.reduce((acc, h) => acc + h.w * h.w, 0);
  const effN = hhi > 0 ? 1 / hhi : 1;

  // Sector breakdown
  const secMap: Record<string, number> = {};
  H.forEach(h => {
    secMap[h.sector] = (secMap[h.sector] || 0) + h.w;
  });

  const sortedByWeight = [...H].sort((a, b) => b.w - a.w);
  const top3Weight = sortedByWeight.slice(0, 3).reduce((acc, h) => acc + h.w, 0);
  const maxStockWeight = sortedByWeight[0]?.w || 0;
  const maxSectorWeight = Math.max(...Object.values(secMap), 0);

  // Alerts
  const alerts: RiskAlert[] = [];
  if (maxStockWeight > limits.stock) {
    const top = sortedByWeight[0];
    alerts.push({
      kind: 'crit',
      t: `Single Stock Limit Breached: ${top.sym} (${(top.w * 100).toFixed(1)}%)`,
      d: `Exceeds your ${(limits.stock * 100).toFixed(0)}% single scrip ceiling. Trim position to reduce idiosyncratic risk.`
    });
  }

  for (const [sec, wt] of Object.entries(secMap)) {
    if (wt > limits.sector) {
      alerts.push({
        kind: 'crit',
        t: `Sector Concentration Breached: ${sec} (${(wt * 100).toFixed(1)}%)`,
        d: `Exceeds your ${(limits.sector * 100).toFixed(0)}% limit. NEPSE sector shocks will have an oversized impact.`
      });
    }
  }

  if (top3Weight > limits.top3) {
    alerts.push({
      kind: 'watch',
      t: `Top-3 Concentration Breached (${(top3Weight * 100).toFixed(1)}%)`,
      d: `Top three positions make up over ${(limits.top3 * 100).toFixed(0)}% of your capital.`
    });
  }

  if (var95 / V > limits.var) {
    alerts.push({
      kind: 'watch',
      t: `Daily VaR Ceiling Breached (${((var95 / V) * 100).toFixed(2)}%)`,
      d: `One-day 95% potential loss exceeds your ${(limits.var * 100).toFixed(1)}% threshold.`
    });
  }

  // Calculate Kawach Score (0 - 100)
  // 1. Diversification (Eff N / 10 capped at 100): 25%
  const divScore = Math.min(100, (effN / 8) * 100);
  // 2. Volatility (ideal <= 25% annual): 25%
  const volScore = Math.max(0, Math.min(100, ((0.38 - volA) / 0.18) * 100));
  // 3. Concentration (Top 3 <= 40%): 25%
  const concScore = Math.max(0, Math.min(100, ((0.65 - top3Weight) / 0.35) * 100));
  // 4. Beta & Sector Balance: 25%
  const betaDev = Math.abs(beta - 1.0);
  const betaScore = Math.max(0, Math.min(100, (1.0 - betaDev * 1.5) * 100));

  const baseScore = 0.25 * divScore + 0.25 * volScore + 0.25 * concScore + 0.25 * betaScore;
  const penalties = alerts.filter(a => a.kind === 'crit').length * 12 + alerts.filter(a => a.kind === 'watch').length * 5;
  const totalScore = Math.max(10, Math.min(99, Math.round(baseScore - penalties)));

  const score: KawachScore = {
    total: totalScore,
    parts: [
      ['Diversification', Math.round(divScore)],
      ['Volatility control', Math.round(volScore)],
      ['Concentration risk', Math.round(concScore)],
      ['Benchmark alignment', Math.round(betaScore)]
    ],
    penalties,
    breachesCount: alerts.length
  };

  const mc = runMonteCarlo(H, V, covDaily);

  return {
    H,
    V,
    basis,
    pnl,
    empty: false,
    score,
    alerts,
    var95,
    var99,
    cvar95,
    cvar99,
    divBenefit,
    beta,
    volA,
    effN,
    secMap,
    top3Weight,
    maxStockWeight,
    maxSectorWeight,
    mc
  };
}
