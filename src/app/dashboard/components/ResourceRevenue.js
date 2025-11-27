import { useState, useMemo } from "react";
import {
  Pie,
  Cell,
  Legend,
  Tooltip,
  PieChart,
  ResponsiveContainer,
} from "recharts";

import { ChartCardContainer } from "./ChartCardContainer";

export function ResourceRevenue({ t, data }) {
  const [width, setWidth] = useState(0);

  const { jobs_assigned, jobs_done, jobs_total } = data || {};

  const chartData = useMemo(
    () => [
      {
        name: t("Job Assigned"),
        value: jobs_assigned || 0,
        color: "#dc3912",
      },
      {
        name: t("Job Completed"),
        value: jobs_done || 0,
        color: "#3871cf",
      },
      {
        name: t("Total Jobs"),
        value: jobs_total - (jobs_assigned + jobs_done),
        color: "#f4b400",
      },
    ],
    [jobs_assigned, jobs_done, jobs_total, t],
  );

  const isBelow1024 =
    typeof window !== "undefined" ? window.outerWidth <= 1024 : false;

  return (
    <ChartCardContainer label={t("Revenue Sources")}>
      <div>
        <div className="pb-5 pt-0">
          <div className="text-sm font-bold text-[#757575]">
            {t("My Daily Actives")}
          </div>
        </div>
        <div ref={(ref) => setWidth(ref?.clientWidth || 0)}>
          <ResponsiveContainer width={width} height={isBelow1024 ? 300 : 200}>
            <PieChart width={500} height={500}>
              <Legend
                wrapperStyle={{ paddingLeft: 8 }}
                align={isBelow1024 ? "center" : "right"}
                layout={isBelow1024 ? "horizontal" : "vertical"}
                verticalAlign={isBelow1024 ? "bottom" : "middle"}
              />

              <Tooltip />

              <Pie data={chartData} dataKey="value">
                {chartData.map((item) => (
                  <Cell key={`cell-${item.name}`} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ChartCardContainer>
  );
}
