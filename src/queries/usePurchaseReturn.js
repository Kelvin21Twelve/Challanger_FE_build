import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { purchaseReturnEndpoint } from "./endpoints";

export function usePurchaseReturn() {
  return useMutation({
    mutationKey: ["purchase-return"],
    mutationFn: async (payload) => {
      const response = await axios.post(purchaseReturnEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },
  });
}
