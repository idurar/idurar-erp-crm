import * as actionTypes from "./types";

const INITIAL_STATE = {
  customers: [
    {
      id: 1,
      company : "IDURAR WEB AGENCY",
      managerSurname : "mediheb hichri",
      managerName	: "Salah Eddine",
      email : "lalami@idurarweb.com"
    }
  ]
};

const customerReducer = (state = INITIAL_STATE , action) => {
  switch (action.type) {
    case actionTypes.ADD_NEW_CUSTOMER:

    return {
      customers: [...state.customers, {...action.payload.item}]
    }
    default:
      return state;
  }
}

export default customerReducer ;