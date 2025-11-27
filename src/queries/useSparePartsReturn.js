import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { sparePartsReturnedEndpoint } from "./endpoints";

export function useSparePartsReturn() {
  return useMutation({
    mutationKey: ["spare-parts-return"],
    mutationFn: async (payload) => {
      const response = await axios.post(sparePartsReturnedEndpoint, payload);
      return response.data;
    },
  });
}
