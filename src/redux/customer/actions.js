import * as actionTypes from "./types";
import { listSync, createSync } from "../../axiosRequest";

export const addNewCustomer = (target, jsonData) => async (dispatch) => {
  const ajaxCall = createSync({ target, jsonData });
  ajaxCall.then(function (response) {
    if (response.success === true) {
      dispatch({
        type: actionTypes.ADD_NEW_CUSTOMER,
        payload: response,
      });
      refreshTable(target, 1, dispatch);
    } else {
      dispatch({
        type: actionTypes.FAILLED_REQUEST,
        payload: response,
      });
    }
  });
};

const refreshTable = (target, currentPage, dispatch) => {
  dispatch({
    type: actionTypes.LOADING_CUSTOMERS,
    payload: { loading: true },
  });
  const ajaxCall = listSync({
    target: target,
    option: { page: currentPage },
  });
  ajaxCall.then(function (response) {
    if (response.success === true) {
      dispatch({
        type: actionTypes.LOAD_CUSTOMERS,
        payload: response,
      });
    } else {
      dispatch({
        type: actionTypes.FAILLED_REQUEST,
        payload: response,
      });
    }
  });
};

export const loadCustomers = (target, currentPage) => async (dispatch) => {
  refreshTable(target, currentPage, dispatch);
};
