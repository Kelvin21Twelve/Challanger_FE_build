import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCompleteJobsEndpoint } from "./endpoints";

export function useGetCompleteJobs() {
  return useQuery({
    queryKey: ["get-complete-jobs"],
    queryFn: async () => {
      const response = await axios.get(getCompleteJobsEndpoint);
      return response?.data?.data;
    },
  });
}
