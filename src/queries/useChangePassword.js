import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { changePasswordEndpoint } from "./endpoints";

export function useChangePassword() {
  return useMutation({
    mutationKey: ["change-password"],
    mutationFn: async (payload) => {
      const response = await axios.post(changePasswordEndpoint, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    },
  });
}
