import { Card } from "./Card";

export function StatisticsCard({ t, data, isLoading }) {
  const {
    jobs_cancelled,
    jobs_running,
    jobs_total,
    jobs_done,
    Customer,
    Account,
  } = data || {};

  const items = [
    {
      color: "text-[#007bff]",
      label: t("Customers"),
      value: Customer,
    },
    {
      color: "text-[#28a745]",
      label: t("Customer Accounts"),
      value: Account,
    },
    {
      color: "text-[#17a2b8]",
      label: t("Total jobs"),
      value: jobs_total,
    },
    {
      color: "text-[#ffc107]",
      label: t("Used Spare Parts"),
      value: data?.["old"],
    },
    {
      color: "text-[#ffc107]",
      label: t("New Spare Parts"),
      value: data?.["new"],
    },
    {
      color: "text-[#007bff]",
      label: t("Running"),
      value: jobs_running,
    },
    {
      color: "text-[#007bff]",
      label: t("Delivery"),
      value: jobs_done,
    },
    {
      color: "text-[#007bff]",
      label: t("Cancelled"),
      value: jobs_cancelled,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {items.map((item) => (
        <Card key={item.label} isLoading={isLoading} {...item} />
      ))}
    </div>
  );
}
