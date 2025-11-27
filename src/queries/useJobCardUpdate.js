import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobCardUpdateEndpoint } from "./endpoints";

export function useJobCardUpdate(jobId) {
  return useMutation({
    mutationKey: ["job-card-update", jobId],
    mutationFn: async (payload) => {
      const response = await axios.put(
        jobCardUpdateEndpoint.replace(":id", jobId),
        payload,
      );

      if (!response.data.success)
        throw Error(
          response?.data?.msg || "Something went wrong data is not saved",
        );

      return response?.data?.data;
    },
  });
}
