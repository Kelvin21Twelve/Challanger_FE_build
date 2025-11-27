import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { printCompleteJobDetailsEndpoint } from "./endpoints";

export function usePrintCompleteJobDetails() {
  return useMutation({
    mutationKey: ["print-complete-job-details"],
    mutationFn: async (id) => {
      const response = await axios.post(printCompleteJobDetailsEndpoint, {
        id,
      });

      return response?.data;
    },
  });
}
