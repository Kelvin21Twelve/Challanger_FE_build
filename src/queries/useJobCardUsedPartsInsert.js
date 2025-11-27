import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  jobUsedPartsInsertEndpoint,
  jobUsedPartsUpdateEndpoint,
} from "./endpoints";

export function useJobCardUsedPartsInsert(id) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["job-card-used-parts-insert", id],
    mutationFn: async (payload) => {
      const endpoint = id
        ? jobUsedPartsUpdateEndpoint.replace(":id", id)
        : jobUsedPartsInsertEndpoint;

      const callback = id ? axios.put : axios.post;
      const response = await callback(endpoint, payload);

      return response.data;
    },
    onSuccess: (response) => {
      if (!response.success) return;

      if (!id) {
        queryClient.setQueryData(
          ["sync-db", "CustomersUsedSpareParts"],
          (oldData) => ({
            data: [...(oldData?.data || []), response?.data],
          }),
        );
      } else {
        queryClient.setQueryData(
          ["sync-db", "CustomersUsedSpareParts"],
          (oldData) => ({
            data:
              oldData?.data?.map((item) =>
                item.id == id ? response?.data : item,
              ) || [],
          }),
        );
      }
    },
  });
}
