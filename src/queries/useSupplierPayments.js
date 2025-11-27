import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { getSupplierPaymentsEndpoint } from "./endpoints";

export function useSupplierPayments() {
  return useQuery({
    queryKey: ["get-supplier-payments"],
    queryFn: async () => {
      const response = await axios.post(getSupplierPaymentsEndpoint);
      return response?.data?.purchase_order;
    },
  });
}
