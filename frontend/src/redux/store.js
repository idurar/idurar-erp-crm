import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import lang from '@/locale/translation/en_us';

import rootReducer from './rootReducer';
import storePersist from './storePersist';

let middleware = [thunk];

let configStore = applyMiddleware(...middleware);

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

configStore = composeEnhancers(applyMiddleware(...middleware));

const INITIAL_LANG_STATE = {
  ...lang,
};

const LANG_INITIAL_STATE = {
  result: INITIAL_LANG_STATE,
  langCode: 'en_us',
  isLoading: false,
  isSuccess: false,
};

const lang_state = storePersist.get('translate')
  ? storePersist.get('translate')
  : LANG_INITIAL_STATE;

const AUTH_INITIAL_STATE = {
  current: null,
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const auth_state = storePersist.get('auth') ? storePersist.get('auth') : AUTH_INITIAL_STATE;

const initialState = { translate: lang_state, auth: auth_state };
const store = createStore(rootReducer, initialState, configStore);

export default store;
