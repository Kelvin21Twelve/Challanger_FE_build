import { Input, Spin } from "antd";
import { useTranslations } from "next-intl";

export function SearchBar({ setQueryValue, isSearchLoading }) {
  const t = useTranslations("jobs");

  return (
    <div className="flex min-w-52 justify-end">
      <div className="flex items-center gap-2">
        <div className="font-semibold">{t("Search:")}</div>
        <div>
          <Input
            suffix={
              <div className="w-6 flex items-center justify-end">
                {isSearchLoading && <Spin size="small" />}
              </div>
            }
            placeholder={t("Search")}
            onChange={(e) => setQueryValue(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
