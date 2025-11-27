import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createEditHrmsEndpoint } from "./endpoints";

export function useCreateEditHrms(modal) {
  return useMutation({
    mutationKey: ["create-edit-" + modal],
    mutationFn: async (payload) => {
      const formData = new FormData();

      Object.keys(payload).forEach(
        (key) => !!payload[key] && formData.append(key, payload[key]),
      );

      const response = await axios.post(
        createEditHrmsEndpoint.replace(":modal_name", modal),
        formData,
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
