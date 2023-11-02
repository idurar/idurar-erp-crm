import currency from 'currency.js';

import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';

import { selectMoneyFormat } from '@/redux/settings/selectors';

const useMoney = () => {
  const money_format_settings = useSelector(selectMoneyFormat);

  const settingsState = storePersist.get('settings')
    ? storePersist.get('settings')
    : { money_format_settings };

  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = settingsState.money_format_settings;

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

  function moneyRowFormatter({ amount = 0 }) {
    return {
      props: {
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      },
      children: (
        <>
          {currency_position === 'before'
            ? currency_symbol + ' ' + currencyFormat(amount)
            : currencyFormat(amount) + ' ' + currency_symbol}
        </>
      ),
    };
  }

  return {
    moneyRowFormatter,
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

export default useMoney;
