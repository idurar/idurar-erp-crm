import * as actionTypes from "./types";
import * as uiActionTypes from "../ui/types";
import { request } from "@/request";

export const addNewCustomer = (entity, jsonData) => async (dispatch) => {
  const data = await request.create(entity, jsonData);
  if (data.success === true) {
    dispatch({
      type: actionTypes.ADD_NEW_CUSTOMER,
      payload: data,
    });
    refreshTable(entity, 1, dispatch);
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};

const refreshTable = async (entity, currentPage, dispatch) => {
  // dispatch({
  //   type: uiActionTypes.START_LOADING,
  //   payload: { actionName: "loadCustomers" },
  // });
  dispatch({
    type: actionTypes.LOADING_CUSTOMERS,
    payload: { loading: true },
  });
  const data = await request.list(entity, { page: currentPage });

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

export const loadCustomers = (entity, currentPage) => async (dispatch) => {
  refreshTable(entity, currentPage, dispatch);
};
