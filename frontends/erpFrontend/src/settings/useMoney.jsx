import React from 'react';
import currency from 'currency.js';
import { useSelector } from 'react-redux';

import { selectSettings } from '@/redux/settings/selectors';

const useMoney = () => {
  const { currencySymbol, currencyPosition, decimalSep, ThousandSep, centPrecision, zeroFormat } =
    useSelector(selectSettings);

  const currencyFormat = (amount) =>
    currency(amount).dollars() > 0 || !zeroFormat
      ? currency(amount, {
          separator: ThousandSep,
          decimal: decimalSep,
          symbol: '',
          precision: centPrecision,
        }).format()
      : 0 +
        currency(amount, {
          separator: ThousandSep,
          decimal: decimalSep,
          symbol: '',
          precision: centPrecision,
        }).format();

  let moneyFormatter = ({ amount = 0 }) => {
    console.log('🚀 ~ file: useMoney.jsx ~ line 28 ~ moneyFormatter ~ amount', amount);

    return currencyPosition === 'before'
      ? currencySymbol + ' ' + currencyFormat(amount)
      : currencyFormat(amount) + ' ' + currencySymbol;
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
    currencySymbol,
    currencyPosition,
    decimalSep,
    ThousandSep,
    centPrecision,
    zeroFormat,
  };
};

export default useMoney;
