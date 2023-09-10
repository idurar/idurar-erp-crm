import { useEffect, useState } from 'react';

function useFetchData(fetchFunction,updateVal) {
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
  }, [isLoading,updateVal]);

  return { data, isLoading, isSuccess, error };
}

export default function useFetch(fetchFunction,updateVal=false) {
  //updateVal is an additional prop to run fetch again on its update
  const { data, isLoading, isSuccess, error } = useFetchData(fetchFunction,updateVal);

  return { result: data, isLoading, isSuccess, error };
}
