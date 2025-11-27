import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  getPayrollEndpoint,
  printPayrollEndpoint,
  searchPayrollEndpoint,
} from "./endpoints";

export function useSearchPayroll() {
  return useMutation({
    mutationKey: ["search-payroll"],
    mutationFn: async (payload) => {
      let form = new FormData();
      form.append("data[year]", payload.year);
      form.append("data[month]", payload.month);

      const response = await axios.post(searchPayrollEndpoint, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const { data } = response?.data;

      if (data) {
        const response2 = await axios.post(getPayrollEndpoint, payload);
        const printData = response2?.data;

        if (printData) {
          let form = new FormData();
          form.set("data", printData);
          form.set("module", "payroll_details");

          const response3 = await axios.get(printPayrollEndpoint, form, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const { success, view } = response3?.data || {};
          if (success) window.open(view);
        }
      }

      return response?.data;
    },
  });
}
