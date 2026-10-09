export interface BrokerageCalculation {
  turnover: number;
  brokerCommission: number;
  brokerRatePct: number;
  sebonFee: number;
  dpCharge: number;
  totalGovtFees: number;
  totalCharges: number;
  effectiveCostPct: number;
}

export interface TradePnLBreakdown {
  buyTurnover: number;
  buyCommission: number;
  buySebonFee: number;
  buyTotalCost: number;

  sellTurnover: number;
  sellCommission: number;
  sellSebonFee: number;
  sellDpCharge: number;
  sellNetReceivable: number;

  grossProfit: number;
  capitalGainsTax: number;
  taxRatePct: number;
  netProfit: number;
  netProfitPct: number;
  breakevenPrice: number;
  pointsToBreakeven: number;
}

export function calculateBrokerFee(turnover: number): { fee: number; ratePct: number } {
  if (turnover <= 0) return { fee: 0, ratePct: 0 };

  // Official SEBON slabs
  let rate = 0.0040;
  if (turnover <= 50000) {
    rate = 0.0040;
  } else if (turnover <= 500000) {
    rate = 0.0037;
  } else if (turnover <= 2000000) {
    rate = 0.0034;
  } else if (turnover <= 10000000) {
    rate = 0.0030;
  } else {
    rate = 0.0027;
  }

  const rawFee = turnover * rate;
  const fee = Math.max(10, Math.round(rawFee * 100) / 100);
  return { fee, ratePct: rate * 100 };
}

export function calculateSingleSideCharges(turnover: number, isSell: boolean = false): BrokerageCalculation {
  const { fee: brokerCommission, ratePct: brokerRatePct } = calculateBrokerFee(turnover);
  const sebonFee = Math.round(turnover * 0.00015 * 100) / 100; // 0.015%
  const dpCharge = isSell && turnover > 0 ? 25 : 0; // NPR 25 per scrip on sell

  const totalGovtFees = sebonFee + dpCharge;
  const totalCharges = brokerCommission + totalGovtFees;
  const effectiveCostPct = turnover > 0 ? (totalCharges / turnover) * 100 : 0;

  return {
    turnover,
    brokerCommission,
    brokerRatePct,
    sebonFee,
    dpCharge,
    totalGovtFees,
    totalCharges,
    effectiveCostPct
  };
}

export function calculateTradeBreakdown(
  buyPrice: number,
  sellPrice: number,
  qty: number,
  holdingType: 'short_term' | 'long_term' | 'institutional' = 'short_term'
): TradePnLBreakdown {
  const buyTurnover = buyPrice * qty;
  const buyCharges = calculateSingleSideCharges(buyTurnover, false);
  const buyTotalCost = buyTurnover + buyCharges.totalCharges;

  const sellTurnover = sellPrice * qty;
  const sellCharges = calculateSingleSideCharges(sellTurnover, true);
  const sellNetReceivable = sellTurnover - sellCharges.totalCharges;

  const grossProfit = sellTurnover - buyTurnover - buyCharges.totalCharges - sellCharges.brokerCommission - sellCharges.sebonFee - sellCharges.dpCharge;

  let taxRatePct = 7.5;
  if (holdingType === 'long_term') taxRatePct = 5.0;
  if (holdingType === 'institutional') taxRatePct = 10.0;

  const capitalGainsTax = grossProfit > 0 ? Math.round(grossProfit * (taxRatePct / 100) * 100) / 100 : 0;
  const netProfit = grossProfit - capitalGainsTax;
  const netProfitPct = buyTotalCost > 0 ? (netProfit / buyTotalCost) * 100 : 0;

  // Breakeven price calculation:
  // sellTurnover - sellBrokerFee - sellSebon - 25 = buyTotalCost
  // Since broker rate is ~0.4% and sebon is 0.015%: sellTurnover * (1 - 0.00415) - 25 = buyTotalCost
  const estRate = 0.0040 + 0.00015;
  const breakevenTurnover = (buyTotalCost + 25) / (1 - estRate);
  const breakevenPrice = qty > 0 ? Math.ceil((breakevenTurnover / qty) * 100) / 100 : buyPrice;
  const pointsToBreakeven = Math.max(0, Math.round((breakevenPrice - buyPrice) * 100) / 100);

  return {
    buyTurnover,
    buyCommission: buyCharges.brokerCommission,
    buySebonFee: buyCharges.sebonFee,
    buyTotalCost,

    sellTurnover,
    sellCommission: sellCharges.brokerCommission,
    sellSebonFee: sellCharges.sebonFee,
    sellDpCharge: sellCharges.dpCharge,
    sellNetReceivable,

    grossProfit,
    capitalGainsTax,
    taxRatePct,
    netProfit,
    netProfitPct,
    breakevenPrice,
    pointsToBreakeven
  };
}
