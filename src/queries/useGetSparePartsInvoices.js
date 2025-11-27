import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardSparePartsInvoiceEndpoint } from "./endpoints";

export function useGetSparePartsInvoices(job_id) {
  return useQuery({
    queryKey: ["get-spare-parts-invoices", job_id],
    queryFn: async () => {
      const response = await axios.post(jobCardSparePartsInvoiceEndpoint, {
        job_id,
      });

      return response?.data;
    },
  });
}
