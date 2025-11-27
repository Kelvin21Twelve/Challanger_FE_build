import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    remotePatterns: [
      new URL("http://127.0.0.1/**"),
      new URL("https://grp.challenger-co.com/**"),
    ],
  },
};

export default withNextIntl(nextConfig);
