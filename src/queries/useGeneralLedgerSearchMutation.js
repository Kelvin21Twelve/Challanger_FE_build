import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { searchGeneralLedgerEndpoint } from "./endpoints";

export function useGeneralLedgerSearchMutation() {
  return useMutation({
    mutationKey: ["general-ledger-search"],
    mutationFn: async (payload) => {
      const response = await axios.post(searchGeneralLedgerEndpoint, payload);
      return response?.data;
    },
  });
}
