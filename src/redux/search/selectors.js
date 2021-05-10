import { createSelector } from "reselect";

export const searchState = (state) => state.search;

export const selectSearch = (keyRef) => (state) => state.search[keyRef];
// export const selectSearch = (keyRef) =>
//   createSelector([searchState], (search) => search[keyRef]);

// export const selectListItems = createSelector(
//   [selectCrud],
//   (crud) => crud.list
// );
