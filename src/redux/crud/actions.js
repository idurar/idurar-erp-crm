import * as actionTypes from "./types";
import { request } from "@/request";

export const createAction = (entity, jsonData) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "create",
    payload: null,
  });

  let data = await request.create(entity, jsonData);

  if (data.success === true) {
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "create",
      payload: data.result,
    });
    dispatch({
      type: actionTypes.CURRENT_ITEM,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "create",
      payload: null,
    });
  }
};
export const readAction = (entity, itemId) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "read",
    payload: null,
  });

  let data = await request.read(entity, itemId);

  if (data.success === true) {
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "read",
      payload: data.result,
    });
    dispatch({
      type: actionTypes.CURRENT_ITEM,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "read",
      payload: null,
    });
  }
};
export const updateAction = (entity, itemId, jsonData) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "update",
    payload: null,
  });

  let data = await request.update(entity, itemId, jsonData);

  if (data.success === true) {
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "update",
      payload: data.result,
    });
    dispatch({
      type: actionTypes.CURRENT_ITEM,
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "update",
      payload: null,
    });
  }
};

export const deleteAction = (entity, itemId) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "delete",
    payload: null,
  });

  let data = await request.delete(entity, itemId);

  if (data.success === true) {
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "delete",
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "delete",
      payload: null,
    });
  }
};

export const listAction = (entity, currentPage = 1) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "list",
    payload: null,
  });

  let data = await request.list(entity, { page: currentPage });

  if (data.success === true) {
    const result = {
      items: data.result,
      pagination: {
        current: data.pagination.page,
        defaultCurrent: 1,
        pageSize: 10,
        total: data.pagination.count,
      },
    };
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "list",
      payload: result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "list",
      payload: null,
    });
  }
};

export const searchAction = (entity, itemId) => async (dispatch) => {
  dispatch({
    type: actionTypes.REQUEST_LOADING,
    keyState: "search",
    payload: null,
  });

  let data = await request.search(entity, itemId);

  if (data.success === true) {
    dispatch({
      type: actionTypes.REQUEST_SUCCESS,
      keyState: "search",
      payload: data.result,
    });
  } else {
    dispatch({
      type: actionTypes.REQUEST_FAILED,
      keyState: "search",
      payload: null,
    });
  }
};

////////////////////////// **** crudAction **** //////////////////////////

// export const crudAction = (requestType, entity, ...args) => async (
//   dispatch
// ) => {
//   dispatch({
//     type: actionTypes.REQUEST_LOADING,
//     keyState: requestType,
//     payload: null,
//   });

//   let data = { success: false };

//   switch (requestType) {
//     case requestType === "list": {
//       const [currentPage] = args;
//       data = await request.list(entity, { page: currentPage });
//     }
//     case requestType === "create": {
//       const [jsonData] = args;
//       data = await request.create(entity, jsonData);
//     }
//     case requestType === "read": {
//       const [itemId] = args;
//       data = await request.read(entity, itemId);
//     }
//     case requestType === "update": {
//       const [jsonData, itemId] = args;
//       data = await request.update(entity, itemId, jsonData);
//     }
//     case requestType === "delete": {
//       const [itemId] = args;
//       data = await request.delete(entity, itemId);
//     }
//     case requestType === "search": {
//       const [source, option] = args;
//       data = await request.search(entity, source, option);
//     }
//   }

//   if (data.success === true) {
//     const result =
//       requestType === "list"
//         ? {
//             items: data.result,
//             pagination: {
//               current: data.pagination.page,
//               defaultCurrent: 1,
//               pageSize: 10,
//               total: data.pagination.count,
//             },
//           }
//         : data.result;
//     dispatch({
//       type: actionTypes.REQUEST_SUCCESS,
//       keyState: requestType,
//       payload: result,
//     });
//   } else {
//     dispatch({
//       type: actionTypes.REQUEST_FAILED,
//       keyState: requestType,
//       payload: null,
//     });
//   }
// };
