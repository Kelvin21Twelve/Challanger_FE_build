import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createEditEmployeeEndpoint } from "./endpoints";

export function useCreateEditEmployee() {
  return useMutation({
    mutationKey: ["create-edit-employee"],
    mutationFn: async (payload) => {
      const formData = new FormData();

      Object.keys(payload).forEach(
        (key) => !!payload[key] && formData.append(key, payload[key]),
      );

      const response = await axios.post(createEditEmployeeEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response?.data;
    },
  });
}
