import * as actionTypes from "./types";

const INITIAL_STATE = {
  current: {
    result: null,
  },
  list: {
    result: {
      data: [],
      pagination: {
        current: 1,
        defaultCurrent: 1,
        pageSize: 10,
        total: 1,
      },
    },
    loading: false,
    success: false,
  },
  create: {
    result: null,
    loading: false,
    success: false,
  },
  update: {
    result: null,
    loading: false,
    success: false,
  },
  delete: {
    result: null,
    loading: false,
    success: false,
  },
  read: {
    result: null,
    loading: false,
    success: false,
  },
  search: {
    result: [],
    loading: false,
    success: false,
  },
};

const crudReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          result: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          loading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          loading: false,
          success: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          result: payload,
          loading: false,
          success: true,
        },
      };

    default:
      return state;
  }
};

export default crudReducer;
