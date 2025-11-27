import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { sparePartsToReturnTableEndpoint } from "./endpoints";

export function useSparePartsToReturn() {
  return useMutation({
    mutationKey: ["spare-parts-to-return-table"],
    mutationFn: async (payload) => {
      const { id, job_id } = payload || {};

      const form = new FormData();
      form.set("inv_no", job_id);
      form.set("id", id);

      const response = await axios.post(sparePartsToReturnTableEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { success, JobCard, new_spare_parts, used_spare_parts } =
        response?.data || {};

      if (success) {
        return {
          success,
          details: JobCard?.[0],
          data: [...(new_spare_parts || []), ...(used_spare_parts || [])],
        };
      }

      return response?.data;
    },
  });
}
