import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getItemCodeEndpoint } from "./endpoints";

export function useGetItemCode() {
  return useQuery({
    queryKey: ["get-item-code"],
    queryFn: async () => {
      const response = await axios.get(getItemCodeEndpoint);
      return response?.data;
    },
  });
}
