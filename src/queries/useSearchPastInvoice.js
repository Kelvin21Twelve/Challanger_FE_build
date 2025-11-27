import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { searchPastInvoiceEndpoint } from "./endpoints";

export function useSearchPastInvoice() {
  return useMutation({
    mutationKey: ["search-past-invoice"],
    mutationFn: async (payload) => {
      const keys = Object.keys(payload);
      const form = new FormData();
      keys.forEach((key) => {
        form.set(key, payload[key]);
      });

      const response = await axios.post(searchPastInvoiceEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const {
        success,
        JobCard,
        NewSparePurchase,
        CustomersNewSpareParts,
        CustomersUsedSpareParts,
      } = response?.data || {};
      if (success) {
        return {
          success,
          data: [
            ...(JobCard || []),
            ...(NewSparePurchase || []),
            ...(CustomersNewSpareParts || []),
            ...(CustomersUsedSpareParts || []),
          ],
        };
      }

      return response?.data;
    },
  });
}
