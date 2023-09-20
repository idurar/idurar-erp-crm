import React from 'react';
import currency from 'currency.js';
import { useSelector } from 'react-redux';

import { selectMoneyFormat } from '@/redux/settings/selectors';

const useMoney = () => {
  const {
    currency_symbol,
    currency_position,
    decimal_sep,
    thousand_sep,
    cent_precision,
    zero_format,
  } = useSelector(selectMoneyFormat);

  const currencyFormat = (amount) =>
    currency(amount).dollars() > 0 || !zero_format
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

  let moneyFormatter = ({ amount = 0 }) => {
    return currency_position === 'before'
      ? currency_symbol + ' ' + currencyFormat(amount)
      : currencyFormat(amount) + ' ' + currency_symbol;
  };

  let amountFormatter = ({ amount = 0 }) => currencyFormat(amount);

  let moneyRowFormatter = ({ amount = 0 }) => {
    return {
      props: {
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
        },
      },
      children: <>{moneyFormatter({ amount })}</>,
    };
  };

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
