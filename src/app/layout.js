import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import AppLayout from "@/components/AppLayout";
import GlobalWrapper from "@/components/GlobalWrapper";

import "./globals.css";

config.autoAddCss = false;

export const metadata = {
  title: "Challenger Garage App",
  description: "Challenger Garage App",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <GlobalWrapper>
            <AppLayout>{children}</AppLayout>
          </GlobalWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
