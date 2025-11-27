import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getUserPartsEndpoint } from "./endpoints";

export function useGetUsedSpareParts() {
  return useQuery({
    queryKey: ["get-used-spare-parts"],
    queryFn: async () => {
      const response = await axios.post(getUserPartsEndpoint);
      return response?.data?.data;
    },
  });
}
