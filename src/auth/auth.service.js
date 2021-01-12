import React from "react";

import { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../config/serverApiConfig";
import UserContext from "../context/UserContext";

export default function logout(userData, setUserData) {
  console.log(`before logout : ${userData.user.name}`);
  setUserData({
    token: undefined,
    user: undefined,
  });
  // localStorage.setItem(ACCESS_TOKEN_NAME, "");
  console.log(`after logout : ${userData.user.name}`);
  localStorage.removeItem(ACCESS_TOKEN_NAME);
  // history.push("/login");
}
