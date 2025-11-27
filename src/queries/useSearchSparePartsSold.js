import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { sparePartsSoldEndpoint } from "./endpoints";

export function useSearchSparePartsSold() {
  return useMutation({
    mutationKey: ["get-spare-parts-sold"],
    mutationFn: async (payload) => {
      const response = await axios.post(sparePartsSoldEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, new_spare_parts, used_spare_parts } =
        response?.data || {};

      if (success) {
        return {
          success,
          data: [...(new_spare_parts || []), ...(used_spare_parts || [])],
        };
      } else return response.data;
    },
  });
}
