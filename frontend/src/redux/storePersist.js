function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    console.error(e.message);
    return false;
  }
  return true;
}

export const localStorageHealthCheck = () => {
  for (var i = 0, len = localStorage.length; i < len; ++i) {
    console.log(localStorage.getItem(localStorage.key(i)));
    const result = window.localStorage.getItem(localStorage.key(i));
    if (!isJsonString(result)) {
      console.error('error parsing this localstorage key , removed  :', localStorage.key(i));
      window.localStorage.removeItem(localStorage.key(i));
    }
  }
};

export const storePersist = {
  set: (key, state) => {
    window.localStorage.setItem(key, JSON.stringify(state));
  },
  get: (key) => {
    // localStorageHealthCheck();
    const result = window.localStorage.getItem(key);
    if (!result) {
      if (key === 'auth') {
        window.localStorage.removeItem('isLoggedIn');
      }
      return false;
    }
    if (isJsonString(result)) {
      return JSON.parse(result);
    } else {
      window.localStorage.removeItem(key);
      if (key === 'auth') {
        window.localStorage.removeItem('isLoggedIn');
      }
      console.error(
        'error parsing in localStorage , all localstorage removed check this storage key :',
        key
      );
      return false;
    }
  },
  remove: (key) => {
    window.localStorage.removeItem(key);
  },
  getAll: () => {
    return window.localStorage;
  },
  clear: () => {
    window.localStorage.clear();
  },
};

export default storePersist;
