import { combineReducers } from "redux";

import { reducer as authReducer } from "./auth";
import { reducer as uiReducer } from "./ui";
import { reducer as crudReducer } from "./crud";
import { reducer as customerReducer } from "./customer";

import * as actionTypes from "./auth/types";

// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  customers: customerReducer,
  crud: crudReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
