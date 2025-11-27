"use client";

import { Typography } from "antd";
import { useTranslations } from "next-intl";

import { useGetJobCount } from "@/queries";

import { StatisticsCard } from "./components/StatisticsCard";
import { ResourceRevenue } from "./components/ResourceRevenue";
import { EarningsOverview } from "./components/EarningsOverview";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("dashboard");
  const { data, isLoading } = useGetJobCount();

  return (
    <div>
      <Title level={2}>{t("Dashboard")}</Title>
      <StatisticsCard t={t} data={data} isLoading={isLoading} />
      <div className="pt-9 grid gap-[2.5%] grid-cols-1 lg:grid-cols-[67.5%_30%]">
        <EarningsOverview t={t} />
        <ResourceRevenue t={t} data={data} />
      </div>
    </div>
  );
}
