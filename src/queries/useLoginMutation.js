import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { loginEndpoint } from "./endpoints";

export function useLoginMutation() {
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (payload) => {
      const response = await axios.post(loginEndpoint, payload);
      return response.data;
    },
  });
}
