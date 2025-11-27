import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { searchCabEndpoint } from "./endpoints";

export function useSearchCabMutation() {
  return useMutation({
    mutationKey: ["search-cab"],
    mutationFn: async (payload) => {
      const response = await axios.post(searchCabEndpoint, payload);
      return response.data;
    },
    gcTime: 0,
  });
}
