import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getCarDetailsEndpoint } from "./endpoints";

export function useGetCarDetails() {
  return useQuery({
    queryKey: ["get-car-details"],
    queryFn: async () => {
      const response = await axios.post(getCarDetailsEndpoint);
      return response?.data;
    },
  });
}
