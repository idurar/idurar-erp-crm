import { useQuery } from "@tanstack/react-query";

function useReactQuery(keyArray,fetchFunction,options={}){
    const { data, isLoading, isSuccess, error } = useQuery(keyArray,fetchFunction,options);
    let result = null;
    if(data&&data.success) result = data;
    return { result, isLoading, isSuccess, error };
}

export default useReactQuery;