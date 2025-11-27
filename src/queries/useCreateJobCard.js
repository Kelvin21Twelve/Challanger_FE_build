import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobCardInsertEndpoint } from "./endpoints";

export function useCreateJobCard() {
  return useMutation({
    mutationKey: ["create-job-card"],
    mutationFn: async (payload) => {
      const response = await axios.post(jobCardInsertEndpoint, payload);
      return response?.data;
    },
  });
}
