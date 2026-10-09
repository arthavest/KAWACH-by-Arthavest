import React, { useState } from 'react';
import { X, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { UniverseStock, OrderAction, OrderType, TradeOrder } from '../types';
import { calculateSingleSideCharges } from '../services/brokerageCalculator';
import { npr, nprF } from '../utils/format';

interface TradeModalProps {
  stock: UniverseStock | null;
  initialAction?: OrderAction;
  cashBalance: number;
  onClose: () => void;
  onExecuteOrder: (order: TradeOrder) => void;
}

export const TradeModal: React.FC<TradeModalProps> = ({
  stock,
  initialAction = 'BUY',
  cashBalance,
  onClose,
  onExecuteOrder
}) => {
  if (!stock) return null;

  const [action, setAction] = useState<OrderAction>(initialAction);
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [qty, setQty] = useState<number>(100);
  const [price, setPrice] = useState<number>(stock.price);
  const [triggerPrice, setTriggerPrice] = useState<number>(stock.price * 0.95);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const effectivePrice = orderType === 'MARKET' ? stock.price : price;
  const turnover = qty * effectivePrice;
  const charges = calculateSingleSideCharges(turnover, action === 'SELL');
  const totalRequired = action === 'BUY' ? turnover + charges.totalCharges : turnover - charges.totalCharges;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) {
      setErrorMsg('Quantity must be greater than 0');
      return;
    }
    if (action === 'BUY' && totalRequired > cashBalance) {
      setErrorMsg(`Insufficient cash. Required: ${nprF(totalRequired)}, Available: ${nprF(cashBalance)}`);
      return;
    }

    const order: TradeOrder = {
      id: 'ORD-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      sym: stock.sym,
      action,
      type: orderType,
      qty,
      price: effectivePrice,
      triggerPrice: orderType === 'SL_LIMIT' ? triggerPrice : undefined,
      status: 'EXECUTED', // In paper trading simulated mode, immediate execution
      timestamp: Date.now(),
      executedPrice: effectivePrice,
      turnover,
      commission: charges.brokerCommission,
      sebonFee: charges.sebonFee,
      dpCharge: charges.dpCharge,
      totalCost: totalRequired
    };

    onExecuteOrder(order);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#121C2E] border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-[#0E1726]">
          <div className="flex items-center gap-2.5">
            <span
              className={`w-3 h-3 rounded-full ${
                action === 'BUY' ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            <div>
              <div className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{action} {stock.sym}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-sans font-medium">
                  LTP {nprF(stock.price)}
                </span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-sans">{stock.name}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Toggle */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex gap-2">
          <button
            type="button"
            onClick={() => setAction('BUY')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              action === 'BUY'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            BUY (Regular)
          </button>
          <button
            type="button"
            onClick={() => setAction('SELL')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              action === 'SELL'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            SELL (Exit)
          </button>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs font-sans">
          {/* Order Type */}
          <div className="grid grid-cols-3 gap-2">
            {(['LIMIT', 'MARKET', 'SL_LIMIT'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setOrderType(t)}
                className={`py-1.5 px-2 rounded-lg font-medium text-center border transition-all ${
                  orderType === t
                    ? 'border-slate-900 dark:border-slate-300 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                    : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {t === 'SL_LIMIT' ? 'Stop Loss' : t}
              </button>
            ))}
          </div>

          {/* Quantity & Price */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                Quantity (Units)
              </label>
              <input
                type="number"
                min="10"
                step="10"
                value={qty}
                onChange={e => setQty(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-semibold text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                Order Price (NPR)
              </label>
              <input
                type="number"
                disabled={orderType === 'MARKET'}
                step="0.5"
                value={orderType === 'MARKET' ? stock.price : price}
                onChange={e => setPrice(parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-semibold text-slate-900 dark:text-white ${
                  orderType === 'MARKET' ? 'opacity-60 cursor-not-allowed' : ''
                }`}
              />
            </div>
          </div>

          {orderType === 'SL_LIMIT' && (
            <div>
              <label className="block text-slate-500 dark:text-slate-400 font-medium mb-1">
                Trigger Price (NPR)
              </label>
              <input
                type="number"
                step="0.5"
                value={triggerPrice}
                onChange={e => setTriggerPrice(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0E1726] font-semibold text-slate-900 dark:text-white"
              />
            </div>
          )}

          {/* Radical Cost Transparency Breakdown Box */}
          <div className="bg-slate-50 dark:bg-[#0E1726] border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 space-y-1.5 text-[11px]">
            <div className="flex justify-between text-slate-500">
              <span>Gross Turnover:</span>
              <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                {nprF(turnover)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>Broker Commission ({charges.brokerRatePct.toFixed(2)}%):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                Rs {charges.brokerCommission.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-slate-500">
              <span>SEBON Fee (0.015%):</span>
              <span className="font-mono text-slate-700 dark:text-slate-300">
                Rs {charges.sebonFee.toFixed(2)}
              </span>
            </div>
            {action === 'SELL' && (
              <div className="flex justify-between text-slate-500">
                <span>DP Charge (CDSC):</span>
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  Rs 25.00
                </span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between font-semibold text-slate-900 dark:text-slate-100 text-xs">
              <span>{action === 'BUY' ? 'Total Required' : 'Net Receivable'}:</span>
              <span className="font-mono text-sm">
                {nprF(totalRequired)}
              </span>
            </div>
          </div>

          {/* Cash balance check */}
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Paper Trading Balance:</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {nprF(cashBalance)}
            </span>
          </div>

          {errorMsg && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-none" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider text-white shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ${
              action === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            <span>Confirm {action} Order</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
