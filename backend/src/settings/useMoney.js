const currency = require('currency.js');

const useMoney = ({ settings }) => {
  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settings;

  function currencyFormat(amount) {
    return currency(amount).dollars() > 0 || !zero_format
      ? currency(amount, {
          separator: thousand_sep,
          decimal: decimal_sep,
          symbol: '',
          precision: cent_precision,
        }).format()
      : 0 +
          currency(amount, {
            separator: thousand_sep,
            decimal: decimal_sep,
            symbol: '',
            precision: cent_precision,
          }).format();
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
