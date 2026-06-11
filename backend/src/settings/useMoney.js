const currency = require('currency.js');

const useMoney = ({ settings }) => {
  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
    currency_code,
  } = settings;

  function formatIndianNumber(amount) {
    const formatted = currency(amount, {
      separator: '',
      decimal: '.',
      symbol: '',
      precision: cent_precision,
    }).format();
    const [integerPart, decimalPart] = formatted.split('.');
    const sign = integerPart.startsWith('-') ? '-' : '';
    const absoluteDigits = sign ? integerPart.slice(1) : integerPart;
    if (absoluteDigits.length <= 3) {
      return sign + absoluteDigits + (decimalPart ? decimal_sep + decimalPart : '');
    }
    const lastThree = absoluteDigits.slice(-3);
    const rest = absoluteDigits.slice(0, -3);
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, thousand_sep || ',');
    return (
      sign + groupedRest + (groupedRest ? thousand_sep : '') + lastThree +
      (decimalPart ? decimal_sep + decimalPart : '')
    );
  }

  function currencyFormat(amount) {
    const formattedAmount =
      currency_code?.toString().toUpperCase() === 'INR'
        ? formatIndianNumber(amount)
        : currency(amount, {
            separator: thousand_sep,
            decimal: decimal_sep,
            symbol: '',
            precision: cent_precision,
          }).format();

    return currency(amount).dollars() > 0 || !zero_format
      ? formattedAmount
      : 0 + formattedAmount;
  }

  function moneyFormatter({ amount = 0 }) {
    return currency_position === 'before'
      ? currency_symbol + ' ' + currencyFormat(amount)
      : currencyFormat(amount) + ' ' + currency_symbol;
  }

  function amountFormatter({ amount = 0 }) {
    return currencyFormat(amount);
  }

  return {
    moneyFormatter,
    amountFormatter,
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  };
};

module.exports = useMoney;
