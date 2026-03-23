/**
 * Formatting utilities for numbers, dates, currencies, and misc values
 * used across the Eternal Nexus OS product.
 */

/** Format large numbers: 1200000 → "1.2M", 1000000000 → "1B" */
export function formatNumber(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    const formatted = (abs / 1_000_000_000).toPrecision(3);
    return `${sign}${parseFloat(formatted)}B`;
  }
  if (abs >= 1_000_000) {
    const formatted = (abs / 1_000_000).toPrecision(3);
    return `${sign}${parseFloat(formatted)}M`;
  }
  if (abs >= 1_000) {
    const formatted = (abs / 1_000).toPrecision(3);
    return `${sign}${parseFloat(formatted)}K`;
  }
  return `${sign}${abs}`;
}

/** Format as percentage: 0.782 → "78.2%" */
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/** Format currency: 1234567 → "$1.23M" */
export function formatCurrency(value: number, currency = '$'): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}${currency}${(abs / 1_000_000_000).toFixed(2)}B`;
  }
  if (abs >= 1_000_000) {
    return `${sign}${currency}${(abs / 1_000_000).toFixed(2)}M`;
  }
  if (abs >= 1_000) {
    return `${sign}${currency}${(abs / 1_000).toFixed(2)}K`;
  }
  return `${sign}${currency}${abs.toFixed(2)}`;
}

const MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

/** Format date to readable: "2026-03-23" → "23 Mar 2026" */
export function formatDate(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const day = d.getUTCDate().toString().padStart(2, '0');
  const month = MONTH_NAMES[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/** Format year range: (2020, 2026) → "2020–2026" */
export function formatYearRange(start: number, end: number): string {
  return `${start}–${end}`;
}

/** Clamp number between min and max */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Format country code to flag emoji: "US" → "🇺🇸"
 * Works by converting each letter to its Regional Indicator Symbol equivalent.
 */
export function countryFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .split('')
    .map((char) => String.fromCodePoint(0x1f1e6 + char.charCodeAt(0) - 65))
    .join('');
}
