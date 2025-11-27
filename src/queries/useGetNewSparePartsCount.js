import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { newSparePartsCountEndpoint } from "./endpoints";

export function useNewGetSparePartsCount() {
  return useQuery({
    queryKey: ["get-new-spare-parts-count"],
    queryFn: async () => {
      const response = await axios.get(newSparePartsCountEndpoint);
      return response?.data;
    },
  });
}
