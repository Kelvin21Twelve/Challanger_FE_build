import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { transferCabEndpoint } from "./endpoints";

export function useTransferCab() {
  return useMutation({
    mutationKey: ["transfer-cab"],
    mutationFn: async (payload) => {
      const response = await axios.post(transferCabEndpoint, payload);
      return response.data;
    },
  });
}
