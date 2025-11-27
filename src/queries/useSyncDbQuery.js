import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { syncDbEndpoint } from "./endpoints";

export function useSyncDbQuery(model) {
  return useQuery({
    queryKey: ["sync-db", model],
    queryFn: async () => {
      const response = await axios.post(syncDbEndpoint, { model });
      return response.data;
    },
  });
}
