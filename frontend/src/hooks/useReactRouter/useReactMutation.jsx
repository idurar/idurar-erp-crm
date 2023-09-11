import { useMutation, useQueryClient} from "@tanstack/react-query";

function useReactMutation(fetchFunction,queryKey=null){
    const queryClient = useQueryClient();
    const { data, isLoading, isSuccess, error } = useMutation(
        fetchFunction,
        {
            onSuccess: () => {
                if(queryKey) queryClient.invalidateQueries({queryKey});
            }
        }
        );
    return { result: data?.result, isLoading, isSuccess, error };
}

export default useReactMutation;