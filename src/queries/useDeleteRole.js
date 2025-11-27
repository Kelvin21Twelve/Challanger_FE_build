import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { deleteRoleEndpoint } from "./endpoints";

export function useDeleteRole() {
  return useMutation({
    mutationKey: ["delete-role"],
    mutationFn: async (payload) => {
      const response = await axios.post(deleteRoleEndpoint, {
        role_id: payload,
      });

      return response?.data;
    },
  });
}
