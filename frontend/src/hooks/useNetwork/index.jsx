import { useEffect, useState } from 'react';

export default function useNetwork() {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);
  useEffect(() => {
    setNetwork(window.navigator.onLine);
  }, [window.navigator.onLine]);
  return [isOnline];
}
