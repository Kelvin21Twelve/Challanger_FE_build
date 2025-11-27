import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardCreatedDetailsEndpoint } from "./endpoints";

export function useGetJobCardCreatedDetails(job_no) {
  return useQuery({
    queryKey: ["get-job-card-created-details", job_no],
    queryFn: async () => {
      const form = new FormData();
      form.set("job_no", job_no);

      const response = await axios.post(jobCardCreatedDetailsEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data || {};
    },
  });
}
