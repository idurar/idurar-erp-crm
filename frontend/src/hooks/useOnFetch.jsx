import { useCallback, useState } from 'react';

export default function useOnFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFetch = useCallback(async (callback) => {
    setIsLoading(true);

    try {
      const data = await callback;
      setResult(data.result);
      setIsSuccess(data.success === true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { onFetch, result, isSuccess, isLoading };
}
