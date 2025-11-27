import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import { getSalaryDetailsEndpoint, getSalaryPrintEndpoint } from "./endpoints";

export function useGetSalaryPrint() {
  return useMutation({
    mutationKey: ["get-salary-print"],
    mutationFn: async (payload) => {
      let form = new FormData();
      form.append("user_name", payload);

      const response = await axios.post(getSalaryDetailsEndpoint, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { success, user_details, vac_type_res } = response?.data;

      if (success) {
        form = new FormData();

        const {
          Emp_code,
          Emp_name,
          basic_salary,
          month,
          total_absence,
          total_addition,
          total_deducts,
          year,
        } = user_details || {};

        form.set("module", "sal_rel_details");
        form.set("data[user_details][year]", year);
        form.set("data[user_details][month]", month);
        form.set("data[user_details][Emp_code]", Emp_code);
        form.set("data[user_details][Emp_name]", Emp_name);
        form.set("data[user_details][basic_salary]", basic_salary);
        form.set("data[user_details][total_absence]", total_absence);
        form.set("data[user_details][total_deducts]", total_deducts);
        form.set("data[user_details][total_addition]", total_addition);

        if (Array.isArray(vac_type_res)) {
          vac_type_res.forEach(({ id, type, balance, emp_id }, index) => {
            form.set(`data[vac_type_res][${index}][id]`, id);
            form.set(`data[vac_type_res][${index}][type]`, type);
            form.set(`data[vac_type_res][${index}][emp_id]`, emp_id);
            form.set(`data[vac_type_res][${index}][balance]`, balance);
          });
        }

        const response2 = await axios.post(getSalaryPrintEndpoint, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const { success, view } = response2?.data || {};
        if (success) window.open(view);
      }

      return response?.data;
    },
  });
}
