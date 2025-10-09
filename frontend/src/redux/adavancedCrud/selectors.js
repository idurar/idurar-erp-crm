import { createSelector } from 'reselect';

const selectAdavancedCrud = (state) => state.adavancedCrud;

export const selectCurrentItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.current
);

export const selectListItems = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.list
);
export const selectItemById = (itemId) =>
  createSelector(selectListItems, (list) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.create
);

export const selectUpdatedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.update
);

export const selectReadItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.read
);

export const selectDeletedItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.delete
);

export const selectSearchedItems = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.search
);
export const selectMailItem = createSelector(
  [selectAdavancedCrud],
  (adavancedCrud) => adavancedCrud.mail
);
