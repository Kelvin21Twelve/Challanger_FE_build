import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobPrintCustomerPaymentsEndpoint } from "./endpoints";

export function useJobCardPaymentsPrint(jobId) {
  return useMutation({
    mutationKey: ["get-job-card-payments-print", jobId],
    mutationFn: async () => {
      const form = new FormData();
      form.set("id", jobId);
      form.set("module", "customer_payment");

      const response = await axios.post(
        jobPrintCustomerPaymentsEndpoint,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data || {};
    },
  });
}
