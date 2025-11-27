import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createSystemUserEndpoint } from "./endpoints";

export function useCreateEditSystemUser() {
  return useMutation({
    mutationKey: ["create-edit-system-user"],
    mutationFn: async (payload) => {
      const isEdit = !!payload?.id;
      const apiCall = isEdit
        ? axios.put("/user_update/" + payload.id, payload)
        : axios.post(createSystemUserEndpoint, payload);

      const response = await apiCall;
      return response.data;
    },
  });
}
