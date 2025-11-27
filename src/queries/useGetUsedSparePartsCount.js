import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { usedSparePartsCountEndpoint } from "./endpoints";

export function useGetUsedSparePartsCount() {
  return useQuery({
    queryKey: ["get-used-spare-parts-count"],
    queryFn: async () => {
      const response = await axios.get(usedSparePartsCountEndpoint);
      return response?.data;
    },
  });
}
