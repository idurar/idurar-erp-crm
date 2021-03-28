import { combineReducers } from "redux";

import { reducer as authReducer } from "./auth";
import { reducer as customerReducer } from "./customer";

const rootReducer = combineReducers({
  auth: authReducer,
  customers: customerReducer,
});

export default rootReducer;
