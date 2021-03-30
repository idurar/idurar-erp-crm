import * as actionTypes from "./types";
import { request } from "@/request";

export const addNewCustomer = (target, jsonData) => async (dispatch) => {
  const data = await request.create(target, jsonData);
  if (data.success === true) {
    dispatch({
      type: actionTypes.ADD_NEW_CUSTOMER,
      payload: data,
    });
    refreshTable(target, 1, dispatch);
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};

const refreshTable = async (target, currentPage, dispatch) => {
  dispatch({
    type: actionTypes.LOADING_CUSTOMERS,
    payload: { loading: true },
  });
  const data = await request.list(target, { page: currentPage });

  if (data.success === true) {
    dispatch({
      type: actionTypes.LOAD_CUSTOMERS,
      payload: data,
    });
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};

export const loadCustomers = (target, currentPage) => async (dispatch) => {
  refreshTable(target, currentPage, dispatch);
};
