import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getLogoEndpoint } from "./endpoints";

export function useGetLogo() {
  return useQuery({
    queryKey: ["get-logo"],
    queryFn: async () => {
      const response = await axios.get(getLogoEndpoint);
      return response?.data?.data;
    },
  });
}
