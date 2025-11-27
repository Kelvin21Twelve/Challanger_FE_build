import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCabsListEndpoint } from "./endpoints";

export function useGetCab(status) {
  return useQuery({
    queryKey: ["get-cab", status],
    queryFn: async () => {
      const response = await axios.get(
        getCabsListEndpoint + "?status=" + status,
      );
      return response?.data;
    },
    gcTime: 0,
    staleTime: 0,
  });
}
