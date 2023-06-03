import * as actionTypes from './types';

const INITIAL_SETTINGS_STATE = {
  generalSettings: {},
  paymentSettings: {},
  invoiceSettings: {},
  companySettings: {},
  appSettings: {},
  userProfils: {},
  moneyFormat: {
    currencySymbol: '$',
    currencyPosition: 'before',
    decimalSep: '.',
    ThousandSep: ',',
    centPrecision: 2,
    zeroFormat: false,
  },
};

const INITIAL_KEY_STATE = {
  result: null,
  current: null,
  isLoading: false,
  isSuccess: false,
};

const INITIAL_STATE = {
  current: {
    result: INITIAL_SETTINGS_STATE,
  },
  create: INITIAL_KEY_STATE,
  update: INITIAL_KEY_STATE,
  read: INITIAL_KEY_STATE,
};

const settingsReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState, settingsKey } = action;
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
    case actionTypes.SET_STATE:
      return {
        ...state,
        [settingsKey]: {
          ...state[settingsKey],
          [keyState]: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          isLoading: false,
          isSuccess: false,
        },
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          result: payload,
          isLoading: false,
          isSuccess: true,
        },
      };
    case actionTypes.CURRENT_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_KEY_STATE,
          current: payload,
        },
      };
    case actionTypes.RESET_ACTION:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_STATE[keyState],
        },
      };
    default:
      return state;
  }
};

export default settingsReducer;
