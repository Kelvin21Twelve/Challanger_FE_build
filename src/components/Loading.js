import Image from "next/image";
import { useTranslations } from "next-intl";

export default function Loading() {
  const t = useTranslations("components");

  return (
    <div
      className="
        text-center fixed top-0 left-0 right-0 bottom-0 w-full 
        z-10 flex items-center justify-center h-full 
      "
    >
      <div className="bg-white rounded-lg shadow-lg w-40 h-40 flex items-center justify-center">
        <div>
          <div>
            <Image
              width={200}
              height={200}
              unoptimized
              alt="Loading..."
              src="/main_loader.gif"
              style={{ maxWidth: 60 }}
            />
          </div>

          <div className="pt-3 text-gray-500">{t("Loading")}</div>
        </div>
      </div>
    </div>
  );
}
