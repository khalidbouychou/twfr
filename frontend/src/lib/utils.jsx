import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Safe number formatting utilities to prevent NaN errors in production
export function safeToLocaleString(value, fallback = '0') {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toLocaleString();
}

export function safeToFixed(value, digits = 2, fallback = '0.00') {
  if (value === null || value === undefined || isNaN(value)) {
    return fallback;
  }
  return value.toFixed(digits);
}

export function safeParseFloat(value, fallback = 0) {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
}

export function safeParseInt(value, fallback = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? fallback : parsed;
}
