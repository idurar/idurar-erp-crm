import React, { useEffect, useCallback } from "react";
import { Button, Result } from "antd";
import { useDispatch } from "react-redux";
import { logout as logoutAction } from "@/redux/auth/actions";

const Logout = () => {
  const dispatch = useDispatch();
  // const callbackLogout = useCallback(async () => {
  //   await dispatch(logoutAction());
  // }, []);

  // useEffect(() => {
  //   callbackLogout();
  // }, []);

  useEffect(() => {
    async function asyncLogout() {
      await dispatch(logoutAction());
    }
    asyncLogout();
  }, []);

  return <></>;
};
export default Logout;
