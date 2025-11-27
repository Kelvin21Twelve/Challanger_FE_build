import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  editGeneralLedgerEndpoint,
  insertGeneralLedgerEndpoint,
} from "./endpoints";

export function useCreateEditGeneralLedger() {
  return useMutation({
    mutationKey: ["create-edit-general-ledger"],
    mutationFn: async (payload) => {
      const form = new FormData();

      Object.keys(payload).forEach((key) => {
        form.append(key, payload[key]);
      });

      const isEdit = !!payload?.id;

      const response = await axios.post(
        isEdit ? editGeneralLedgerEndpoint : insertGeneralLedgerEndpoint,
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data;
    },
  });
}
