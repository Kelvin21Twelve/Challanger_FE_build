"use client";

import { redirect } from "next/navigation";
import { useContext, useEffect } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function RootLayout({ children }) {
  const { permissions } = useContext(UserContext);

  useEffect(() => {
    if (!permissions.includes("job-menu-visible"))
      redirect("/permission-issue");
  }, [permissions]);

  return children;
}
