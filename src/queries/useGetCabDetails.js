import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCabDetailsEndpoint } from "./endpoints";

export function useGetCabDetails(cabNo) {
  return useQuery({
    enabled: !!cabNo,
    queryKey: ["get-cab-details", cabNo],
    queryFn: async () => {
      const response = await axios.post(getCabDetailsEndpoint, {
        cab_id: cabNo,
      });
      return response?.data;
    },
  });
}
