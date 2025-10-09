import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";

export default function AuthSuccess() {
  const history = useHistory();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("idurar_token", token);
      history.replace("/dashboard");
    } else {
      history.replace("/login");
    }
  }, [history]);

  return <div>Signing you in...</div>;
}
