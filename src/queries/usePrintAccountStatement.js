import axios from "axios";
import { useMutation } from "@tanstack/react-query";

import {
  getAccountDetailsPrintEndpoint,
  getPrintAccountDetailsEndpoint,
} from "./endpoints";

export function usePrintAccountStatement() {
  return useMutation({
    mutationKey: ["get-account-details-print"],
    mutationFn: async (payload) => {
      let response = await axios.post(getAccountDetailsPrintEndpoint, payload);
      let { success, data } = response?.data || {};
      if (!success) throw new Error("Something went wrong");

      const formData = new FormData();

      data.forEach(
        (
          {
            id,
            user_id,
            balance,
            printable,
            created_at,
            updated_at,
            account_code,
            super_account,
            account_name_en,
            account_name_ar,
            opening_balance,
            is_bank_account,
            is_cash_account,
          },
          index,
        ) => {
          formData.append(`data[data][${index}][id]`, id);
          formData.append(`data[data][${index}][balance]`, balance);
          formData.append(`data[data][${index}][user_id]`, user_id);
          formData.append(`data[data][${index}][printable]`, printable);
          formData.append(`data[data][${index}][created_at]`, created_at);
          formData.append(`data[data][${index}][updated_at]`, updated_at);
          formData.append(`data[data][${index}][account_code]`, account_code);
          formData.append(`data[data][${index}][super_account]`, super_account);
          formData.append(
            `data[data][${index}][account_name_en]`,
            account_name_en,
          );
          formData.append(
            `data[data][${index}][account_name_ar]`,
            account_name_ar,
          );
          formData.append(
            `data[data][${index}][opening_balance]`,
            opening_balance,
          );
          formData.append(
            `data[data][${index}][is_bank_account]`,
            is_bank_account,
          );
          formData.append(
            `data[data][${index}][is_cash_account]`,
            is_cash_account,
          );
          formData.append(`data[data][${index}][is_delete]`, 0);
        },
      );
      formData.append("data[success]", "true");
      formData.append("module", "account_details");

      response = await axios.post(getPrintAccountDetailsEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      data = response?.data || {};
      if (data?.success && data?.view) window.open(data?.view);
    },
  });
}
