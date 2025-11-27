import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import languages from "./languages";

export default getRequestConfig(async () => {
  const locale =
    (await cookies()).get(process.env.NEXT_PUBLIC_LOCALE_COOKIE_KEY_NAME)
      ?.value || "en";

  return {
    locale,
    messages: languages[locale],
  };
});
