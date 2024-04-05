import { useEffect, useState } from 'react';
import { isObject } from '@/utils/valueType';
var NetworkEventType;
(function (NetworkEventType) {
  NetworkEventType['ONLINE'] = 'online';
  NetworkEventType['OFFLINE'] = 'offline';
  NetworkEventType['CHANGE'] = 'change';
})(NetworkEventType || (NetworkEventType = {}));
function getConnection() {
  const nav = navigator;
  if (!isObject(nav)) return null;
  return nav.connection || nav.mozConnection || nav.webkitConnection;
}
function getConnectionProperty() {
  const c = getConnection();
  if (!c) return {};
  return {
    rtt: c.rtt,
    type: c.type,
    saveData: c.saveData,
    downlink: c.downlink,
    downlinkMax: c.downlinkMax,
    effectiveType: c.effectiveType,
  };
}
function useNetwork() {
  const [state, setState] = useState(() => {
    return Object.assign(
      {
        since: undefined,
        online: navigator === null || navigator === void 0 ? void 0 : navigator.onLine,
      },
      getConnectionProperty()
    );
  });
  useEffect(() => {
    const onOnline = () => {
      setState((prevState) =>
        Object.assign(Object.assign({}, prevState), { online: true, since: new Date() })
      );
    };
    const onOffline = () => {
      setState((prevState) =>
        Object.assign(Object.assign({}, prevState), { online: false, since: new Date() })
      );
    };
    const onConnectionChange = () => {
      setState((prevState) => Object.assign(Object.assign({}, prevState), getConnectionProperty()));
    };
    window.addEventListener(NetworkEventType.ONLINE, onOnline);
    window.addEventListener(NetworkEventType.OFFLINE, onOffline);
    const connection = getConnection();
    connection === null || connection === void 0
      ? void 0
      : connection.addEventListener(NetworkEventType.CHANGE, onConnectionChange);
    return () => {
      window.removeEventListener(NetworkEventType.ONLINE, onOnline);
      window.removeEventListener(NetworkEventType.OFFLINE, onOffline);
      connection === null || connection === void 0
        ? void 0
        : connection.removeEventListener(NetworkEventType.CHANGE, onConnectionChange);
    };
  }, []);
  return state;
}
export default useNetwork;
