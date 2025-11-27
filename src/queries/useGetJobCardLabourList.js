import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { jobCardLabourDropdownListEndpoint } from "./endpoints";

export function useGetJobCardLabourList(car_type) {
  return useQuery({
    queryKey: ["get-job-card-labour-dropdown-list", car_type],
    queryFn: async () => {
      const response = await axios.post(jobCardLabourDropdownListEndpoint, {
        car_type,
      });

      return response?.data?.data || [];
    },
  });
}
