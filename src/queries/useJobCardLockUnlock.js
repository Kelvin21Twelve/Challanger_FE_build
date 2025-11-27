import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobCardLockUnlockEndpoint } from "./endpoints";

export function useJobCardLockUnlock() {
  return useMutation({
    mutationKey: ["get-job-card-lock-unlock"],
    mutationFn: async (payload) => {
      const response = await axios.post(jobCardLockUnlockEndpoint, payload);
      return response?.data || {};
    },
  });
}
