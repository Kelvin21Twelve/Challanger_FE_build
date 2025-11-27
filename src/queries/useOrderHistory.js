import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getOrderHistoryEndpoint } from "./endpoints";

export function useOrderHistory(invNo) {
  return useQuery({
    enabled: !!invNo,
    queryKey: ["get-order-history", invNo],
    queryFn: async () => {
      const form = new FormData();
      form.append("inv_no", invNo);

      const response = await axios.post(getOrderHistoryEndpoint, form);
      return response?.data;
    },
  });
}
