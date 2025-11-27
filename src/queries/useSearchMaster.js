import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { searchMasterEndpoint } from "./endpoints";

export function useSearchMaster() {
  return useMutation({
    mutationKey: ["search-master"],
    mutationFn: async (payload) => {
      const response = await axios.post(searchMasterEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    },
  });
}
