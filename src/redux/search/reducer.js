import * as actionTypes from "./types";

const INITIAL_REF_STATE = {
  result: [],
  selected: null,
  isLoading: false,
  isSuccess: false,
};
const INITIAL_STATE = {};

const searchReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  switch (action.type) {
    case actionTypes.INIT_STATE: {
      let newState = {};
      payload.map((refKey) => (newState[refKey] = INITIAL_REF_STATE));
      return newState;
    }

    case actionTypes.RESET_STATE:
      return INITIAL_STATE;

    case actionTypes.RESET_REF:
      return {
        ...state,
        [keyState]: INITIAL_REF_STATE,
      };

    case actionTypes.CURRENT_SELECTED:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_REF_STATE,
          selected: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_REF_STATE,
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: INITIAL_REF_STATE,
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_REF_STATE,
          result: payload,
          isSuccess: true,
        },
      };

    default:
      return state;
  }
};

export default searchReducer;

// const INITIAL_REF_STATE = {
//   refKey: null,
//   result: [],
//   selected: null,
//   isLoading: false,
//   isSuccess: false,
// };
// const INITIAL_STATE = [INITIAL_REF_STATE];

// const searchReducer = (state = INITIAL_STATE, action) => {
//   const { payload, keyState } = action;
//   switch (action.type) {
//     case actionTypes.INIT_STATE: {
//       let newState = [];
//       payload.map((refKey) => newState.push({ ...INITIAL_REF_STATE, refKey }));
//       return {
//         newState,
//       };
//     }

//     case actionTypes.RESET_STATE:
//       return INITIAL_STATE;

//     case actionTypes.RESET_REF: {
//       const refIndex = state.findIndex((search) => search.refKey === keyState); //finding index of the item
//       const newState = [...state]; //making a new State
//       newState[refIndex] = {
//         ...INITIAL_REF_STATE,
//         refKey: keyState,
//       };
//       return {
//         newState,
//       };
//     }

//     case actionTypes.CURRENT_SELECTED: {
//       const refIndex = state.findIndex((search) => search.refKey === keyState); //finding index of the item
//       const newState = [...state]; //making a new State
//       newState[refIndex].selected = payload;
//       return {
//         newState,
//       };
//     }
//     case actionTypes.REQUEST_LOADING: {
//       const refIndex = state.findIndex((search) => search.refKey === keyState); //finding index of the item
//       const newState = [...state]; //making a new State
//       newState[refIndex] = {
//         ...INITIAL_REF_STATE,
//         refKey: keyState,
//         isLoading: true,
//       };
//       return {
//         newState,
//       };
//     }
//     case actionTypes.REQUEST_FAILED: {
//       const refIndex = state.findIndex((search) => search.refKey === keyState); //finding index of the item
//       const newState = [...state]; //making a new State
//       newState[refIndex] = {
//         ...INITIAL_REF_STATE,
//         refKey: keyState,
//       };

//       return {
//         newState,
//       };
//     }
//     case actionTypes.REQUEST_SUCCESS: {
//       const refIndex = state.findIndex((search) => search.refKey === keyState); //finding index of the item
//       const newState = [...state]; //making a new State
//       newState[refIndex] = {
//         ...INITIAL_REF_STATE,
//         refKey: keyState,
//         isSuccess: true,
//       };
//       return {
//         newState,
//       };
//     }

//     default:
//       return state;
//   }
// };

// export default searchReducer;
