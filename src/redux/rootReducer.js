import { combineReducers } from "redux";

import { reducer as shoppingReducer } from "./shopping";

const rootReducer = combineReducers({
  shop: shoppingReducer,
});

export default rootReducer;
