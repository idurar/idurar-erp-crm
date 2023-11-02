import { combineReducers } from 'redux';

import { reducer as authReducer } from './auth';
import { reducer as crudReducer } from './crud';
import { reducer as erpReducer } from './erp';
import { reducer as settingsReducer } from './settings';
import { reducer as translateReducer } from './translate';

import * as actionTypes from './auth/types';

// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  erp: erpReducer,
  settings: settingsReducer,
  translate: translateReducer,
});

const rootReducer = (state, action) => {
  if (action.type === actionTypes.LOGOUT_SUCCESS) {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
