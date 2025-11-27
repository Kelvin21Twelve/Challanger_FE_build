import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobCardRefundEndpoint } from "./endpoints";

export function useJobCardPaymentRefund() {
  return useMutation({
    mutationKey: ["add-job-card-refund"],
    mutationFn: async (payload) => {
      const response = await axios.post(jobCardRefundEndpoint, payload);
      return response?.data;
    },
  });
}
