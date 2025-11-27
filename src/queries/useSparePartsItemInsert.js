import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createCustomerSparePartsItemEndpoint } from "./endpoints";

export function useSparePartsItemInsert() {
  return useMutation({
    mutationKey: ["create-customer-spare-parts-items"],
    mutationFn: async (payload) => {
      const response = await axios.post(
        createCustomerSparePartsItemEndpoint,
        payload,
      );

      return response.data;
    },
  });
}
