const currencyFlag = [
  { currency_code: 'USD', flag: '🇺🇸' },
  { currency_code: 'CAD', flag: '🇨🇦' },
  { currency_code: 'EUR', flag: '🇪🇺' },
  { currency_code: 'AED', flag: '🇦🇪' },
  { currency_code: 'AFN', flag: '🇦🇫' },
  { currency_code: 'ALL', flag: '🇦🇱' },
  { currency_code: 'AMD', flag: '🇦🇲' },
  { currency_code: 'ARS', flag: '🇦🇷' },
  { currency_code: 'AUD', flag: '🇦🇺' },
  { currency_code: 'AZN', flag: '🇦🇿' },
  { currency_code: 'BAM', flag: '🇧🇦' },
  { currency_code: 'BDT', flag: '🇧🇩' },
  { currency_code: 'BGN', flag: '🇧🇬' },
  { currency_code: 'BHD', flag: '🇧🇭' },
  { currency_code: 'BIF', flag: '🇧🇮' },
  { currency_code: 'BND', flag: '🇧🇳' },
  { currency_code: 'BOB', flag: '🇧🇴' },
  { currency_code: 'BRL', flag: '🇧🇷' },
  { currency_code: 'BWP', flag: '🇧🇼' },
  { currency_code: 'BYR', flag: '🇧🇾' },
  { currency_code: 'BZD', flag: '🇧🇿' },
  { currency_code: 'CDF', flag: '🇨🇩' },
  { currency_code: 'CHF', flag: '🇨🇭' },
  { currency_code: 'CLP', flag: '🇨🇱' },
  { currency_code: 'CNY', flag: '🇨🇳' },
  { currency_code: 'COP', flag: '🇨🇴' },
  { currency_code: 'CRC', flag: '🇨🇷' },
  { currency_code: 'CVE', flag: '🇨🇻' },
  { currency_code: 'CZK', flag: '🇨🇿' },
  { currency_code: 'DJF', flag: '🇩🇯' },
  { currency_code: 'DKK', flag: '🇩🇰' },
  { currency_code: 'DOP', flag: '🇩🇴' },
  { currency_code: 'DZD', flag: '🇩🇿' },
  { currency_code: 'EEK', flag: '🇪🇪' },
  { currency_code: 'EGP', flag: '🇪🇬' },
  { currency_code: 'ERN', flag: '🇪🇷' },
  { currency_code: 'ETB', flag: '🇪🇹' },
  { currency_code: 'GBP', flag: '🇬🇧' },
  { currency_code: 'GEL', flag: '🇬🇪' },
  { currency_code: 'GHS', flag: '🇬🇭' },
  { currency_code: 'GNF', flag: '🇬🇳' },
  { currency_code: 'GTQ', flag: '🇬🇹' },
  { currency_code: 'HKD', flag: '🇭🇰' },
  { currency_code: 'HNL', flag: '🇭🇳' },
  { currency_code: 'HRK', flag: '🇭🇷' },
  { currency_code: 'HUF', flag: '🇭🇺' },
  { currency_code: 'IDR', flag: '🇮🇩' },
  { currency_code: 'ILS', flag: '🇮🇱' },
  { currency_code: 'INR', flag: '🇮🇳' },
  { currency_code: 'IQD', flag: '🇮🇶' },
  { currency_code: 'IRR', flag: '🇮🇷' },
  { currency_code: 'ISK', flag: '🇮🇸' },
  { currency_code: 'JMD', flag: '🇯🇲' },
  { currency_code: 'JOD', flag: '🇯🇴' },
  { currency_code: 'JPY', flag: '🇯🇵' },
  { currency_code: 'KES', flag: '🇰🇪' },
  { currency_code: 'KGS', flag: '🇰🇬' },
  { currency_code: 'KHR', flag: '🇰🇭' },
  { currency_code: 'KMF', flag: '🇰🇲' },
  { currency_code: 'KPW', flag: '🇰🇵' },
  { currency_code: 'KRW', flag: '🇰🇷' },
  { currency_code: 'KWD', flag: '🇰🇼' },
  { currency_code: 'KYD', flag: '🇰🇾' },
  { currency_code: 'KZT', flag: '🇰🇿' },
  { currency_code: 'LAK', flag: '🇱🇦' },
  { currency_code: 'LBP', flag: '🇱🇧' },
  { currency_code: 'LKR', flag: '🇱🇰' },
  { currency_code: 'LRD', flag: '🇱🇷' },
  { currency_code: 'LSL', flag: '🇱🇸' },
  { currency_code: 'LTL', flag: '🇱🇹' },
  { currency_code: 'LVL', flag: '🇱🇻' },
  { currency_code: 'LYD', flag: '🇱🇾' },
  { currency_code: 'MAD', flag: '🇲🇦' },
  { currency_code: 'MDL', flag: '🇲🇩' },
  { currency_code: 'MGA', flag: '🇲🇬' },
  { currency_code: 'MKD', flag: '🇲🇰' },
  { currency_code: 'MMK', flag: '🇲🇲' },
  { currency_code: 'MNT', flag: '🇲🇳' },
  { currency_code: 'MOP', flag: '🇲🇴' },
  { currency_code: 'MUR', flag: '🇲🇺' },
  { currency_code: 'MVR', flag: '🇲🇻' },
  { currency_code: 'MWK', flag: '🇲🇼' },
  { currency_code: 'MXN', flag: '🇲🇽' },
  { currency_code: 'MYR', flag: '🇲🇾' },
  { currency_code: 'MZN', flag: '🇲🇿' },
  { currency_code: 'NAD', flag: '🇳🇦' },
  { currency_code: 'NGN', flag: '🇳🇬' },
  { currency_code: 'NIO', flag: '🇳🇮' },
  { currency_code: 'NOK', flag: '🇳🇴' },
  { currency_code: 'NPR', flag: '🇳🇵' },
  { currency_code: 'NZD', flag: '🇳🇿' },
  { currency_code: 'OMR', flag: '🇴🇲' },
  { currency_code: 'PAB', flag: '🇵🇦' },
  { currency_code: 'PEN', flag: '🇵🇪' },
  { currency_code: 'PGK', flag: '🇵🇬' },
  { currency_code: 'PHP', flag: '🇵🇭' },
  { currency_code: 'PKR', flag: '🇵🇰' },
  { currency_code: 'PLN', flag: '🇵🇱' },
  { currency_code: 'PYG', flag: '🇵🇾' },
  { currency_code: 'QAR', flag: '🇶🇦' },
  { currency_code: 'RON', flag: '🇷🇴' },
  { currency_code: 'RSD', flag: '🇷🇸' },
  { currency_code: 'RUB', flag: '🇷🇺' },
  { currency_code: 'RWF', flag: '🇷🇼' },
  { currency_code: 'SAR', flag: '🇸🇦' },
  { currency_code: 'SBD', flag: '🇸🇧' },
  { currency_code: 'SCR', flag: '🇸🇨' },
  { currency_code: 'SDG', flag: '🇸🇩' },
  { currency_code: 'SEK', flag: '🇸🇪' },
  { currency_code: 'SGD', flag: '🇸🇬' },
  { currency_code: 'SHP', flag: '🇸🇭' },
  { currency_code: 'SLL', flag: '🇸🇱' },
  { currency_code: 'SOS', flag: '🇸🇴' },
  { currency_code: 'SRD', flag: '🇸🇷' },
  { currency_code: 'SSP', flag: '🇸🇸' },
  { currency_code: 'STD', flag: '🇸🇹' },
  { currency_code: 'SVC', flag: '🇸🇻' },
  { currency_code: 'SYP', flag: '🇸🇾' },
  { currency_code: 'SZL', flag: '🇸🇿' },
  { currency_code: 'THB', flag: '🇹🇭' },
  { currency_code: 'TJS', flag: '🇹🇯' },
  { currency_code: 'TMT', flag: '🇹🇲' },
  { currency_code: 'TND', flag: '🇹🇳' },
  { currency_code: 'TOP', flag: '🇹🇴' },
  { currency_code: 'TRY', flag: '🇹🇷' },
  { currency_code: 'TTD', flag: '🇹🇹' },
  { currency_code: 'TWD', flag: '🇹🇼' },
  { currency_code: 'TZS', flag: '🇹🇿' },
  { currency_code: 'UAH', flag: '🇺🇦' },
  { currency_code: 'UGX', flag: '🇺🇬' },
  { currency_code: 'UYU', flag: '🇺🇾' },
  { currency_code: 'UZS', flag: '🇺🇿' },
  { currency_code: 'VEF', flag: '🇻🇪' },
  { currency_code: 'VND', flag: '🇻🇳' },
  { currency_code: 'VUV', flag: '🇻🇺' },
  { currency_code: 'WST', flag: '🇼🇸' },
  { currency_code: 'XAF', flag: '🇨🇫' },
  { currency_code: 'XCD', flag: '🇧🇲' },
  { currency_code: 'XOF', flag: '🇧🇫' },
  { currency_code: 'XPF', flag: '🇵🇫' },
  { currency_code: 'YER', flag: '🇾🇪' },
  { currency_code: 'ZAR', flag: '🇿🇦' },
  { currency_code: 'ZMK', flag: '🇿🇲' },
];

// export const currencyOptions = (currencyList) => {
//   return currencyList.map((x) => {
//     return {
//       value: x.currency_code,
//       label:
//         (currencyFlag.find((currency) => currency.currency_code === x.currency_code)?.flag ||
//           '💵') +
//         ' ' +
//         x.currency_symbol +
//         ' (' +
//         x.currency_name +
//         ')',
//     };
//   });
// };

const currencyMeta = {
  INR: {
    name: 'Indian Rupee',
    symbol: '₹',
  },
};

const getCurrencyName = (currency_code) => {
  const metadata = currencyMeta[currency_code];
  if (metadata?.name) {
    return metadata.name;
  }

  if (typeof Intl !== 'undefined' && Intl.DisplayNames) {
    try {
      return new Intl.DisplayNames('en', { type: 'currency' }).of(currency_code);
    } catch (error) {
      return undefined;
    }
  }

  return undefined;
};

const getCurrencySymbol = (currency_code) => {
  const metadata = currencyMeta[currency_code];
  if (metadata?.symbol) {
    return metadata.symbol;
  }

  if (typeof Intl !== 'undefined' && Intl.NumberFormat) {
    try {
      return new Intl.NumberFormat('en', {
        style: 'currency',
        currency: currency_code,
        minimumFractionDigits: 0,
      })
        .formatToParts(1)
        .find((part) => part.type === 'currency')?.value;
    } catch (error) {
      return undefined;
    }
  }

  return undefined;
};

export const currencyOptions = () => {
  return currencyFlag.map((x) => {
    const currencyName = getCurrencyName(x.currency_code);
    const currencySymbol = getCurrencySymbol(x.currency_code);
    const label =
      x.flag +
      ' ' +
      x.currency_code +
      (currencyName ? ' — ' + currencyName : '') +
      (currencySymbol ? ' (' + currencySymbol + ')' : '');

    return {
      value: x.currency_code,
      label,
    };
  });
};
