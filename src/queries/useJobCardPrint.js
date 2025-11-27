import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobPrintCustomerPaymentsEndpoint } from "./endpoints";

export function useJobCardPrint(jobId) {
  return useMutation({
    mutationKey: ["get-job-card-print", jobId],
    mutationFn: async () => {
      const form = new FormData();
      form.set("id", jobId);
      form.set("module", "job_card");

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
