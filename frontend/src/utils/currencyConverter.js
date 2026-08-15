/**
 * Currency Converter Utility
 * 
 * This utility provides functions to convert amounts between different currencies
 * using the latest exchange rates.
 */

// Default exchange rates (relative to USD)
// These rates should be updated regularly from an API in a production environment
const defaultRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 151.56,
  CAD: 1.37,
  AUD: 1.52,
  INR: 83.47,
  CNY: 7.24,
  BRL: 5.16,
  ZAR: 18.65
};

/**
 * Convert an amount from one currency to another
 * 
 * @param {number} amount - The amount to convert
 * @param {string} fromCurrency - The source currency code (e.g., 'USD')
 * @param {string} toCurrency - The target currency code (e.g., 'EUR')
 * @param {object} rates - Optional custom exchange rates object
 * @returns {number} The converted amount
 */
export const convertCurrency = (amount, fromCurrency, toCurrency, rates = defaultRates) => {
  // If currencies are the same, return the original amount
  if (fromCurrency === toCurrency) return amount;
  
  // Check if both currencies exist in our rates
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    console.error(`Currency not supported: ${!rates[fromCurrency] ? fromCurrency : toCurrency}`);
    return amount;
  }
  
  // Convert to USD first (as base currency), then to target currency
  const amountInUSD = amount / rates[fromCurrency];
  return amountInUSD * rates[toCurrency];
};

/**
 * Format a currency amount according to locale and currency
 * 
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - The currency code (e.g., 'USD')
 * @param {string} locale - The locale to use for formatting (default: 'en-US')
 * @returns {string} Formatted currency string
 */
export const formatCurrencyAmount = (amount, currencyCode, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Get the exchange rate between two currencies
 * 
 * @param {string} fromCurrency - The source currency code
 * @param {string} toCurrency - The target currency code
 * @param {object} rates - Optional custom exchange rates object
 * @returns {number} The exchange rate
 */
export const getExchangeRate = (fromCurrency, toCurrency, rates = defaultRates) => {
  if (!rates[fromCurrency] || !rates[toCurrency]) {
    console.error(`Currency not supported: ${!rates[fromCurrency] ? fromCurrency : toCurrency}`);
    return 1;
  }
  
  return rates[toCurrency] / rates[fromCurrency];
};

export default {
  convertCurrency,
  formatCurrencyAmount,
  getExchangeRate,
  defaultRates
};