import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardUsedSparePartsListEndpoint } from "./endpoints";

export function useGetJobCardUsedSparePartsList() {
  return useQuery({
    queryKey: ["get-job-card-used-spare-parts-list"],
    queryFn: async () => {
      const response = await axios.get(jobCardUsedSparePartsListEndpoint);
      return response?.data;
    },
  });
}
