import { useTranslations } from "next-intl";

import { useOnlineStatus } from "@/utils/useOnlineStatus";

export function OfflineBar() {
  const t = useTranslations("components");
  const { isOnline } = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-[#dc3912] text-white text-center font-semibold text-sm py-1">
      <h1>{t("You are offline!")}</h1>
    </div>
  );
}
