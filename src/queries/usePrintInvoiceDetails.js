import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { printInvoiceDetailsEndpoint } from "./endpoints";

export function usePrintInvoiceDetails(invoiceNo) {
  return useMutation({
    mutationKey: ["get-print-invoice-details", invoiceNo],
    mutationFn: async () => {
      const form = new FormData();
      form.set("module", "print_invoice");
      form.set("id", invoiceNo);
      form.set("date", "");

      const response = await axios.post(printInvoiceDetailsEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, view } = response?.data;
      if (success) window.open(view);

      return response?.data;
    },
  });
}
