import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { soldSparePartsToReturnEndpoint } from "./endpoints";

export function useSoldSparePartsToReturn() {
  return useMutation({
    mutationKey: ["spare-parts-to-return"],
    mutationFn: async (array) => {
      const form = new FormData();

      array.forEach((element, index) => {
        const {
          item,
          price,
          total,
          job_id,
          discount,
          quantity,
          item_code,
          item_name,
        } = element || {};

        form.set("job_id", job_id);
        form.append(`spare_parts_return[${index}][Price]`, price || "-");
        form.append(`spare_parts_return[${index}][Total]`, total || "-");
        form.append(`spare_parts_return[${index}][quantity]`, quantity || "-");
        form.append(`spare_parts_return[${index}][Discount]`, discount || "-");
        form.append(
          `spare_parts_return[${index}][item_code]`,
          item_code || "-",
        );
        form.append(`spare_parts_return[${index}][item]`, item || "-");
        form.append(
          `spare_parts_return[${index}][item_name]`,
          item_name || "-",
        );
      });

      const response = await axios.post(soldSparePartsToReturnEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response?.data;
    },
  });
}
