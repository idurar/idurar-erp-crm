import { createSelector } from 'reselect';

export const selectCurrency = (state) => state.currency;

export const selectCurrencyList = createSelector([selectCurrency], (currency) => currency.result);

export const selectCurrentCurrency = (code) =>
  createSelector(selectCurrencyList, (list) => list.find((item) => item.code === code));
