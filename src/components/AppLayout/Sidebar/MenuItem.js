"use client";

import { clsx } from "clsx";
import Link from "next/link";

import { useTranslations } from "next-intl";

function ItemWrapper({ icon, label, isActive }) {
  return (
    <div
      className={clsx(
        isActive ? "bg-[#f4f4f4]" : "",
        "flex items-start gap-1 group cursor-pointer py-3.5 px-6 text-sm",
      )}
    >
      <div
        className={clsx(
          "[&_svg]:w-[20px] [&_svg]:h-[20px]",
          isActive ? "text-[#007bff]" : "text-[#999] group-hover:text-[#333]",
        )}
      >
        {icon}
      </div>
      <div
        className={clsx(
          isActive ? "text-[#007bff]" : "text-[#333]",
          "font-medium",
        )}
      >
        {label}
      </div>
    </div>
  );
}

export default function MenuItem(props) {
  const t = useTranslations("sidebar");
  const {
    label,
    isLabel,
    onClick,
    href = "#",
    hasBorder = false,
    hasPadding = false,
    withSpaceAbove = false,
  } = props;

  if (isLabel) {
    return (
      <div
        className={clsx(
          hasPadding ? "pb-2" : "",
          withSpaceAbove ? "mt-3" : "",
          "font-medium text-[17px] text-[#333] px-6",
          hasBorder ? "border-[#dfe0e1] border-b" : "",
          "flex items-center gap-1 group",
        )}
      >
        {t(label)}
      </div>
    );
  }

  if (href === "#")
    return (
      <button type="button" onClick={onClick} className="w-full">
        <ItemWrapper {...props} label={t(label)} />
      </button>
    );

  return (
    <Link href={href}>
      <ItemWrapper {...props} label={t(label)} />
    </Link>
  );
}
