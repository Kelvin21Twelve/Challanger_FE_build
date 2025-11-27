import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { createUserEndpoint } from "./endpoints";

export function useCreateUserMutation() {
  return useMutation({
    mutationKey: ["create-user"],
    mutationFn: async (payload) => {
      const response = await axios.post(createUserEndpoint, payload);
      return response.data;
    },
  });
}
