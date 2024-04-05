import { useState, useEffect } from 'react';
import currency from 'currency.js';

import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';

import { selectMoneyFormat } from '@/redux/settings/selectors';
import { selectCurrencyList } from '@/redux/currency/selectors';

const useMoney = () => {
  const money_format_settings = useSelector(selectMoneyFormat);
  const currency_list = useSelector(selectCurrencyList);

  const money_format_state = money_format_settings
    ? money_format_settings
    : storePersist.get('settings')?.money_format_settings;

  const [moneyFormatState, setMoneyFormatState] = useState(money_format_settings);

  const thisCurrency = (currency_code) => {
    return currency_list.find((x) => x.currency_code === currency_code);
  };

  useEffect(() => {
    const currentCurrency = currency_list.find(
      (x) => x.currency_code === money_format_settings.default_currency_code
    );
    setMoneyFormatState(currentCurrency);
  }, [money_format_state]);

  function currencyFormat({ amount, currency_code = moneyFormatState?.currency_code }) {
    return currency(amount).dollars() > 0 || !thisCurrency(currency_code)?.zero_format
      ? currency(amount, {
          separator: thisCurrency(currency_code)?.thousand_sep,
          decimal: thisCurrency(currency_code)?.decimal_sep,
          symbol: '',
          precision: thisCurrency(currency_code)?.cent_precision,
        }).format()
      : 0 +
          currency(amount, {
            separator: thisCurrency(currency_code)?.thousand_sep,
            decimal: thisCurrency(currency_code)?.decimal_sep,
            symbol: '',
            precision: thisCurrency(currency_code)?.cent_precision,
          }).format();
  }

  function moneyFormatter({ amount = 0, currency_code = moneyFormatState?.currency_code }) {
    return moneyFormatState?.currency_position === 'before'
      ? thisCurrency(currency_code)?.currency_symbol +
          ' ' +
          currencyFormat({ amount, currency_code })
      : currencyFormat({ amount, currency_code }) +
          ' ' +
          thisCurrency(currency_code)?.currency_symbol;
  }

  function amountFormatter({ amount = 0, currency_code = moneyFormatState?.currency_code }) {
    return currencyFormat({ amount: amount, currency_code });
  }

  function moneyRowFormatter({ amount = 0, currency_code = moneyFormatState?.currency_code }) {
    return {
      props: {
        style: {
          textAlign: 'right',
          whiteSpace: 'nowrap',
          direction: 'ltr',
        },
      },
      children: (
        <>
          {moneyFormatState?.currency_position === 'before'
            ? thisCurrency(currency_code)?.currency_symbol +
              ' ' +
              currencyFormat({ amount, currency_code })
            : currencyFormat({ amount, currency_code }) +
              ' ' +
              thisCurrency(currency_code)?.currency_symbol}
        </>
      ),
    };
  }

  return {
    moneyRowFormatter,
    moneyFormatter,
    amountFormatter,
    currency_symbol: moneyFormatState?.currency_symbol,
    currency_code: moneyFormatState?.currency_code,
    currency_position: moneyFormatState?.currency_position,
    decimal_sep: moneyFormatState?.decimal_sep,
    thousand_sep: moneyFormatState?.thousand_sep,
    cent_precision: moneyFormatState?.cent_precision,
    zero_format: moneyFormatState?.zero_format,
  };
};

export default useMoney;
