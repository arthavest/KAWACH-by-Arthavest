const fIN = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });
const f2 = new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function npr(v: number): string {
  const a = Math.abs(v);
  const s = v < 0 ? '−' : '';
  if (a >= 1e9) return s + 'Rs ' + (a / 1e9).toFixed(2) + ' Arba';
  if (a >= 1e7) return s + 'Rs ' + (a / 1e7).toFixed(2) + ' Cr';
  if (a >= 1e5) return s + 'Rs ' + (a / 1e5).toFixed(2) + ' L';
  return s + 'Rs ' + fIN.format(Math.round(a));
}

export function nprF(v: number): string {
  return (v < 0 ? '−' : '') + 'Rs ' + fIN.format(Math.abs(Math.round(v)));
}

export function nprDec(v: number): string {
  return (v < 0 ? '−' : '') + 'Rs ' + f2.format(Math.abs(v));
}

export function pc(x: number, d: number = 1): string {
  return (x * 100).toFixed(d) + '%';
}

export function sg(x: number, d: number = 2): string {
  return (x >= 0 ? '+' : '−') + Math.abs(x * 100).toFixed(d) + '%';
}

export function cls(x: number): string {
  return x >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400';
}
