import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobCardPaymentInsertEndpoint } from "./endpoints";

export function usePaymentInsert() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["payment-insert"],
    mutationFn: async (payload) => {
      const response = await axios.post(jobCardPaymentInsertEndpoint, payload);
      return response?.data;
    },
    onSuccess: (response) => {
      if (!response?.success) return;

      try {
        queryClient.setQueryData(["sync-db", "JobCardPayment"], (oldData) => ({
          ...oldData,
          data: [...(oldData?.data || []), ...(response?.data?.data || {})],
        }));
      } catch {}
    },
  });
}
