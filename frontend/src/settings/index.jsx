import React from 'react';
import currency from 'currency.js';
import { useSelector } from 'react-redux';

import { selectSettings } from '@/redux/settings/selectors';

export const useMoney = () => {
  const {
    currencySymbol,
    currencyPosition = 'before',
    decimalSep,
    ThousandSep = ' ',
  } = useSelector(selectSettings);

  const currencyFomat = (amount) =>
    currency(amount, { separator: ThousandSep, decimal: decimalSep });

  let moneyFormatter = ({ amount = 0 }) => {
    return currencyPosition === 'before'
      ? currencySymbol + ' ' + currencyFomat(amount)
      : currencyFomat(amount) + ' ' + currencySymbol;
  };
  let amountFormatter = ({ amount = 0 }) => {
    return currencyFomat(amount);
  };

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
  };
};
