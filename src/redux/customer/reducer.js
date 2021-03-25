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
  current: null,
};

const customerReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.FAILLED_REQUEST:
      return {
        ...state,
        loading: false,
      };
    case actionTypes.ADD_NEW_CUSTOMER:
      return {
        ...state,
        current: action.payload,
      };
    case actionTypes.LOADING_CUSTOMERS:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.LOAD_CUSTOMERS:
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

export default customerReducer;
