import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCompleteJobDetailsEndpoint } from "./endpoints";

export function useGetCompleteJobDetails(id) {
  return useQuery({
    enabled: !!id,
    queryKey: ["get-complete-job-details", id],
    queryFn: async () => {
      const response = await axios.post(getCompleteJobDetailsEndpoint, {
        job_id: id,
      });

      return response?.data?.data;
    },
  });
}
