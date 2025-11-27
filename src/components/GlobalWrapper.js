"use client";

import { ConfigProvider } from "antd";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import StyledComponentsRegistry from "./StyledComponentsRegistry";

import UserContextProvider from "@/contexts/UserContext";

const queryClient = new QueryClient();

export default function GlobalWrapper({ children }) {
  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#267ff8",
          },
          components: {
            Table: {
              fontWeightStrong: 700,
            },
            Button: {
              contentFontSize: 16,
              contentFontSizeSM: 14,
              colorTextDisabled: "#495057",
              colorBgContainerDisabled: "rgb(233,236,239)",
            },
            Modal: {
              fontSizeHeading5: 20,
            },
            DatePicker: {
              colorTextDisabled: "#495057",
              colorBgContainerDisabled: "rgb(233,236,239)",
            },
            Input: {
              colorTextDisabled: "#495057",
              colorBgContainerDisabled: "rgb(233,236,239)",
            },
            Select: {
              colorTextDisabled: "#495057",
              colorBgContainerDisabled: "rgb(233,236,239)",
            },
            Checkbox: {
              colorTextDisabled: "#495057",
              colorBgContainerDisabled: "rgb(233,236,239)",
            },
          },
        }}
      >
        <StyledComponentsRegistry>
          <QueryClientProvider client={queryClient}>
            <UserContextProvider>
              <div>{children}</div>
            </UserContextProvider>
          </QueryClientProvider>
        </StyledComponentsRegistry>
      </ConfigProvider>
    </AntdRegistry>
  );
}
