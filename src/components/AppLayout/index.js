"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { usePathname, redirect } from "next/navigation";

import ModelContextProvider from "@/contexts/ModelContexts";

import CommonModalWrapper from "../CommonModalWrapper";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { OfflineBar } from "./OfflineBar";

export default function AppLayout({ children }) {
  const pathName = usePathname();
  const t = useTranslations("components");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token && pathName !== "/login") redirect("/login");
  }, [pathName]);

  useEffect(() => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response, message } = error || {};

        if (!response) {
          Swal.fire({ text: message });
          return Promise.reject(error);
        }

        const { status } = response || {};

        if (status === 401) {
          Swal.fire({
            text: t("Your session is expired! Please login again to continue!"),
          });
          localStorage.clear();
          setTimeout(() => redirect("/login"), 500);
        }

        return Promise.reject(error);
      },
    );
  }, [t]);

  if (pathName === "/login") return children;

  return (
    <ModelContextProvider>
      <div className="min-h-screen flex flex-col border-[#dfdfdf]">
        <OfflineBar />
        <Header />
        <div className="flex grow relative">
          <Sidebar />
          <div className="grow py-6 px-8 md:px-12 w-[calc(100%-229px)]">
            {children}
          </div>
        </div>
      </div>
      <CommonModalWrapper />
    </ModelContextProvider>
  );
}
