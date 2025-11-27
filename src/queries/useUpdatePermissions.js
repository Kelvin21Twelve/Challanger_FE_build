import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { updatePermissionEndpoint } from "./endpoints";

export function useUpdatePermissions() {
  return useMutation({
    mutationKey: ["update-permissions"],
    mutationFn: async (payload) => {
      const response = await axios.post(updatePermissionEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
  });
}
