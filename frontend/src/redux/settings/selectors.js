import { createSelector } from 'reselect';

export const selectSettings = (state) => state.settings;

export const selectCurrency = createSelector([selectSettings], (settings) => settings.currency);

export const selectCurrencyPosition = createSelector(
  [selectSettings],
  (settings) => settings.selectCurrencyPosition
);
