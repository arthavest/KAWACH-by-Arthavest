import React from 'react';
import { BookOpen, CheckCircle2, ShieldCheck, Sigma } from 'lucide-react';

export const MethodView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl animate-in fade-in duration-200 text-xs">
      {/* Intro */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-[11px]">
          <BookOpen className="w-4 h-4" />
          <span>Mathematical & Risk Modeling Methodology</span>
        </div>
        <h2 className="font-serif text-2xl font-bold text-slate-900 dark:text-slate-100">
          How Kawach Computes Every Figure
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm">
          Unlike global risk systems trimmed down for emerging markets, Kawach was built from the ground up specifically for the structural idiosyncrasies of the Nepal Stock Exchange (NEPSE) — accounting for sector concentration, liquidity tiers, currency peg stability, and regulatory limits.
        </p>
      </div>

      {/* Formulas List */}
      <div className="space-y-6">
        {/* 1. Value at Risk (VaR) */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            1. Parametric Value at Risk (VaR)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            One-day 95% Parametric VaR represents the threshold loss that the portfolio is expected to exceed on only 5 out of every 100 trading sessions:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-center font-bold text-sm text-slate-800 dark:text-slate-200">
            VaR_α = Z_α × σ_daily × V
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            Where <i>V</i> is total portfolio market value, <i>Z_0.95 = 1.64485</i> (or <i>2.32635</i> for 99%), and <i>σ_daily = σ_annual / √240</i>, reflecting the empirical 240 trading sessions in Nepal's Sunday–Thursday calendar.
          </p>
        </div>

        {/* 2. Expected Shortfall / CVaR */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            2. Expected Shortfall / Conditional VaR (CVaR)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            VaR answers "how bad do things get before tail events start?" while CVaR answers "if the worst 5% happens, what is the expected average loss?":
          </p>
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-center font-bold text-sm text-slate-800 dark:text-slate-200">
            CVaR_α = [ φ(Z_α) / (1 - α) ] × σ_daily × V
          </div>
          <p className="text-slate-500 text-[11px] leading-relaxed">
            For 95% confidence, the tail multiplier evaluates to <i>2.0627</i>, providing a realistic estimate of loss depth during systemic liquidity squeezes.
          </p>
        </div>

        {/* 3. Covariance Matrix & Correlation Model */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            3. NEPSE Sector Correlation Model
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Covariance between security <i>i</i> and <i>j</i> is calculated via:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-center font-bold text-sm text-slate-800 dark:text-slate-200">
            Cov(i, j) = ρ(i, j) × σ_i × σ_j
          </div>
          <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-[11px] list-disc list-inside">
            <li><b>ρ = 1.00</b> for the same stock.</li>
            <li><b>ρ = 0.75</b> for stocks within the same sector (e.g., two commercial banks or two hydropower companies).</li>
            <li><b>ρ = 0.55</b> for stocks across related financial groups (Banks, Insurance, Microfinance, Finance).</li>
            <li><b>ρ = 0.45</b> for cross-asset diversification across non-financial and financial sectors.</li>
          </ul>
        </div>

        {/* 4. Monte Carlo Simulation Engine */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            4. Cholesky Monte Carlo Simulation
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To simulate 2,000 multi-asset correlated price paths over a 21-day holding horizon, the covariance matrix <b>Σ</b> is decomposed via lower-triangular Cholesky factorization:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-center font-bold text-sm text-slate-800 dark:text-slate-200">
            Σ = L · L^T  →  r_sim = L · z
          </div>
          <p className="text-slate-500 text-[11px]">
            Where <i>z ~ N(0, I)</i> are independent Gaussian draws from the Mulberry32 PRNG via Box-Muller transformation.
          </p>
        </div>

        {/* 5. Effective Number of Holdings */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            5. Effective Holdings Diversification (Eff. N)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Holding 20 stocks where one stock comprises 80% is not real diversification. We compute the inverse Herfindahl-Hirschman index:
          </p>
          <div className="p-3 bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800 rounded-xl font-mono text-center font-bold text-sm text-slate-800 dark:text-slate-200">
            N_eff = 1 / ( Σ w_i^2 )
          </div>
        </div>

        {/* 6. Kawach Protection Score */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-3">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            6. Kawach Shield Composite Score (0 - 100)
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            The composite score evaluates 4 pillars with 25% equal weighting:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-medium text-slate-700 dark:text-slate-300">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <b>Diversification (25%)</b>
              <div className="text-slate-400 text-[10px]">Eff N relative to threshold</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <b>Volatility Control (25%)</b>
              <div className="text-slate-400 text-[10px]">Annual vol relative to 25% target</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <b>Concentration (25%)</b>
              <div className="text-slate-400 text-[10px]">Top-3 holdings exposure</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-[#0E1726] border border-slate-100 dark:border-slate-800">
              <b>Beta Alignment (25%)</b>
              <div className="text-slate-400 text-[10px]">Deviation from NEPSE index beta</div>
            </div>
          </div>
          <p className="text-slate-500 text-[11px]">
            Any regulatory breaches (Single stock &gt; 12%, Sector &gt; 35%) incur automatic 12-point deductions from the final score.
          </p>
        </div>
      </div>
    </div>
  );
};
