import axios from "axios";
import { createContext, useEffect, useMemo, useState } from "react";

export const UserContext = createContext();

const isClient = typeof window !== "undefined";

const getUserFromLocalStorage = () => {
  if (!isClient) return {};

  const keys = [
    "permission_slug",
    "remember_me",
    "ip_address",
    "base_url",
    "user_id",
    "refresh",
    "token",
  ];

  const obj = {};

  keys.forEach((key) => {
    const item = localStorage.getItem(key);
    if (item) obj[key] = item;
  });

  const { permission_slug } = obj || {};
  if (permission_slug) obj.permissions = JSON.parse(permission_slug);

  return obj;
};

export default function UserProvider({ children }) {
  const [user, setUser] = useState(getUserFromLocalStorage());

  const data = useMemo(
    () => ({
      user,
      setUser,
      permissions: user?.permissions || [],
    }),
    [user, setUser],
  );

  useEffect(() => {
    if (!user?.token) return;

    Object.keys(user).forEach((key) => {
      if (key === "permissions") return;
      localStorage.setItem(key, user[key]);
    });
  }, [user]);

  if (isClient) {
    const { token: userToken, base_url } = user || {};
    const token = userToken || localStorage.getItem("token") || "";
    const baseUrl =
      base_url ||
      localStorage.getItem("base_url") ||
      process.env.NEXT_PUBLIC_API_URL ||
      "";

    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    axios.defaults.headers.common["Content-Type"] = "application/json";
  }

  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
}
