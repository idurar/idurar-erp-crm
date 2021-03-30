import * as actionTypes from "./types";

const INITIAL_STATE = {
  list: [],
  loading: false,
  pagination: {
    current: 1,
    defaultCurrent: 1,
    pageSize: 10,
    total: 1,
  },
  current: {
    item: null,
    loading: false,
  },
  update: null,
  read: null,
  delete: null,
  search: null,
};

const crudReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.FAILED_REQUEST:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.LOADING_LIST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.CREATE_ITEM:
      return {
        ...state,
        current: { item: action.payload, loading: false },
      };
    case actionTypes.UPDATE_ITEM:
      return {
        ...state,
        current: { item: action.payload, loading: false },
      };
    case actionTypes.DELETE_ITEM:
      return {
        ...state,
        current: { item: null, loading: false },
      };
    case actionTypes.LIST_ITEMS:
      return {
        ...state,
        list: action.payload.result || [...state.list],
        loading: false,
        pagination: {
          ...state.pagination,
          current: parseInt(action.payload.pagination.page) || [
            ...state.pagination["current"],
          ],
          pageSize: action.payload.pagination.pageSize || 10,
          total: action.payload.pagination.count || 10,
        },
      };
    default:
      return state;
  }
};

export default crudReducer;
