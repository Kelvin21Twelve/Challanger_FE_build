import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { getRefundReceipt } from "./endpoints";

export function useRefundReceipt() {
  return useMutation({
    mutationKey: ["get-refund-receipt"],
    mutationFn: async (job_id) => {
      const response = await axios.post(getRefundReceipt, { job_id });
      const data = response?.data?.data;
      const { success, view } = data || {};

      if (success && view && typeof window !== "undefined") window.open(view);

      return data;
    },
    gcTime: 0,
  });
}
