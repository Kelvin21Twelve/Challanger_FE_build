import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createRoleEndpoint, updateRoleEndpoint } from "./endpoints";

export function useCreateEditRole() {
  return useMutation({
    mutationKey: ["create-edit-role"],
    mutationFn: async (payload) => {
      const isEdit = !!payload?.id;
      const apiCall = !isEdit
        ? axios.post(createRoleEndpoint, payload)
        : axios.put(updateRoleEndpoint + payload.id, payload);

      const response = await apiCall;
      return response.data;
    },
  });
}
