import { createSelector } from 'reselect';

const selectCrud = (state) => state.crud;

export const selectCurrentItem = createSelector([selectCrud], (crud) => crud.current);

export const selectListItems = createSelector([selectCrud], (crud) => crud.list);
export const selectItemById = (itemId) =>
  createSelector(selectListItems, (list) => list.result.items.find((item) => item._id === itemId));

export const selectCreatedItem = createSelector([selectCrud], (crud) => crud.create);

export const selectUpdatedItem = createSelector([selectCrud], (crud) => crud.update);

export const selectReadItem = createSelector([selectCrud], (crud) => crud.read);

export const selectDeletedItem = createSelector([selectCrud], (crud) => crud.delete);

export const selectSearchedItems = createSelector([selectCrud], (crud) => crud.search);
