import { useEffect, useState } from "react";

export default function useNetwork() {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);
  const updateNetwork = () => {
    setNetwork(window.navigator.onLine);
  };
  useEffect(() => {
    // window.ononline = () => {
    //   updateNetwork();
    // };

    // window.onoffline = () => {
    //   updateNetwork();
    // };
    // window.addEventListener("offline", updateNetwork);
    // window.addEventListener("online", updateNetwork);
    // return () => {
    //   window.removeEventListener("offline", updateNetwork);
    //   window.removeEventListener("online", updateNetwork);
    // };
    setNetwork(window.navigator.onLine);
  }, [window.navigator.onLine]);
  console.log("network :", isOnline);
  return { isOnline };
}
