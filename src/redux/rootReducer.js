import { combineReducers } from "redux";

import { reducer as shoppingReducer } from "./shopping";
import { reducer as customerReducer } from "./customer";

const rootReducer = combineReducers({
  shop: shoppingReducer,
  customers: customerReducer,
});

export default rootReducer;
