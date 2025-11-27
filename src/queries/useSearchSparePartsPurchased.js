import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { searchSparePartsPurchasedEndpoint } from "./endpoints";

export function useSearchSparePartsPurchased() {
  return useMutation({
    mutationKey: ["search-spare-parts-purchased"],
    mutationFn: async (payload) => {
      const response = await axios.post(
        searchSparePartsPurchasedEndpoint,
        payload,
      );

      const { success, purchased_spare_parts } = response?.data || {};

      if (success) {
        return {
          success,
          data: purchased_spare_parts,
        };
      }

      return response?.data;
    },
  });
}
