import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { jobCardLabourDiscountUpdateEndpoint } from "./endpoints";

export function useInsertLabourDiscount() {
  return useMutation({
    mutationKey: ["insert-labour-discount"],
    mutationFn: async (payload) => {
      const form = new FormData();
      form.set("job_id", payload.job_id);
      form.set("disc", payload.discount);

      const response = await axios.post(
        jobCardLabourDiscountUpdateEndpoint,
        payload,
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
