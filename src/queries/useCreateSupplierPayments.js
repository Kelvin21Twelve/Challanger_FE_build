import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createSupplierPaymentEndpoint } from "./endpoints";

export function useCreateSupplierPayments() {
  return useMutation({
    mutationKey: ["create-supplier-payment"],
    mutationFn: async (payload) => {
      const response = await axios.post(
        createSupplierPaymentEndpoint,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      return response.data;
    },
  });
}
