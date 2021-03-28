import { createSelector } from "reselect";
const SelectUser = (state) => state.user;

export const SelectUserItem = createSelector(
  [SelectUser],
  (user) => user.currentUser
);
