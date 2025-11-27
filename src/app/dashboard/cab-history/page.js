"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Button, Typography, Table, Select } from "antd";

import { ViewIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";

import { useTableSearch, showTotal } from "@/utils";
import { useCabHistory } from "@/queries";

import CompletedJobCardDetailsModal from "@/modals/jobs/CompletedJobCardDetails";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("cab-history");
  const [cabNo, setCabNo] = useState("All");
  const [jobId, setJobId] = useState(null);

  const { data, isLoading } = useCabHistory(cabNo);
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "id",
      "phone",
      "status",
      "job_no",
      "cab_no",
      "customer",
      "created_at",
      "total_amount",
      "delivery_date",
    ]);

  useEffect(() => {
    setRecords(data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Cab History")}</Title>

        <div className="flex flex-wrap items-center gap-1 sm:gap-5">
          <div className="inline-flex gap-2 py-2">
            <div className="whitespace-nowrap font-semibold">
              {t("Cab Number:")}
            </div>
            <div className="min-w-[100px]">
              <Select
                showSearch
                className="w-full"
                defaultValue={t("All")}
                onChange={setCabNo}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
                options={[
                  {
                    label: t("All"),
                    value: "All",
                  },
                  ...Array.from({ length: 200 }).map((_, index) => ({
                    label: index + 1,
                    value: index + 1,
                  })),
                ]}
              />
            </div>
          </div>

          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />
        </div>
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "id",
            dataIndex: "id",
            title: "Job Id",
            sorter: (a, b) => a.id - b.id,
          },
          {
            key: "job_no",
            title: "Job No",
            dataIndex: "job_no",
            sorter: (a, b) => Number(a.job_no) - Number(b.job_no),
          },
          {
            key: "cab_no",
            title: "Cab No",
            dataIndex: "cab_no",
            sorter: (a, b) => a.cab_no - b.cab_no,
          },
          {
            key: "customer",
            dataIndex: "customer",
            title: "Customer Name",
            sorter: (a, b) => String(a.customer).localeCompare(b.customer),
          },
          {
            key: "phone",
            dataIndex: "phone",
            title: "Customer Phone",
            sorter: (a, b) => String(a.phone).localeCompare(b.phone),
          },
          {
            key: "total_amount",
            title: "Total Payments",
            dataIndex: "total_amount",
            sorter: (a, b) => a.total_amount - b.total_amount,
          },

          {
            key: "status",
            title: "Status",
            dataIndex: "status",
            sorter: (a, b) => String(a.status).localeCompare(b.status),
          },

          {
            key: "created_at",
            title: "Created Date",
            dataIndex: "created_at",
            sorter: (a, b) =>
              new Date(a.created_at).getTime() -
              new Date(b.created_at).getTime(),
          },
          {
            key: "delivery_date",
            title: "Delivery Date",
            dataIndex: "delivery_date",
            sorter: (a, b) =>
              new Date(a.delivery_date).getTime() -
              new Date(b.delivery_date).getTime(),
          },
          {
            key: "edit",
            title: "View",
            dataIndex: "edit",
            render: (_, item) => (
              <Button
                size="small"
                type="primary"
                icon={<ViewIcon />}
                onClick={() => setJobId(item.id)}
              >
                {t("View")}
              </Button>
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={filteredData || []}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CompletedJobCardDetailsModal
        jobId={jobId}
        open={!!jobId}
        onClose={() => setJobId(null)}
      />
    </div>
  );
}
