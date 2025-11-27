import axios from "axios";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "@/contexts/UserContext";

import { getMeDetailsEndpoint } from "./endpoints";

export function useMe() {
  const { setUser } = useContext(UserContext);

  return useQuery({
    queryKey: ["me-details"],
    queryFn: async () => {
      const response = await axios.post(getMeDetailsEndpoint);

      const permission_slug = response?.data?.success?.permission_slug;
      if (permission_slug) {
        localStorage.setItem("permission_slug", permission_slug);

        setUser((prev) => ({
          ...(prev || {}),
          permissions: JSON.parse(permission_slug),
        }));
      }

      return response?.data;
    },
  });
}
