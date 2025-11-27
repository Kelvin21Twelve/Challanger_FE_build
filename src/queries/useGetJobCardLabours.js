import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardLabourListEndpoint } from "./endpoints";

export function useGetJobCardLabours(job_id) {
  return useQuery({
    gcTime: 0,
    staleTime: 0,
    refetchInterval: 0,
    queryKey: ["get-job-card-labours-invoices", job_id],
    queryFn: async () => {
      const response = await axios.post(jobCardLabourListEndpoint, {
        job_id,
      });

      return response?.data;
    },
  });
}
