import { useState } from 'react';

export default function useOnFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  let onFetch = async (callback) => {
    setIsLoading(true);

    const data = await callback;
    setResult(data.result);
    if (data.success === true) {
      setIsSuccess(true);
    } else {
      setIsSuccess(false);
    }
    setIsLoading(false);
  };

  return { onFetch, result, isSuccess, isLoading };
}
