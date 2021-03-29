import React from "react";
import Router from "@/router";
import { Router as RouterHistory } from "react-router-dom";
import history from "./utils/history";
import { Provider } from "react-redux";
import store from "./redux/store";

function App() {
  return (
    <RouterHistory history={history}>
      <Provider store={store}>
        <Router />
      </Provider>
    </RouterHistory>
  );
}

export default App;
