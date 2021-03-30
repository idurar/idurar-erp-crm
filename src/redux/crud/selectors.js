import { createSelector } from "reselect";

const selectUser = (state) => state.user;

export const selectCurrentUser = createSelector(
  [selectUser],
  (user) => user.currentUser
);
export const selectDisplayName = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser.displayName
);
export const SelectHidden = createSelector([selectUser], (user) => user.hidden);
