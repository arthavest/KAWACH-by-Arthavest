import React, { useState } from 'react';
import {
  Holding,
  AnalyzedHolding,
  UniverseStock
} from '../../types';
import { UNIVERSE_STOCKS, UNIVERSE_MAP, SECTORS, PRESET_PORTFOLIOS } from '../../data/nepseData';
import { npr, nprF, pc, sg, cls } from '../../utils/format';
import {
  Plus,
  Trash2,
  Upload,
  Download,
  Printer,
  Sparkles,
  BarChart2,
  TrendingUp,
  FileSpreadsheet,
  X,
  Check
} from 'lucide-react';

interface HoldingsViewProps {
  holdings: Holding[];
  analyzedHoldings: AnalyzedHolding[];
  totalValue: number;
  totalBasis: number;
  totalPnl: number;
  taxRate: number;
  onUpdateHolding: (index: number, updated: Partial<Holding>) => void;
  onRemoveHolding: (index: number) => void;
  onAddHolding: (newHolding: Holding) => void;
  onImportHoldings: (holdings: Holding[]) => void;
  onSetTaxRate: (rate: number) => void;
  onSelectStockModal: (stock: UniverseStock) => void;
  onTradeStock: (stock: UniverseStock) => void;
}

export const HoldingsView: React.FC<HoldingsViewProps> = ({
  holdings,
  analyzedHoldings: H,
  totalValue,
  totalBasis,
  totalPnl,
  taxRate,
  onUpdateHolding,
  onRemoveHolding,
  onAddHolding,
  onImportHoldings,
  onSetTaxRate,
  onSelectStockModal,
  onTradeStock
}) => {
  // New holding form state
  const [symInput, setSymInput] = useState('');
  const [qtyInput, setQtyInput] = useState('');
  const [costInput, setCostInput] = useState('');
  const [ltpInput, setLtpInput] = useState('');
  const [sectorInput, setSectorInput] = useState('Commercial Banks');
  const [formErr, setFormErr] = useState('');

  // CSV Import Modal state
  const [showImportModal, setShowImportModal] = useState(false);
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleSymChange = (val: string) => {
    const s = val.trim().toUpperCase();
    setSymInput(s);
    const u = UNIVERSE_MAP[s];
    if (u) {
      setLtpInput(u.price.toString());
      setSectorInput(u.sector);
      if (!costInput) setCostInput(Math.round(u.price * 0.95).toString());
    }
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = symInput.trim().toUpperCase();
    const qty = parseInt(qtyInput, 10);
    const cost = parseFloat(costInput);
    const ltp = parseFloat(ltpInput) || (UNIVERSE_MAP[sym] ? UNIVERSE_MAP[sym].price : 100);

    if (!sym) {
      setFormErr('Stock symbol is required');
      return;
    }
    if (!qty || qty <= 0) {
      setFormErr('Quantity must be greater than 0');
      return;
    }
    if (isNaN(cost) || cost < 0) {
      setFormErr('Valid purchase cost is required');
      return;
    }

    const u = UNIVERSE_MAP[sym];
    const newH: Holding = {
      sym,
      qty,
      cost,
      ltp,
      name: u ? u.name : sym,
      sector: u ? u.sector : sectorInput
    };

    onAddHolding(newH);
    setSymInput('');
    setQtyInput('');
    setCostInput('');
    setLtpInput('');
    setFormErr('');
  };

  const handleCsvImport = () => {
    if (!csvText.trim()) return;

    try {
      const lines = csvText.trim().split('\n');
      const imported: Holding[] = [];

      for (const line of lines) {
        const parts = line.split(/[,\t]+/).map(p => p.trim().replace(/^["']|["']$/g, ''));
        if (parts.length < 2) continue;
        const sym = parts[0].toUpperCase();
        if (sym === 'SYMBOL' || sym === 'SCRIP') continue; // Header

        const qty = parseInt(parts[1], 10);
        const cost = parts[2] ? parseFloat(parts[2]) : UNIVERSE_MAP[sym]?.price || 100;
        const ltp = parts[3] ? parseFloat(parts[3]) : UNIVERSE_MAP[sym]?.price || cost;

        if (sym && !isNaN(qty) && qty > 0) {
          const u = UNIVERSE_MAP[sym];
          imported.push({
            sym,
            qty,
            cost: isNaN(cost) ? 100 : cost,
            ltp: isNaN(ltp) ? cost : ltp,
            name: u?.name || sym,
            sector: u?.sector || 'Others'
          });
        }
      }

      if (imported.length > 0) {
        onImportHoldings(imported);
        setShowImportModal(false);
        setCsvText('');
        setImportStatus(`Successfully imported ${imported.length} holdings!`);
        setTimeout(() => setImportStatus(null), 4000);
      } else {
        setImportStatus('Could not parse any valid holdings. Format: SYMBOL,QTY,COST,LTP');
      }
    } catch {
      setImportStatus('Error parsing CSV. Please check formatting.');
    }
  };

  const exportCsv = () => {
    const header = 'Symbol,Name,Sector,Quantity,AverageCost,LTP,MarketValue,WeightPct,UnrealizedPnL\n';
    const rows = H.map(
      h =>
        `"${h.sym}","${h.name}","${h.sector}",${h.qty},${h.cost},${h.ltp},${h.value},${(h.w * 100).toFixed(2)},${h.pnl}`
    ).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `KAWACH_NEPSE_Portfolio_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalTax = H.reduce((sum, h) => sum + Math.max(0, h.pnl) * taxRate, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top action bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-xs">
        {/* Preset portfolios */}
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Load Template:
          </span>
          <select
            onChange={e => {
              const preset = PRESET_PORTFOLIOS.find(p => p.name === e.target.value);
              if (preset) onImportHoldings(preset.holdings);
            }}
            defaultValue=""
            className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] text-slate-800 dark:text-slate-200"
          >
            <option value="" disabled>
              Select preset portfolio...
            </option>
            {PRESET_PORTFOLIOS.map(p => (
              <option key={p.name} value={p.name}>
                {p.name} ({p.holdings.length} scrips)
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-blue-500" />
            <span>MeroShare / CSV Import</span>
          </button>

          <button
            onClick={exportCsv}
            disabled={H.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-500" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Risk Audit Print</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Holdings Table */}
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 dark:bg-[#0E1726] border-b border-slate-200 dark:border-slate-800 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Scrip & Company</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Quantity</th>
                <th className="py-3 px-3 text-right">WACC Cost (Rs)</th>
                <th className="py-3 px-3 text-right">LTP (Rs)</th>
                <th className="py-3 px-3 text-right">Valuation</th>
                <th className="py-3 px-3 text-right">Weight</th>
                <th className="py-3 px-3 text-right">P&L</th>
                <th className="py-3 px-3 text-right">Est. CGT</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {H.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    No holdings in portfolio. Add scrips below or load a template.
                  </td>
                </tr>
              ) : (
                H.map((h, i) => {
                  const gain = Math.max(0, h.pnl);
                  const estTax = gain * taxRate;
                  const u = UNIVERSE_MAP[h.sym];

                  return (
                    <tr
                      key={h.sym + i}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Scrip Symbol & Name */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => u && onSelectStockModal(u)}
                          className="font-bold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1.5 cursor-pointer text-left"
                        >
                          <span>{h.sym}</span>
                          <BarChart2 className="w-3.5 h-3.5 text-slate-400 hover:text-blue-500" />
                        </button>
                        <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                          {h.name}
                        </div>
                      </td>

                      {/* Sector */}
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400 text-[11px]">
                        {h.sector}
                      </td>

                      {/* Quantity input */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          min="1"
                          value={h.qty}
                          onChange={e =>
                            onUpdateHolding(i, { qty: Math.max(0, parseInt(e.target.value, 10) || 0) })
                          }
                          className="w-20 text-right py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-mono font-medium text-slate-900 dark:text-slate-100"
                        />
                      </td>

                      {/* Cost input */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={h.cost}
                          onChange={e =>
                            onUpdateHolding(i, { cost: Math.max(0, parseFloat(e.target.value) || 0) })
                          }
                          className="w-20 text-right py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-mono font-medium text-slate-900 dark:text-slate-100"
                        />
                      </td>

                      {/* LTP input */}
                      <td className="py-3 px-3 text-right">
                        <input
                          type="number"
                          step="0.1"
                          min="0"
                          value={h.ltp}
                          onChange={e =>
                            onUpdateHolding(i, { ltp: Math.max(0, parseFloat(e.target.value) || 0) })
                          }
                          className="w-20 text-right py-1 px-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-mono font-medium text-slate-900 dark:text-slate-100"
                        />
                      </td>

                      {/* Valuation */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-900 dark:text-slate-100">
                        {nprF(h.value)}
                      </td>

                      {/* Weight */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 dark:text-slate-300">
                        {pc(h.w)}
                      </td>

                      {/* P&L */}
                      <td className={`py-3 px-3 text-right font-mono font-semibold ${cls(h.pnl)}`}>
                        {nprF(h.pnl)}
                        <span className="block text-[10px] font-normal opacity-85">
                          {sg(h.pnlPct, 1)}
                        </span>
                      </td>

                      {/* Estimated Tax */}
                      <td className="py-3 px-3 text-right font-mono text-slate-500">
                        {nprF(estTax)}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {u && (
                            <button
                              onClick={() => onTradeStock(u)}
                              className="p-1 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                              title={`Trade ${h.sym}`}
                            >
                              <TrendingUp className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={() => onRemoveHolding(i)}
                            className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                            title={`Remove ${h.sym}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>

            {/* Total Footer */}
            {H.length > 0 && (
              <tfoot className="bg-slate-50 dark:bg-[#0E1726] border-t border-slate-200 dark:border-slate-800 font-bold text-slate-900 dark:text-slate-100">
                <tr>
                  <td className="py-3 px-4" colSpan={5}>
                    PORTFOLIO TOTALS ({H.length} Securities)
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-sm">
                    {nprF(totalValue)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono">100.0%</td>
                  <td className={`py-3 px-3 text-right font-mono text-sm ${cls(totalPnl)}`}>
                    {nprF(totalPnl)} ({sg(totalBasis ? totalPnl / totalBasis : 0, 1)})
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-slate-500">
                    {nprF(totalTax)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Bottom Section: Add Holding Form & Tax Rate Setting */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        {/* Add Holding Form */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-emerald-500" />
            Add New Security to Portfolio
          </h3>

          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
              {/* Symbol with datalist */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Scrip Symbol</label>
                <input
                  type="text"
                  list="nepse-symbols"
                  value={symInput}
                  onChange={e => handleSymChange(e.target.value)}
                  placeholder="e.g. NABIL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-bold text-slate-900 dark:text-white uppercase"
                />
                <datalist id="nepse-symbols">
                  {UNIVERSE_STOCKS.map(s => (
                    <option key={s.sym} value={s.sym}>
                      {s.name} ({s.sector})
                    </option>
                  ))}
                </datalist>
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={qtyInput}
                  onChange={e => setQtyInput(e.target.value)}
                  placeholder="Shares"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Purchase Cost */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">WACC Cost (Rs)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={costInput}
                  onChange={e => setCostInput(e.target.value)}
                  placeholder="Average"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* LTP */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">LTP (Rs)</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={ltpInput}
                  onChange={e => setLtpInput(e.target.value)}
                  placeholder="Market"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium text-slate-900 dark:text-white"
                />
              </div>

              {/* Sector (if custom) */}
              <div>
                <label className="block text-slate-500 font-medium mb-1">Sector</label>
                <select
                  value={sectorInput}
                  onChange={e => setSectorInput(e.target.value)}
                  className="w-full px-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-medium text-slate-900 dark:text-white"
                >
                  {Object.keys(SECTORS).map(sec => (
                    <option key={sec} value={sec}>
                      {sec}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formErr && <div className="text-xs text-rose-500">{formErr}</div>}

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add Scrip to Console
            </button>
          </form>
        </div>

        {/* Tax Rate & WACC Setting Card */}
        <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs text-xs space-y-4">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">
            Capital Gains Tax Setting
          </h3>
          <p className="text-slate-500 text-[11px]">
            Nepali tax laws impose differential CGT based on holding duration:
          </p>

          <div className="space-y-2">
            {[
              { label: 'Individual Short-Term (< 365 days)', rate: 0.075 },
              { label: 'Individual Long-Term (≥ 365 days)', rate: 0.05 },
              { label: 'Corporate / Institutional', rate: 0.1 }
            ].map(tier => (
              <label
                key={tier.rate}
                className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
              >
                <input
                  type="radio"
                  name="cgt_rate"
                  checked={taxRate === tier.rate}
                  onChange={() => onSetTaxRate(tier.rate)}
                  className="accent-slate-900 dark:accent-slate-100"
                />
                <div className="flex-1">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {tier.label}
                  </div>
                  <div className="text-[10px] text-slate-400">{(tier.rate * 100).toFixed(1)}% on realized gains</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* MeroShare / CSV Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-blue-500" />
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                  Import MeroShare / TMS Portfolio
                </h3>
              </div>
              <button
                onClick={() => setShowImportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Paste CSV data or your MeroShare portfolio export below. Format expected:{' '}
              <code className="bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-[11px]">
                SYMBOL, QUANTITY, COST, [LTP]
              </code>
            </p>

            <textarea
              rows={8}
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              placeholder={`NABIL, 500, 520, 540\nNICA, 800, 420, 430\nUPPER, 1500, 340, 410\nCHCL, 600, 500, 520`}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-[#0E1726] font-mono text-xs text-slate-900 dark:text-white"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleCsvImport}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm cursor-pointer"
              >
                Parse & Import Portfolio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
