import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardPaymentsTableEndpoint } from "./endpoints";

export function useGetJobCardPaymentList(job_no) {
  return useQuery({
    queryKey: ["get-job-card-payment-details", job_no],
    queryFn: async () => {
      const form = new FormData();
      form.set("job_no", job_no);
      const response = await axios.post(jobCardPaymentsTableEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    },
    gcTime: 0,
    staleTime: 0,
  });
}
