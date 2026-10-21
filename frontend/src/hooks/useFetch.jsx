import { useEffect, useState } from 'react';

function useFetchData(fetchFunction) {
  const [data, setData] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [isSuccess, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFunction();
        setData(data.result);
        setSuccess(true);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [fetchFunction]);

  return { data, isLoading, isSuccess, error };
}

export default function useFetch(fetchFunction) {
  const { data, isLoading, isSuccess, error } = useFetchData(fetchFunction);

  return { result: data, isLoading, isSuccess, error };
}
