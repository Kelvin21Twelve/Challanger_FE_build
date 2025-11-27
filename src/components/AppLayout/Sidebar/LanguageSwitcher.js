"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Select } from "antd";

const isClient = () => typeof window !== "undefined";

export default function LanguageSwitcher() {
  const router = useRouter();

  const handleChange = useCallback(
    (value) => {
      if (!isClient()) return;

      document.cookie = `${process.env.NEXT_PUBLIC_LOCALE_COOKIE_KEY_NAME}=${value || "en"};`;
      router.refresh();
    },
    [router],
  );

  const getDefaultLanguage = useCallback(() => {
    if (!isClient()) return "en";

    let obj = {};

    document.cookie.split("; ").forEach((item) => {
      const [key, value] = item.split("=");
      obj = {
        ...obj,
        [key]: value,
      };
    });

    return obj?.[process.env.NEXT_PUBLIC_LOCALE_COOKIE_KEY_NAME] || "en";
  }, []);

  return (
    <div className="px-6 py-2.5">
      <Select
        showSearch
        className="w-full"
        defaultValue={getDefaultLanguage}
        onChange={(value) => handleChange(value)}
        filterOption={(input = "", { label = "" } = {}) =>
          String(label).toLowerCase().includes(String(input).toLowerCase())
        }
        options={[
          { value: "en", label: "English" },
          { value: "ar", label: "Arabic" },
        ]}
      />
    </div>
  );
}
