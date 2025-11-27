import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { deleteGeneralLedgerEndpoint } from "./endpoints";

export function useDeleteGeneralLedger() {
  return useMutation({
    mutationKey: ["delete-general-ledger"],
    mutationFn: async (id) => {
      const form = new FormData();
      form.set("id", id);

      const response = await axios.post(deleteGeneralLedgerEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    },
  });
}
