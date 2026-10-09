import { SectorMeta, UniverseStock, StressScenario, Holding, EtfConstituent } from '../types';

export const SECTORS: Record<string, SectorMeta> = {
  'Commercial Banks': { vol: 0.27, beta: 1.05, ref: 0.29, g: 'F' },
  'Development Banks': { vol: 0.34, beta: 1.10, ref: 0.03, g: 'F' },
  'Finance': { vol: 0.36, beta: 1.15, ref: 0.01, g: 'F' },
  'Microfinance': { vol: 0.38, beta: 1.15, ref: 0.04, g: 'F' },
  'Life Insurance': { vol: 0.32, beta: 1.10, ref: 0.07, g: 'F' },
  'Non-Life Insurance': { vol: 0.32, beta: 0.95, ref: 0.02, g: 'F' },
  'Investment': { vol: 0.30, beta: 1.00, ref: 0.09, g: 'F' },
  'Hydropower': { vol: 0.36, beta: 1.10, ref: 0.13, g: 'N' },
  'Hotels & Tourism': { vol: 0.32, beta: 0.90, ref: 0.02, g: 'N' },
  'Manufacturing': { vol: 0.30, beta: 0.85, ref: 0.06, g: 'N' },
  'Trading': { vol: 0.28, beta: 0.90, ref: 0.01, g: 'N' },
  'Others': { vol: 0.25, beta: 0.70, ref: 0.11, g: 'N' }
};

export const SECTOR_NAMES = Object.keys(SECTORS);

export const UNIVERSE_STOCKS: UniverseStock[] = [
  // Commercial Banks
  { sym: 'NABIL', name: 'Nabil Bank Limited', sector: 'Commercial Banks', price: 520, prevClose: 516, change: 4, pChange: 0.78, high52: 630, low52: 440, volume: 48500, turnover: 25220000, marketCap: 14100, eps: 26.4, pe: 19.7, pb: 1.95, divYield: 2.1, beta: 1.05, volatility: 0.26, ema200: 508, sharesOutstanding: 270569965 },
  { sym: 'NICA', name: 'NIC Asia Bank Limited', sector: 'Commercial Banks', price: 430, prevClose: 436, change: -6, pChange: -1.38, high52: 820, low52: 395, volume: 82300, turnover: 35389000, marketCap: 6420, eps: 18.2, pe: 23.6, pb: 1.62, divYield: 1.2, beta: 1.12, volatility: 0.31, ema200: 452, sharesOutstanding: 149175669 },
  { sym: 'SCBL', name: 'Standard Chartered Bank Nepal', sector: 'Commercial Banks', price: 560, prevClose: 554, change: 6, pChange: 1.08, high52: 640, low52: 480, volume: 22100, turnover: 12376000, marketCap: 5280, eps: 35.8, pe: 15.6, pb: 2.34, divYield: 3.4, beta: 0.94, volatility: 0.22, ema200: 545, sharesOutstanding: 94294540 },
  { sym: 'GBIME', name: 'Global IME Bank Limited', sector: 'Commercial Banks', price: 210, prevClose: 208, change: 2, pChange: 0.96, high52: 245, low52: 178, volume: 94000, turnover: 19740000, marketCap: 7590, eps: 14.5, pe: 14.5, pb: 1.28, divYield: 1.8, beta: 1.04, volatility: 0.25, ema200: 202, sharesOutstanding: 361287400 },
  { sym: 'EBL', name: 'Everest Bank Limited', sector: 'Commercial Banks', price: 640, prevClose: 632, change: 8, pChange: 1.27, high52: 710, low52: 510, volume: 31200, turnover: 19968000, marketCap: 7510, eps: 32.1, pe: 19.9, pb: 2.12, divYield: 2.6, beta: 0.98, volatility: 0.24, ema200: 615, sharesOutstanding: 117366300 },
  { sym: 'SANIMA', name: 'Sanima Bank Limited', sector: 'Commercial Banks', price: 300, prevClose: 298, change: 2, pChange: 0.67, high52: 340, low52: 245, volume: 38400, turnover: 11520000, marketCap: 4070, eps: 19.3, pe: 15.5, pb: 1.48, divYield: 2.2, beta: 1.02, volatility: 0.25, ema200: 288, sharesOutstanding: 135815200 },
  { sym: 'ADBL', name: 'Agricultural Development Bank', sector: 'Commercial Banks', price: 340, prevClose: 342, change: -2, pChange: -0.58, high52: 390, low52: 280, volume: 29500, turnover: 10030000, marketCap: 4620, eps: 18.7, pe: 18.2, pb: 1.35, divYield: 1.5, beta: 1.06, volatility: 0.28, ema200: 332, sharesOutstanding: 135894100 },
  { sym: 'PRVU', name: 'Prabhu Bank Limited', sector: 'Commercial Banks', price: 182, prevClose: 180, change: 2, pChange: 1.11, high52: 215, low52: 152, volume: 65000, turnover: 11830000, marketCap: 4280, eps: 11.2, pe: 16.3, pb: 1.15, divYield: 1.0, beta: 1.08, volatility: 0.27, ema200: 175, sharesOutstanding: 235160000 },
  { sym: 'PCBL', name: 'Prime Commercial Bank', sector: 'Commercial Banks', price: 235, prevClose: 233, change: 2, pChange: 0.86, high52: 270, low52: 190, volume: 54000, turnover: 12690000, marketCap: 4560, eps: 15.8, pe: 14.9, pb: 1.22, divYield: 1.7, beta: 1.05, volatility: 0.26, ema200: 228, sharesOutstanding: 194025000 },
  { sym: 'SBI', name: 'Nepal SBI Bank Limited', sector: 'Commercial Banks', price: 345, prevClose: 342, change: 3, pChange: 0.88, high52: 385, low52: 295, volume: 18900, turnover: 6520500, marketCap: 3640, eps: 21.0, pe: 16.4, pb: 1.55, divYield: 2.0, beta: 0.95, volatility: 0.23, ema200: 338, sharesOutstanding: 105560000 },
  { sym: 'KBL', name: 'Kumari Bank Limited', sector: 'Commercial Banks', price: 175, prevClose: 173, change: 2, pChange: 1.16, high52: 210, low52: 145, volume: 72000, turnover: 12600000, marketCap: 4590, eps: 10.4, pe: 16.8, pb: 1.08, divYield: 0.8, beta: 1.10, volatility: 0.28, ema200: 168, sharesOutstanding: 262250000 },
  { sym: 'NMB', name: 'NMB Bank Limited', sector: 'Commercial Banks', price: 230, prevClose: 228, change: 2, pChange: 0.88, high52: 280, low52: 195, volume: 46000, turnover: 10580000, marketCap: 4220, eps: 16.1, pe: 14.3, pb: 1.30, divYield: 2.0, beta: 1.02, volatility: 0.26, ema200: 224, sharesOutstanding: 183667000 },

  // Hydropower
  { sym: 'UPPER', name: 'Upper Tamakoshi Hydropower', sector: 'Hydropower', price: 410, prevClose: 418, change: -8, pChange: -1.91, high52: 560, low52: 280, volume: 135000, turnover: 55350000, marketCap: 8640, eps: 8.5, pe: 48.2, pb: 2.15, divYield: 0.0, beta: 1.25, volatility: 0.42, ema200: 388, sharesOutstanding: 210900000 },
  { sym: 'CHCL', name: 'Chilime Hydropower Co.', sector: 'Hydropower', price: 520, prevClose: 512, change: 8, pChange: 1.56, high52: 610, low52: 440, volume: 48000, turnover: 24960000, marketCap: 3950, eps: 21.2, pe: 24.5, pb: 2.05, divYield: 2.8, beta: 1.08, volatility: 0.32, ema200: 504, sharesOutstanding: 75980000 },
  { sym: 'NHPC', name: 'National Hydro Power Company', sector: 'Hydropower', price: 215, prevClose: 218, change: -3, pChange: -1.38, high52: 280, low52: 140, volume: 92000, turnover: 19780000, marketCap: 520, eps: 5.2, pe: 41.3, pb: 1.82, divYield: 0.0, beta: 1.28, volatility: 0.45, ema200: 198, sharesOutstanding: 24200000 },
  { sym: 'AKPL', name: 'Arun Kabeli Power Limited', sector: 'Hydropower', price: 300, prevClose: 295, change: 5, pChange: 1.69, high52: 380, low52: 220, volume: 64000, turnover: 19200000, marketCap: 590, eps: 12.4, pe: 24.2, pb: 2.10, divYield: 1.5, beta: 1.18, volatility: 0.38, ema200: 285, sharesOutstanding: 19800000 },
  { sym: 'BPCL', name: 'Butwal Power Company Limited', sector: 'Hydropower', price: 550, prevClose: 542, change: 8, pChange: 1.48, high52: 620, low52: 460, volume: 28000, turnover: 15400000, marketCap: 1870, eps: 24.8, pe: 22.2, pb: 1.85, divYield: 2.5, beta: 0.95, volatility: 0.28, ema200: 532, sharesOutstanding: 34000000 },
  { sym: 'SHPC', name: 'Sanima Mai Hydropower', sector: 'Hydropower', price: 390, prevClose: 385, change: 5, pChange: 1.30, high52: 460, low52: 320, volume: 41000, turnover: 15990000, marketCap: 1240, eps: 18.5, pe: 21.1, pb: 1.95, divYield: 2.2, beta: 1.05, volatility: 0.33, ema200: 375, sharesOutstanding: 31800000 },
  { sym: 'HDHPC', name: 'Himal Dolakha Hydropower', sector: 'Hydropower', price: 162, prevClose: 165, change: -3, pChange: -1.82, high52: 220, low52: 120, volume: 88000, turnover: 14256000, marketCap: 450, eps: 4.8, pe: 33.8, pb: 1.45, divYield: 0.0, beta: 1.35, volatility: 0.48, ema200: 155, sharesOutstanding: 27800000 },
  { sym: 'RHPL', name: 'Rasuwagadhi Hydropower', sector: 'Hydropower', price: 375, prevClose: 370, change: 5, pChange: 1.35, high52: 440, low52: 290, volume: 55000, turnover: 20625000, marketCap: 2560, eps: 11.0, pe: 34.1, pb: 2.20, divYield: 0.0, beta: 1.20, volatility: 0.39, ema200: 355, sharesOutstanding: 68420000 },

  // Life Insurance
  { sym: 'NLIC', name: 'Nepal Life Insurance Company', sector: 'Life Insurance', price: 700, prevClose: 690, change: 10, pChange: 1.45, high52: 840, low52: 560, volume: 38000, turnover: 26600000, marketCap: 5740, eps: 28.5, pe: 24.6, pb: 2.45, divYield: 2.1, beta: 1.10, volatility: 0.32, ema200: 672, sharesOutstanding: 82079000 },
  { sym: 'LICN', name: 'Life Insurance Corp. Nepal', sector: 'Life Insurance', price: 800, prevClose: 792, change: 8, pChange: 1.01, high52: 980, low52: 680, volume: 16500, turnover: 13200000, marketCap: 2120, eps: 31.0, pe: 25.8, pb: 2.80, divYield: 1.8, beta: 1.08, volatility: 0.31, ema200: 780, sharesOutstanding: 26530000 },
  { sym: 'ALICL', name: 'Asian Life Insurance Company', sector: 'Life Insurance', price: 500, prevClose: 495, change: 5, pChange: 1.01, high52: 610, low52: 410, volume: 22000, turnover: 11000000, marketCap: 1570, eps: 21.4, pe: 23.4, pb: 2.10, divYield: 1.9, beta: 1.05, volatility: 0.33, ema200: 488, sharesOutstanding: 31550000 },
  { sym: 'RNLI', name: 'Reliable Nepal Life Insurance', sector: 'Life Insurance', price: 535, prevClose: 530, change: 5, pChange: 0.94, high52: 620, low52: 440, volume: 27000, turnover: 14445000, marketCap: 2140, eps: 22.8, pe: 23.5, pb: 2.25, divYield: 1.6, beta: 1.06, volatility: 0.32, ema200: 512, sharesOutstanding: 40000000 },

  // Non-Life Insurance
  { sym: 'NICL', name: 'Nepal Insurance Company', sector: 'Non-Life Insurance', price: 780, prevClose: 770, change: 10, pChange: 1.30, high52: 920, low52: 630, volume: 18000, turnover: 14040000, marketCap: 1200, eps: 34.2, pe: 22.8, pb: 2.40, divYield: 2.2, beta: 0.95, volatility: 0.30, ema200: 745, sharesOutstanding: 15400000 },
  { sym: 'SICL', name: 'Shikhar Insurance Co. Ltd.', sector: 'Non-Life Insurance', price: 500, prevClose: 494, change: 6, pChange: 1.21, high52: 620, low52: 410, volume: 24000, turnover: 12000000, marketCap: 1320, eps: 24.5, pe: 20.4, pb: 2.15, divYield: 2.4, beta: 0.92, volatility: 0.29, ema200: 482, sharesOutstanding: 26500000 },
  { sym: 'NLG', name: 'NLG Insurance Company', sector: 'Non-Life Insurance', price: 680, prevClose: 672, change: 8, pChange: 1.19, high52: 790, low52: 540, volume: 16000, turnover: 10880000, marketCap: 990, eps: 27.0, pe: 25.2, pb: 2.30, divYield: 2.0, beta: 0.94, volatility: 0.31, ema200: 655, sharesOutstanding: 14590000 },

  // Microfinance
  { sym: 'CBBL', name: 'Chhimek Laghubitta Bittiya Sanstha', sector: 'Microfinance', price: 1400, prevClose: 1380, change: 20, pChange: 1.45, high52: 1650, low52: 1080, volume: 12500, turnover: 17500000, marketCap: 4160, eps: 65.4, pe: 21.4, pb: 3.80, divYield: 3.2, beta: 1.15, volatility: 0.36, ema200: 1320, sharesOutstanding: 29700000 },
  { sym: 'SKBBL', name: 'Sana Kisan Bikas Laghubitta', sector: 'Microfinance', price: 1100, prevClose: 1085, change: 15, pChange: 1.38, high52: 1320, low52: 890, volume: 15000, turnover: 16500000, marketCap: 3660, eps: 52.8, pe: 20.8, pb: 3.25, divYield: 2.9, beta: 1.12, volatility: 0.35, ema200: 1045, sharesOutstanding: 33300000 },
  { sym: 'MLBSL', name: 'Mahila Laghubitta Bittiya Sanstha', sector: 'Microfinance', price: 2150, prevClose: 2120, change: 30, pChange: 1.42, high52: 2700, low52: 1650, volume: 8200, turnover: 17630000, marketCap: 780, eps: 78.0, pe: 27.6, pb: 5.10, divYield: 2.5, beta: 1.25, volatility: 0.44, ema200: 2040, sharesOutstanding: 3650000 },

  // Development Banks
  { sym: 'MNBBL', name: 'Muktinath Bikas Bank', sector: 'Development Banks', price: 800, prevClose: 790, change: 10, pChange: 1.27, high52: 920, low52: 610, volume: 32000, turnover: 25600000, marketCap: 5620, eps: 32.5, pe: 24.6, pb: 2.55, divYield: 2.0, beta: 1.10, volatility: 0.33, ema200: 765, sharesOutstanding: 70460000 },
  { sym: 'GBBL', name: 'Garima Bikas Bank', sector: 'Development Banks', price: 780, prevClose: 772, change: 8, pChange: 1.04, high52: 890, low52: 590, volume: 29000, turnover: 22620000, marketCap: 4420, eps: 30.1, pe: 25.9, pb: 2.45, divYield: 1.9, beta: 1.09, volatility: 0.32, ema200: 742, sharesOutstanding: 56760000 },
  { sym: 'SHINE', name: 'Shine Resunga Development Bank', sector: 'Development Banks', price: 440, prevClose: 435, change: 5, pChange: 1.15, high52: 510, low52: 340, volume: 34000, turnover: 14960000, marketCap: 2100, eps: 21.0, pe: 21.0, pb: 2.05, divYield: 2.2, beta: 1.06, volatility: 0.31, ema200: 422, sharesOutstanding: 47730000 },

  // Finance
  { sym: 'GFCL', name: 'Goodwill Finance Limited', sector: 'Finance', price: 400, prevClose: 395, change: 5, pChange: 1.27, high52: 520, low52: 290, volume: 21000, turnover: 8400000, marketCap: 410, eps: 16.5, pe: 24.2, pb: 1.95, divYield: 1.5, beta: 1.16, volatility: 0.37, ema200: 382, sharesOutstanding: 10250000 },
  { sym: 'CFCL', name: 'Central Finance Limited', sector: 'Finance', price: 340, prevClose: 344, change: -4, pChange: -1.16, high52: 440, low52: 240, volume: 18000, turnover: 6120000, marketCap: 320, eps: 14.0, pe: 24.3, pb: 1.80, divYield: 1.2, beta: 1.18, volatility: 0.38, ema200: 328, sharesOutstanding: 9480000 },

  // Hotels & Tourism
  { sym: 'SHL', name: 'Soaltee Hotel Limited', sector: 'Hotels & Tourism', price: 460, prevClose: 452, change: 8, pChange: 1.77, high52: 560, low52: 360, volume: 51000, turnover: 23460000, marketCap: 4250, eps: 23.4, pe: 19.7, pb: 3.40, divYield: 3.5, beta: 0.92, volatility: 0.31, ema200: 438, sharesOutstanding: 92430000 },
  { sym: 'TRH', name: 'Taragaon Regency Hotel (Hyatt)', sector: 'Hotels & Tourism', price: 350, prevClose: 345, change: 5, pChange: 1.45, high52: 440, low52: 270, volume: 26000, turnover: 9100000, marketCap: 680, eps: 17.8, pe: 19.7, pb: 2.80, divYield: 2.8, beta: 0.88, volatility: 0.30, ema200: 335, sharesOutstanding: 19600000 },
  { sym: 'CITY', name: 'City Hotel Limited', sector: 'Hotels & Tourism', price: 295, prevClose: 292, change: 3, pChange: 1.03, high52: 380, low52: 210, volume: 22000, turnover: 6490000, marketCap: 490, eps: 12.0, pe: 24.6, pb: 2.20, divYield: 0.0, beta: 0.95, volatility: 0.34, ema200: 280, sharesOutstanding: 16740000 },

  // Manufacturing
  { sym: 'HDL', name: 'Himalayan Distillery Limited', sector: 'Manufacturing', price: 2000, prevClose: 1980, change: 20, pChange: 1.01, high52: 2750, low52: 1540, volume: 14000, turnover: 28000000, marketCap: 5340, eps: 68.5, pe: 29.2, pb: 4.80, divYield: 2.5, beta: 0.88, volatility: 0.31, ema200: 1920, sharesOutstanding: 26700000 },
  { sym: 'SHIVM', name: 'Shivam Cements Limited', sector: 'Manufacturing', price: 420, prevClose: 425, change: -5, pChange: -1.18, high52: 590, low52: 370, volume: 78000, turnover: 32760000, marketCap: 2270, eps: 14.2, pe: 29.6, pb: 2.30, divYield: 1.0, beta: 1.15, volatility: 0.36, ema200: 445, sharesOutstanding: 54100000 },
  { sym: 'UNL', name: 'Unilever Nepal Limited', sector: 'Manufacturing', price: 22000, prevClose: 21800, change: 200, pChange: 0.92, high52: 26000, low52: 18000, volume: 450, turnover: 9900000, marketCap: 2020, eps: 980.0, pe: 22.4, pb: 8.90, divYield: 4.2, beta: 0.65, volatility: 0.20, ema200: 21400, sharesOutstanding: 920000 },
  { sym: 'SONA', name: 'Sonapur Minerals & Oil', sector: 'Manufacturing', price: 380, prevClose: 376, change: 4, pChange: 1.06, high52: 510, low52: 290, volume: 48000, turnover: 18240000, marketCap: 1170, eps: 12.8, pe: 29.7, pb: 2.10, divYield: 0.0, beta: 1.18, volatility: 0.38, ema200: 365, sharesOutstanding: 30800000 },

  // Trading
  { sym: 'STC', name: 'Salt Trading Corporation', sector: 'Trading', price: 3800, prevClose: 3750, change: 50, pChange: 1.33, high52: 4600, low52: 2900, volume: 3200, turnover: 12160000, marketCap: 1060, eps: 110.0, pe: 34.5, pb: 4.10, divYield: 1.5, beta: 0.90, volatility: 0.28, ema200: 3680, sharesOutstanding: 2790000 },

  // Investment
  { sym: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment', price: 2300, prevClose: 2280, change: 20, pChange: 0.88, high52: 2700, low52: 1980, volume: 9200, turnover: 21160000, marketCap: 12200, eps: 68.0, pe: 33.8, pb: 3.90, divYield: 1.8, beta: 0.95, volatility: 0.26, ema200: 2240, sharesOutstanding: 53130000 },
  { sym: 'HIDCL', name: 'Hydroelectricity Investment & Dev.', sector: 'Investment', price: 430, prevClose: 425, change: 5, pChange: 1.18, high52: 520, low52: 340, volume: 95000, turnover: 40850000, marketCap: 10200, eps: 15.2, pe: 28.3, pb: 1.85, divYield: 1.2, beta: 1.12, volatility: 0.34, ema200: 412, sharesOutstanding: 237700000 },
  { sym: 'NRN', name: 'NRN Infrastructure & Dev.', sector: 'Investment', price: 610, prevClose: 602, change: 8, pChange: 1.33, high52: 740, low52: 450, volume: 38000, turnover: 23180000, marketCap: 750, eps: 21.0, pe: 29.0, pb: 2.40, divYield: 1.4, beta: 1.15, volatility: 0.36, ema200: 588, sharesOutstanding: 12230000 },

  // Others
  { sym: 'NTC', name: 'Nepal Telecom (NTC)', sector: 'Others', price: 850, prevClose: 844, change: 6, pChange: 0.71, high52: 980, low52: 760, volume: 42000, turnover: 35700000, marketCap: 15300, eps: 52.4, pe: 16.2, pb: 2.15, divYield: 4.5, beta: 0.70, volatility: 0.22, ema200: 835, sharesOutstanding: 180000000 },
  { sym: 'HRL', name: 'Himalayan Reinsurance Limited', sector: 'Others', price: 710, prevClose: 702, change: 8, pChange: 1.14, high52: 830, low52: 540, volume: 68000, turnover: 48280000, marketCap: 7380, eps: 28.5, pe: 24.9, pb: 2.65, divYield: 1.6, beta: 1.05, volatility: 0.31, ema200: 682, sharesOutstanding: 104000000 }
];

export const UNIVERSE_MAP: Record<string, UniverseStock> = UNIVERSE_STOCKS.reduce((acc, stock) => {
  acc[stock.sym] = stock;
  return acc;
}, {} as Record<string, UniverseStock>);

export const SAMPLE_HOLDINGS: Holding[] = [
  { sym: 'NABIL', qty: 6000, cost: 545, ltp: 520, name: 'Nabil Bank Limited', sector: 'Commercial Banks', purchaseDate: '2024-03-12' },
  { sym: 'NICA', qty: 8000, cost: 410, ltp: 430, name: 'NIC Asia Bank Limited', sector: 'Commercial Banks', purchaseDate: '2024-05-18' },
  { sym: 'SCBL', qty: 3000, cost: 520, ltp: 560, name: 'Standard Chartered Bank Nepal', sector: 'Commercial Banks', purchaseDate: '2023-11-04' },
  { sym: 'GBIME', qty: 9000, cost: 225, ltp: 210, name: 'Global IME Bank Limited', sector: 'Commercial Banks', purchaseDate: '2024-01-22' },
  { sym: 'NLIC', qty: 4000, cost: 640, ltp: 700, name: 'Nepal Life Insurance', sector: 'Life Insurance', purchaseDate: '2023-09-15' },
  { sym: 'UPPER', qty: 12000, cost: 330, ltp: 410, name: 'Upper Tamakoshi Hydropower', sector: 'Hydropower', purchaseDate: '2024-02-10' },
  { sym: 'CHCL', qty: 6000, cost: 540, ltp: 520, name: 'Chilime Hydropower Co.', sector: 'Hydropower', purchaseDate: '2023-10-28' },
  { sym: 'NHPC', qty: 12000, cost: 205, ltp: 215, name: 'National Hydro Power Company', sector: 'Hydropower', purchaseDate: '2024-04-05' },
  { sym: 'CBBL', qty: 700, cost: 1500, ltp: 1400, name: 'Chhimek Laghubitta', sector: 'Microfinance', purchaseDate: '2023-12-14' },
  { sym: 'HDL', qty: 300, cost: 2150, ltp: 2000, name: 'Himalayan Distillery Limited', sector: 'Manufacturing', purchaseDate: '2024-06-01' },
  { sym: 'NTC', qty: 1200, cost: 830, ltp: 850, name: 'Nepal Telecom (NTC)', sector: 'Others', purchaseDate: '2023-08-19' },
  { sym: 'CIT', qty: 350, cost: 2200, ltp: 2300, name: 'Citizen Investment Trust', sector: 'Investment', purchaseDate: '2024-01-08' },
  { sym: 'SHIVM', qty: 2500, cost: 440, ltp: 420, name: 'Shivam Cements Limited', sector: 'Manufacturing', purchaseDate: '2024-03-30' }
];

export const PRESET_PORTFOLIOS: { name: string; desc: string; holdings: Holding[] }[] = [
  {
    name: 'Arthavest Core Sample',
    desc: 'Diversified benchmark portfolio across 13 major NEPSE equities and 8 sectors.',
    holdings: SAMPLE_HOLDINGS
  },
  {
    name: 'Blue-Chip Dividend Yield',
    desc: 'High-dividend cash flow focus: NTC, SCBL, EBL, CIT, Soaltee Hotel & Unilever.',
    holdings: [
      { sym: 'NTC', qty: 3500, cost: 820, ltp: 850, name: 'Nepal Telecom (NTC)', sector: 'Others' },
      { sym: 'SCBL', qty: 4000, cost: 530, ltp: 560, name: 'Standard Chartered Bank Nepal', sector: 'Commercial Banks' },
      { sym: 'EBL', qty: 3000, cost: 610, ltp: 640, name: 'Everest Bank Limited', sector: 'Commercial Banks' },
      { sym: 'CIT', qty: 1000, cost: 2210, ltp: 2300, name: 'Citizen Investment Trust', sector: 'Investment' },
      { sym: 'SHL', qty: 8000, cost: 430, ltp: 460, name: 'Soaltee Hotel Limited', sector: 'Hotels & Tourism' },
      { sym: 'CBBL', qty: 1200, cost: 1350, ltp: 1400, name: 'Chhimek Laghubitta', sector: 'Microfinance' }
    ]
  },
  {
    name: 'Hydropower Growth Heavy',
    desc: 'Aggressive energy sector exposure: Tamakoshi, Chilime, Butwal Power & Kabeli.',
    holdings: [
      { sym: 'UPPER', qty: 25000, cost: 360, ltp: 410, name: 'Upper Tamakoshi Hydropower', sector: 'Hydropower' },
      { sym: 'CHCL', qty: 12000, cost: 490, ltp: 520, name: 'Chilime Hydropower Co.', sector: 'Hydropower' },
      { sym: 'BPCL', qty: 8000, cost: 530, ltp: 550, name: 'Butwal Power Company Limited', sector: 'Hydropower' },
      { sym: 'AKPL', qty: 15000, cost: 280, ltp: 300, name: 'Arun Kabeli Power Limited', sector: 'Hydropower' },
      { sym: 'HIDCL', qty: 14000, cost: 410, ltp: 430, name: 'Hydroelectricity Investment & Dev.', sector: 'Investment' }
    ]
  },
  {
    name: 'Banking & Financials Core',
    desc: 'Core Tier-1 commercial banks, development banks, and life insurers.',
    holdings: [
      { sym: 'NABIL', qty: 12000, cost: 510, ltp: 520, name: 'Nabil Bank Limited', sector: 'Commercial Banks' },
      { sym: 'NICA', qty: 15000, cost: 420, ltp: 430, name: 'NIC Asia Bank Limited', sector: 'Commercial Banks' },
      { sym: 'GBIME', qty: 20000, cost: 205, ltp: 210, name: 'Global IME Bank Limited', sector: 'Commercial Banks' },
      { sym: 'MNBBL', qty: 5000, cost: 770, ltp: 800, name: 'Muktinath Bikas Bank', sector: 'Development Banks' },
      { sym: 'NLIC', qty: 6000, cost: 680, ltp: 700, name: 'Nepal Life Insurance', sector: 'Life Insurance' },
      { sym: 'NICL', qty: 3500, cost: 760, ltp: 780, name: 'Nepal Insurance Company', sector: 'Non-Life Insurance' }
    ]
  }
];

export const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'bear',
    name: 'Bear Market Shock (-30%)',
    d: 'NEPSE composite plummets 30%. Every stock drops in proportion to its sector beta.',
    historical: 'Typical cyclical bear trough seen in 2017-2019 NEPSE drawdown.',
    fn: h => -0.30 * h.beta
  },
  {
    id: 'margin',
    name: 'NRB 4/12 Cr Margin Lending Cap',
    d: 'Nepal Rastra Bank tightens margin-lending ceilings; retail liquidity collapses across leveraged sectors.',
    historical: '2021 monetary policy announcement causing 1,000+ point NEPSE decline.',
    map: {
      'Commercial Banks': -8,
      'Development Banks': -12,
      'Finance': -16,
      'Microfinance': -14,
      'Life Insurance': -10,
      'Non-Life Insurance': -10,
      'Investment': -12,
      'Hydropower': -18,
      'Hotels & Tourism': -8,
      'Manufacturing': -6,
      'Trading': -6,
      'Others': -5
    }
  },
  {
    id: 'earthquake',
    name: '2015 Gorkha Earthquake Crisis',
    d: 'Major natural disaster halts construction, damages hydropower assets, and triggers economic pause.',
    historical: 'April 2015 7.8M earthquake. Trading suspended for weeks; insurance claims surge.',
    map: {
      'Hydropower': -24,
      'Hotels & Tourism': -28,
      'Non-Life Insurance': -18,
      'Life Insurance': -14,
      'Commercial Banks': -12,
      'Development Banks': -15,
      'Finance': -15,
      'Microfinance': -16,
      'Manufacturing': -12,
      'Trading': -8,
      'Investment': -10,
      'Others': -6
    }
  },
  {
    id: 'liquidity',
    name: '2021 Banking Liquidity Crunch',
    d: 'Credit-Deposit (CD) ratios breach 90%; interbank rates hit double digits; bank lending freezes.',
    historical: 'FY 2021/22 liquidity squeeze when weighted average lending rates exceeded 13%.',
    map: {
      'Commercial Banks': -14,
      'Development Banks': -18,
      'Finance': -22,
      'Microfinance': -20,
      'Life Insurance': -10,
      'Non-Life Insurance': -8,
      'Investment': -15,
      'Hydropower': -12,
      'Hotels & Tourism': -10,
      'Manufacturing': -8,
      'Trading': -7,
      'Others': -5
    }
  },
  {
    id: 'monsoon',
    name: 'Severe Monsoon Infrastructure Flood',
    d: 'Flooding and landslides destroy river-basin run-of-river plants, power grid towers, and highway supply lines.',
    historical: 'Eastern Nepal monsoon floods of 2023 taking 400+ MW offline.',
    map: {
      'Hydropower': -22,
      'Investment': -9,
      'Non-Life Insurance': -12,
      'Commercial Banks': -4,
      'Development Banks': -4,
      'Finance': -4,
      'Microfinance': -5,
      'Hotels & Tourism': -7,
      'Manufacturing': -6,
      'Trading': -4,
      'Life Insurance': -3,
      'Others': -2
    }
  },
  {
    id: 'remit',
    name: 'Remittance Inflow Deceleration (-25%)',
    d: 'Gulf/Malaysia geopolitical headwinds stall Nepali migrant worker remittances; rural deposit growth halts.',
    historical: 'Sudden drop in monthly remittance below NPR 80 Arba.',
    map: {
      'Microfinance': -15,
      'Commercial Banks': -8,
      'Development Banks': -11,
      'Finance': -12,
      'Trading': -9,
      'Hotels & Tourism': -7,
      'Life Insurance': -5,
      'Manufacturing': -5,
      'Investment': -6,
      'Hydropower': -4,
      'Non-Life Insurance': -4,
      'Others': -3
    }
  },
  {
    id: 'rate',
    name: 'NRB Policy Rate Hike (+150 bps)',
    d: 'Monetary tightening to contain imported inflation; fixed deposit yields spike above 10%.',
    historical: 'Rate tightening cycle pushing equity risk premiums higher.',
    map: {
      'Commercial Banks': -7,
      'Development Banks': -12,
      'Finance': -15,
      'Microfinance': -14,
      'Life Insurance': -7,
      'Non-Life Insurance': -5,
      'Investment': -10,
      'Hydropower': -10,
      'Hotels & Tourism': -8,
      'Manufacturing': -5,
      'Trading': -6,
      'Others': -4
    }
  }
];

// ATH50 Index Fund / Nepal Top-50 ETF Constituents
export const ATH50_CONSTITUENTS: EtfConstituent[] = [
  { sym: 'NABIL', name: 'Nabil Bank', sector: 'Commercial Banks', sharesInBasket: 1400, price: 520, marketValue: 728000, weight: 0.082, cappedWeight: 0.080 },
  { sym: 'NTC', name: 'Nepal Telecom', sector: 'Others', sharesInBasket: 850, price: 850, marketValue: 722500, weight: 0.081, cappedWeight: 0.080 },
  { sym: 'CIT', name: 'Citizen Investment Trust', sector: 'Investment', sharesInBasket: 310, price: 2300, marketValue: 713000, weight: 0.080, cappedWeight: 0.080 },
  { sym: 'GBIME', name: 'Global IME Bank', sector: 'Commercial Banks', sharesInBasket: 3200, price: 210, marketValue: 672000, weight: 0.075, cappedWeight: 0.075 },
  { sym: 'UPPER', name: 'Upper Tamakoshi Hydro', sector: 'Hydropower', sharesInBasket: 1550, price: 410, marketValue: 635500, weight: 0.071, cappedWeight: 0.071 },
  { sym: 'EBL', name: 'Everest Bank', sector: 'Commercial Banks', sharesInBasket: 950, price: 640, marketValue: 608000, weight: 0.068, cappedWeight: 0.068 },
  { sym: 'NLIC', name: 'Nepal Life Insurance', sector: 'Life Insurance', sharesInBasket: 820, price: 700, marketValue: 574000, weight: 0.064, cappedWeight: 0.064 },
  { sym: 'SCBL', name: 'Standard Chartered Bank', sector: 'Commercial Banks', sharesInBasket: 960, price: 560, marketValue: 537600, weight: 0.060, cappedWeight: 0.060 },
  { sym: 'NICA', name: 'NIC Asia Bank', sector: 'Commercial Banks', sharesInBasket: 1220, price: 430, marketValue: 524600, weight: 0.059, cappedWeight: 0.059 },
  { sym: 'HIDCL', name: 'Hydroelectricity Inv.', sector: 'Investment', sharesInBasket: 1180, price: 430, marketValue: 507400, weight: 0.057, cappedWeight: 0.057 },
  { sym: 'HDL', name: 'Himalayan Distillery', sector: 'Manufacturing', sharesInBasket: 240, price: 2000, marketValue: 480000, weight: 0.054, cappedWeight: 0.054 },
  { sym: 'CHCL', name: 'Chilime Hydropower', sector: 'Hydropower', sharesInBasket: 880, price: 520, marketValue: 457600, weight: 0.051, cappedWeight: 0.051 },
  { sym: 'MNBBL', name: 'Muktinath Bikas Bank', sector: 'Development Banks', sharesInBasket: 540, price: 800, marketValue: 432000, weight: 0.048, cappedWeight: 0.048 },
  { sym: 'SHL', name: 'Soaltee Hotel', sector: 'Hotels & Tourism', sharesInBasket: 920, price: 460, marketValue: 423200, weight: 0.047, cappedWeight: 0.047 },
  { sym: 'CBBL', name: 'Chhimek Laghubitta', sector: 'Microfinance', sharesInBasket: 280, price: 1400, marketValue: 392000, weight: 0.044, cappedWeight: 0.044 },
  { sym: 'SANIMA', name: 'Sanima Bank', sector: 'Commercial Banks', sharesInBasket: 1250, price: 300, marketValue: 375000, weight: 0.042, cappedWeight: 0.042 },
  { sym: 'HRL', name: 'Himalayan Reinsurance', sector: 'Others', sharesInBasket: 510, price: 710, marketValue: 362100, weight: 0.040, cappedWeight: 0.040 }
];

export const NEPSE_MACRO = {
  nrbPolicyRate: '4.25%',
  nrbPolicyNote: 'Monetary policy 2026/27, 7 Jul 2026. Overnight repo corridor at 6.00%',
  inflationCpi: '5.04%',
  inflationNote: 'NRB target ceiling is 5.50%. Driven by food and imported energy',
  fxReservesNpr: 'Rs 3,704.55 Arba',
  fxReservesUsd: 'US$ 24.19 Billion',
  fxReservesNote: 'Equivalent to 19.2 months of merchandise & service imports',
  remittanceGrowth: '+41.2%',
  remittanceNote: 'FY 2025/26 10-month total reached NPR 1,198 Arba',
  rupeePeg: 'INR 1 = NPR 1.60',
  rupeePegNote: 'Fixed currency board peg established under NRB Act',
  settlementCycle: 'T+2 rolling settlement via CDSC MeroShare and EDIS transfer',
  circuitBreakers: [
    { period: '1st Hour', threshold: '4.0%', action: '20-minute halt across all stocks' },
    { period: '2nd Hour', threshold: '5.0%', action: '40-minute halt across all stocks' },
    { period: 'Anytime', threshold: '6.0%', action: 'Trading halted for the remainder of the session' }
  ]
};

// Nepal Gold & Bullion Reference Data
export const GOLD_DATA = {
  pricePerTola: 172800, // NPR per Tola (11.664 grams)
  pricePer10g: 148150, // NPR per 10 grams
  purity: '999.9 Fine 24 Karat Gold',
  vaultLocation: 'Kathmandu Central Vault, Lalitpur, Nepal',
  auditor: 'Federation of Nepal Gold & Silver Dealers\' Association (FENEGOSIDA) & Ernst & Young Nepal affiliate',
  ter: '0.35% per annum',
  physicalRedemptionMinTola: 10,
  etfTicker: 'ARTHAGOLD'
};

// Nepal Real Estate REIT Reference Data
export const REIT_DATA = {
  name: 'ARTHAREIT Nepal Commercial Income Fund',
  ticker: 'ARTHAREIT',
  targetYield: '8.4% p.a.',
  distributionFrequency: 'Quarterly Cash Dividend in NPR',
  occupancyRate: '96.2%',
  portfolioValue: 'Rs 14.8 Arba',
  totalSqFt: '840,000 sq. ft.',
  properties: [
    { name: 'Kathmandu High-Tech IT Park', location: 'Dhulikhel / Tinkune Corridor, Kathmandu', sqFt: '320,000', occupancy: '98%', tenants: 'Tech & BPO multinational hubs' },
    { name: 'Pokhara Lakeside Commercial Center', location: 'Lakeside, Pokhara', sqFt: '210,000', occupancy: '94%', tenants: 'Hospitality, international banking & retail' },
    { name: 'Lalitpur Heritage Grade-A Office', location: 'Pulchowk / Jawalakhel, Lalitpur', sqFt: '310,000', occupancy: '97%', tenants: 'Embassy missions, UN agencies & banks' }
  ]
};
