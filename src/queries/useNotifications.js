import axios from "axios";
import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import { UserContext } from "@/contexts/UserContext";

import { notifications1Endpoint, notifications2Endpoint } from "./endpoints";

export function useNotifications() {
  const { permissions } = useContext(UserContext);

  return useQuery({
    enabled: permissions.includes("visa-notification-view"),
    queryKey: ["notifications"],
    queryFn: async () => {
      if (typeof window === "undefined") return [];

      const response = await axios.post(notifications1Endpoint);

      const formData = new FormData();
      formData.append("user_id", localStorage.getItem("user_id"));

      const response2 = await axios.post(notifications2Endpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        isExpired: response2?.data?.data == "1",
        notifications: response?.data?.new_spr_limit || [],
      };
    },
  });
}
