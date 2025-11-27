import { useState } from "react";
import dayjs from "dayjs";
import {
  Bar,
  XAxis,
  YAxis,
  Legend,
  Tooltip,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { useNewGetSparePartsCount, useGetUsedSparePartsCount } from "@/queries";

import { ChartCardContainer } from "./ChartCardContainer";

const month1 = dayjs().format("MMMM");
const month2 = dayjs().subtract(1, "month").format("MMMM");
const month3 = dayjs().subtract(2, "month").format("MMMM");

export function EarningsOverview({ t }) {
  const [width, setWidth] = useState(0);

  const { data: newCounts } = useNewGetSparePartsCount();
  const { data: usedCounts } = useGetUsedSparePartsCount();

  const {
    NewSpareParts1,
    NewSpareParts2,
    NewSpareParts3,
    CustomersNewSpareParts1,
    CustomersNewSpareParts2,
    CustomersNewSpareParts3,
  } = newCounts || {};

  const {
    UsedSpareParts1,
    UsedSpareParts2,
    UsedSpareParts3,
    CustomersUsedSpareParts1,
    CustomersUsedSpareParts2,
    CustomersUsedSpareParts3,
  } = usedCounts || {};

  const data = [
    {
      name: month3,
      used_parts_sales: UsedSpareParts3,
      used_parts_purchases: NewSpareParts3,
      new_parts_sales: CustomersNewSpareParts3,
      new_parts_purchases: CustomersUsedSpareParts3,
    },
    {
      name: month2,
      used_parts_sales: UsedSpareParts2,
      used_parts_purchases: NewSpareParts2,
      new_parts_sales: CustomersNewSpareParts2,
      new_parts_purchases: CustomersUsedSpareParts2,
    },
    {
      name: month1,
      used_parts_sales: UsedSpareParts1,
      used_parts_purchases: NewSpareParts1,
      new_parts_sales: CustomersNewSpareParts1,
      new_parts_purchases: CustomersUsedSpareParts1,
    },
  ];

  const isBelow1024 =
    typeof window !== "undefined" ? window.outerWidth <= 1024 : false;

  return (
    <ChartCardContainer label={t("Earnings Overview")}>
      <div>
        <div className="pb-5 pt-0">
          <div className="text-base font-medium text-[#757575]">
            {t("Company Performance")}
          </div>
          <div className="text-sm font-medium text-[#bdbdbd]">
            {t("Spare Parts Purchase and sales:")} {dayjs().format("YYYY")}
          </div>
        </div>
        <div
          ref={(ref) => setWidth(ref?.clientWidth || 0)}
          style={{ marginLeft: -44 }}
        >
          <ResponsiveContainer width={width} height={isBelow1024 ? 300 : 200}>
            <BarChart width={500} height={300} data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Legend
                wrapperStyle={{ paddingLeft: 40 }}
                align={isBelow1024 ? "center" : "right"}
                layout={isBelow1024 ? "horizontal" : "vertical"}
                verticalAlign={isBelow1024 ? "bottom" : "middle"}
              />
              <Tooltip />
              <Bar
                fill="#4285f4"
                name={t("New spare parts purchase")}
                dataKey="new_parts_purchases"
              />
              <Bar
                fill="#db4437"
                name={t("New spare parts sales")}
                dataKey="new_parts_sales"
              />
              <Bar
                fill="#f4b400"
                name={t("Used spare parts purchase")}
                dataKey="used_parts_purchases"
              />
              <Bar
                fill="#0f9d58"
                name={t("Used spare parts sales")}
                dataKey="used_parts_sales"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCardContainer>
  );
}
