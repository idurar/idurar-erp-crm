import { combineReducers } from 'redux';

import { reducer as authReducer } from './auth';
import { reducer as crudReducer } from './crud';
import { reducer as erpReducer } from './erp';
import { reducer as settingsReducer } from './settings';
import { reducer as translateReducer } from './translate';

// Combine all reducers.

const appReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  erp: erpReducer,
  settings: settingsReducer,
  translate: translateReducer,
});

const rootReducer = (state, action) => {
  console.log('🚀 ~ file: rootReducer.js:47 ~ rootReducer ~ state:', state);
  // need to clean redux on logout
  // if (action.type === 'AUTH_LOGOUT_SUCCESS') {
  // }
  return appReducer(state, action);
};

export default rootReducer;
