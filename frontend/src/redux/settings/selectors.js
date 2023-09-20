import { createSelector } from 'reselect';

export const selectSettings = (state) => state.settings;

export const selectCurrentSettings = createSelector(
  [selectSettings],
  (settings) => settings.result
);

export const selectMoneyFormat = createSelector(
  [selectCurrentSettings],
  (settings) => settings.money_format_settings
);
