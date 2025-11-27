import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCommonInsertUpdate(apiModel, syncDbModel, record) {
  const queryClient = useQueryClient();

  const queryData = useMutation({
    mutationKey: ["common-insert-update", apiModel, syncDbModel, record],
    mutationFn: async (payload) => {
      const { id } = payload || {};
      const apiCall =
        typeof id !== "undefined"
          ? axios.put("/" + apiModel + "_update/" + id, payload)
          : axios.post(
              "/" + apiModel + "_insert" + (record ? record : ""),
              payload,
            );

      const response = await apiCall;
      return response?.data;
    },
    onSuccess: (response, payload) => {
      if (!response.success) return;

      try {
        const isEdit = !!payload?.id;
        const { id } = payload || {};

        if (!isEdit) {
          queryClient.setQueryData(["sync-db", syncDbModel], (oldData) => {
            return { data: [response.data, ...oldData.data] };
          });
        } else {
          queryClient.setQueryData(["sync-db", syncDbModel], (oldData) => ({
            data: oldData.data.map((item) =>
              item.id == id ? response.data : item,
            ),
          }));
        }
      } catch {}
    },
  });

  const { isError, isPending, data, ...rest } = queryData;
  const isSuccess = !!data?.success;
  const isLoading = isPending && !isSuccess && !isError;

  return {
    ...rest,
    data,
    isError,
    isPending,
    isSuccess,
    isLoading,
  };
}
