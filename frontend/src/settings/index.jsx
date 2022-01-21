import React from 'react';
import dayjs from 'dayjs';

import { useSelector } from 'react-redux';

import { selectSettings } from '@/redux/settings/selectors';

export const useMoney = () => {
  const {
    currency,
    currencyPosition,
    decimalSep,
    ThousandSep = ' ',
  } = useSelector(selectSettings);

  let moneyFormatter = ({ amount = 0 }) => {
    return currencyPosition === 'before'
      ? currency + ' ' + amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
      : amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') +
          ' ' +
          currency;
  };
  let amountFormatter = ({ amount = 0 }) => {
    return amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
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
    currency,
    currencyPosition,
  };
};
