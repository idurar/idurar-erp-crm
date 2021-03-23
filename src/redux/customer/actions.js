import * as actionTypes from "./types";

export const addNewCustomer = (item) => {
  return {
    type: actionTypes.ADD_NEW_CUSTOMER,
    payload: {
      item: item
    }
  }
}