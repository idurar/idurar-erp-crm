import { useState } from "react";

export default function useFetch() {
  const [result, setResult] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (fetchingFn) => {
    setIsLoading(true);
    const data = await fetchingFn();
    if (data.success === true) {
      setIsSuccess(true);
      setResult(data.result);
    }
    setIsLoading(false);
  };

  return { onSubmit, result, isSuccess, isLoading };
}
