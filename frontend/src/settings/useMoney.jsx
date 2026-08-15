import currency from 'currency.js';

import { useSelector } from 'react-redux';
import storePersist from '@/redux/storePersist';

import { selectMoneyFormat } from '@/redux/settings/selectors';

const useMoney = () => {
  const money_format_settings = useSelector(selectMoneyFormat);

  const money_format_state = money_format_settings
    ? money_format_settings
    : storePersist.get('settings')?.money_format_settings;

  function formatIndianNumber(amount) {
    const formatted = currency(amount, {
      separator: '',
      decimal: '.',
      symbol: '',
      precision: money_format_state?.cent_precision,
    }).format();
    const [integerPart, decimalPart] = formatted.split('.');
    const sign = integerPart.startsWith('-') ? '-' : '';
    const absoluteDigits = sign ? integerPart.slice(1) : integerPart;
    if (absoluteDigits.length <= 3) {
      return sign + absoluteDigits + (decimalPart ? money_format_state?.decimal_sep + decimalPart : '');
    }
    const lastThree = absoluteDigits.slice(-3);
    const rest = absoluteDigits.slice(0, -3);
    const groupedRest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, money_format_state?.thousand_sep || ',');
    return (
      sign + groupedRest + (groupedRest ? money_format_state?.thousand_sep : '') + lastThree +
      (decimalPart ? money_format_state?.decimal_sep + decimalPart : '')
    );
  }

  function currencyFormat({ amount, currency_code = money_format_state?.currency_code }) {
    const formattedAmount =
      currency_code?.toString().toUpperCase() === 'INR'
        ? formatIndianNumber(amount)
        : currency(amount, {
            separator: money_format_state?.thousand_sep,
            decimal: money_format_state?.decimal_sep,
            symbol: '',
            precision: money_format_state?.cent_precision,
          }).format();

    return currency(amount).dollars() > 0 || !money_format_state?.zero_format
      ? formattedAmount
      : 0 + formattedAmount;
  }

  function moneyFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
    return money_format_state?.currency_position === 'before'
      ? money_format_state?.currency_symbol + ' ' + currencyFormat({ amount, currency_code })
      : currencyFormat({ amount, currency_code }) + ' ' + money_format_state?.currency_symbol;
  }

  function amountFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
    return currencyFormat({ amount: amount, currency_code });
  }

  function moneyRowFormatter({ amount = 0, currency_code = money_format_state?.currency_code }) {
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
          {money_format_state?.currency_position === 'before'
            ? money_format_state?.currency_symbol + ' ' + currencyFormat({ amount, currency_code })
            : currencyFormat({ amount, currency_code }) + ' ' + money_format_state?.currency_symbol}
        </>
      ),
    };
  }

  return {
    moneyRowFormatter,
    moneyFormatter,
    amountFormatter,
    currency_symbol: money_format_state?.currency_symbol,
    currency_code: money_format_state?.currency_code,
    currency_position: money_format_state?.currency_position,
    decimal_sep: money_format_state?.decimal_sep,
    thousand_sep: money_format_state?.thousand_sep,
    cent_precision: money_format_state?.cent_precision,
    zero_format: money_format_state?.zero_format,
  };
};

export default useMoney;
