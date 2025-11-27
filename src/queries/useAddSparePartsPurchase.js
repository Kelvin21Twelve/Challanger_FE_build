import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { addSparePartsPurchaseEndpoint } from "./endpoints";

export function useAddSparePartsPurchase() {
  return useMutation({
    mutationKey: ["add-spare-parts-purchase"],
    mutationFn: async (payload) => {
      const response = await axios.post(
        addSparePartsPurchaseEndpoint,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data;
    },
  });
}
