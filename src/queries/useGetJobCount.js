import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCountEndpoint } from "./endpoints";

export function useGetJobCount() {
  return useQuery({
    queryKey: ["get-job-count"],
    queryFn: async () => {
      const response = await axios.get(jobCountEndpoint);
      return response?.data;
    },
  });
}
