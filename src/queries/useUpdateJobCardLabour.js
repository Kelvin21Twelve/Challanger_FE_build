import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { jobCardUpdateLabourEndpoint } from "./endpoints";

export function useUpdateJobCardLabour(id) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["add-job-card-labour", id],
    mutationFn: async (payload) => {
      const response = await axios.put(
        jobCardUpdateLabourEndpoint.replace(":id", id),
        payload,
      );

      return response?.data;
    },
    onSuccess: ({ success, data }, payload) => {
      if (success) {
        const { job_id } = payload;

        queryClient.setQueryData(
          ["get-job-card-labours-invoices", job_id],
          (oldData) => ({
            data: (oldData?.data || []).map((item) =>
              item.id === id ? data : item,
            ),
          }),
        );
      }
    },
  });
}
