import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCabHistoryEndpoint } from "./endpoints";

export function useCabHistory(cabNo) {
  return useQuery({
    queryKey: ["get-cab-history", cabNo],
    queryFn: async () => {
      const response = await axios.get(
        getCabHistoryEndpoint.replace(":cab_no", cabNo),
      );

      return response?.data?.data;
    },
  });
}
