"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";

import { useTableSearch, showTotal } from "@/utils";
import { useGetCompleteJobs } from "@/queries";

import { SearchBar } from "@/components/SearchBar";

import { ViewIcon } from "@/assets/icons/actions";

import CompletedJobCardDetailsModal from "@/modals/jobs/CompletedJobCardDetails";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("jobs");
  const { data, isLoading } = useGetCompleteJobs();
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "id",
      "phone",
      "cab_no",
      "status",
      "job_no",
      "customer",
      "created_at",
      "total_amount",
      "delivery_date",
    ]);

  const [jobId, setJobId] = useState(null);

  useEffect(() => {
    setRecords(data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Complete Jobs")}</Title>

        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "id",
            title: "Job Id",
            dataIndex: "id",
            sorter: (a, b) => a.id - b.id,
          },
          {
            key: "job_no",
            title: "Job No",
            dataIndex: "job_no",
            sorter: (a, b) => String(a.job_no).localeCompare(b.job_no),
          },
          {
            key: "cab_no",
            title: "Cab No",
            dataIndex: "cab_no",
            sorter: (a, b) => String(a.cab_no).localeCompare(b.cab_no),
          },
          {
            key: "customer",
            title: "Customer Name",
            dataIndex: "customer",
            sorter: (a, b) => String(a.customer).localeCompare(b.customer),
          },

          {
            key: "phone",
            title: "Customer Phone",
            dataIndex: "phone",
            sorter: (a, b) => String(a.phone).localeCompare(b.phone),
          },

          {
            key: "total_amount",
            title: "Total Payments",
            dataIndex: "total_amount",
            sorter: (a, b) =>
              String(a.total_amount).localeCompare(b.total_amount),
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
            sorter: (a, b) => String(a.created_at).localeCompare(b.created_at),
          },

          {
            key: "delivery_date",
            title: "Delivery Date",
            dataIndex: "delivery_date",
            sorter: (a, b) =>
              String(a.delivery_date).localeCompare(b.delivery_date),
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
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
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
