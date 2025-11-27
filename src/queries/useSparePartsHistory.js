import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { getSparePartsHistoryEndpoint } from "./endpoints";

export function useSparePartsHistory() {
  return useMutation({
    mutationKey: ["get-spare-parts-history"],
    mutationFn: async (payload) => {
      const response = await axios.post(getSparePartsHistoryEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data?.purchased_history || [];
    },
  });
}
