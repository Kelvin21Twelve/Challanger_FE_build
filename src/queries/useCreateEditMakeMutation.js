import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createMakeEndpoint } from "./endpoints";

export function useCreateEditMakeMutation() {
  return useMutation({
    mutationKey: ["create-edit-make"],
    mutationFn: async (payload) => {
      const response = await axios.post(createMakeEndpoint, payload);
      return response.data;
    },
  });
}
