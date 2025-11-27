import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobCardAddLabourEndpoint } from "./endpoints";

export function useAddJobCardLabour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-job-card-labour"],
    mutationFn: async (payload) => {
      const response = await axios.post(jobCardAddLabourEndpoint, payload);
      return response?.data;
    },
    onSuccess: ({ success, data }, payload) => {
      if (success) {
        const { job_id } = payload;

        queryClient.setQueryData(
          ["get-job-card-labours-invoices", job_id],
          (oldData) => ({
            data: [...(oldData?.data || []), data],
          }),
        );
      }
    },
  });
}
