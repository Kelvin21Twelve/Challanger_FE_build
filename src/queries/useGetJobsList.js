import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobListEndpoint } from "./endpoints";

export function useGetJobsList(status, customerIds) {
  return useQuery({
    queryKey: ["get-job-list", status, customerIds],
    queryFn: async () => {
      const endpoint = customerIds
        ? jobListEndpoint
            .replace(":status", "")
            .replace(":cust_id", customerIds)
        : jobListEndpoint.replace(":status", status).replace(":cust_id", "");

      const response = await axios.get(endpoint);
      return response?.data;
    },
  });
}
