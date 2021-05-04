import { createSelector } from "reselect";
const authSelect = (state) => state.auth;

export const selectAuth = createSelector([authSelect], (auth) => auth);
export const selectCurrentUser = createSelector(
  [authSelect],
  (auth) => auth.current
);

export const isLoggedIn = createSelector(
  [authSelect],
  (auth) => auth.isLoggedIn
);
