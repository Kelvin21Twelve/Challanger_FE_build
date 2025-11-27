"use client";

import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { commonDeleteEndpoint } from "./endpoints";

export function useCommonDelete(model) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["common_delete", model],
    mutationFn: async (id) => {
      const response = await axios.put(commonDeleteEndpoint + id, { model });
      return response.data;
    },
    onSuccess: ({ success }, deleteId) => {
      try {
        if (success) {
          queryClient.setQueryData(["sync-db", model], (oldData) => {
            return {
              data: oldData?.data?.filter?.((item) => item.id !== deleteId),
            };
          });
        }
      } catch {}
    },
  });
}
