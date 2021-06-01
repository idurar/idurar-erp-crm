import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectAuth } from "@/redux/auth/selectors";

export default function useFetch() {
  const [isAuthenticated, setAuth] = useState(false);
  const { isLoggedIn } = useSelector(selectAuth);
  useEffect(() => {
    setAuth(isLoggedIn);
  }, [isLoggedIn]);
  return { isAuthenticated };
}
