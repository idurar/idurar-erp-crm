import { createSelector } from 'reselect';

export const selectProfile = (state) => state.profile;

export const selectCurrentProfile = createSelector(
  [selectProfile],
  (profile) => profile.informations
);
