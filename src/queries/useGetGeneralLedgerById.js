import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getGeneralLedgerByIdEndpoint } from "./endpoints";

export function useGetGeneralLedgerById(id) {
  return useQuery({
    enabled: !!id,
    queryKey: ["get-general-ledger-by-id", id],
    queryFn: async () => {
      const formData = new FormData();
      formData.append("id", id);
      const response = await axios.post(
        getGeneralLedgerByIdEndpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response?.data?.data[0];
    },
  });
}
