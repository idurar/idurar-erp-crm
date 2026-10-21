import { useEffect } from 'react';
import useTimeoutFn from './useTimeoutFn';

export default function useDebounce(fn, ms = 0, dependency) {
  const [isReady, cancel, reset] = useTimeoutFn(fn, ms);

  useEffect(() => {
    reset();
  }, [dependency, reset]);

  return [isReady, cancel];
}
