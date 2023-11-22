import { combineReducers } from 'redux';

import { reducer as authReducer } from './auth';
import { reducer as crudReducer } from './crud';
import { reducer as erpReducer } from './erp';
import { reducer as settingsReducer } from './settings';
import { reducer as translateReducer } from './translate';

// Combine all reducers.

const rootReducer = combineReducers({
  auth: authReducer,
  crud: crudReducer,
  erp: erpReducer,
  settings: settingsReducer,
  translate: translateReducer,
});

// const rootReducer = (state, action) => {
//   return appReducer(state, action);
// };

export default rootReducer;
