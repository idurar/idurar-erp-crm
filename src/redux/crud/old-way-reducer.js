import * as actionTypes from "./types";

const INITIAL_STATE = {
  current: {
    item: null,
  },
  list: {
    items: [],
    loading: false,
    pagination: {
      current: 1,
      defaultCurrent: 1,
      pageSize: 10,
      total: 1,
    },
    success: false,
  },
  create: {
    item: null,
    loading: false,
    success: false,
  },
  update: {
    item: null,
    loading: false,
    success: false,
  },
  delete: {
    item: null,
    loading: false,
    success: false,
  },
  read: {
    item: null,
    loading: false,
    success: false,
  },
  search: {
    items: [],
    loading: false,
    success: false,
  },
};

const crudReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.CURRENT_ITEM:
      return {
        ...state,
        current: {
          item: action.payload,
        },
      };
    case actionTypes.CREATE_REQUEST:
      return {
        ...state,
        create: {
          ...state.create,
          loading: true,
        },
      };
    case actionTypes.CREATE_FAILED:
      return {
        ...state,
        create: {
          ...state.create,
          loading: false,
          success: false,
        },
      };
    case actionTypes.CREATE_SUCCESS:
      return {
        ...state,
        create: {
          item: action.payload.result,
          loading: false,
          success: true,
        },
      };
    case actionTypes.READ_REQUEST:
      return {
        ...state,
        read: {
          ...state.read,
          loading: true,
        },
      };
    case actionTypes.READ_FAILED:
      return {
        ...state,
        read: {
          ...state.read,
          loading: false,
          success: false,
        },
      };
    case actionTypes.READ_SUCCESS:
      return {
        ...state,
        read: {
          item: action.payload.result,
          loading: false,
          success: true,
        },
      };
    case actionTypes.UPDATE_REQUEST:
      return {
        ...state,
        update: {
          ...state.update,
          loading: true,
        },
      };
    case actionTypes.UPDATE_FAILED:
      return {
        ...state,
        update: {
          ...state.update,
          loading: false,
          success: false,
        },
      };
    case actionTypes.UPDATE_SUCCESS:
      return {
        ...state,
        update: {
          item: action.payload.result,
          loading: false,
          success: true,
        },
      };
    case actionTypes.DELETE_REQUEST:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: true,
        },
      };
    case actionTypes.DELETE_FAILED:
      return {
        ...state,
        delete: {
          ...state.delete,
          loading: false,
          success: false,
        },
      };
    case actionTypes.DELETE_SUCCESS:
      return {
        ...state,
        delete: {
          item: action.payload.result,
          loading: false,
          success: true,
        },
      };
    case actionTypes.SEARCH_REQUEST:
      return {
        ...state,
        search: {
          ...state.search,
          loading: true,
        },
      };
    case actionTypes.SEARCH_FAILED:
      return {
        ...state,
        search: {
          ...state.search,
          loading: false,
          success: false,
        },
      };
    case actionTypes.SEARCH_SUCCESS:
      return {
        ...state,
        search: {
          items: action.payload.result,
          loading: false,
          success: true,
        },
      };
    case actionTypes.LIST_REQUEST:
      return {
        ...state,
        list: {
          ...state.list,
          loading: true,
        },
      };
    case actionTypes.LIST_FAILED:
      return {
        ...state,
        list: {
          ...state.list,
          loading: false,
          success: false,
        },
      };
    case actionTypes.LIST_SUCCESS:
      return {
        ...state,
        list: {
          items: action.payload.result || [...state.list.items],
          loading: false,
          success: true,
          pagination: {
            ...state.list.pagination,
            current: parseInt(action.payload.pagination.page) || [
              ...state.list.pagination["current"],
            ],
            pageSize: action.payload.pagination.pageSize || 10,
            total: action.payload.pagination.count || 10,
          },
        },
      };
    default:
      return state;
  }
};

export default crudReducer;
