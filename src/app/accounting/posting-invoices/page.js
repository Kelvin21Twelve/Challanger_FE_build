"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Table, Form, Button, Select, Typography, DatePicker } from "antd";

import { SearchIcon } from "@/assets/icons";

import { SearchBar } from "@/components/SearchBar";

import RefundModal from "@/modals/accounts/RefundModal";
import CompletedJobCardDetails from "@/modals/jobs/CompletedJobCardDetails";

import { useTableSearch, showTotal } from "@/utils";
import {
  useRefundReceipt,
  useSearchPastInvoice,
  usePrintCompleteJobDetails,
} from "@/queries";

const { Title } = Typography;
const { Item, useForm } = Form;

export default function Page() {
  const [form] = useForm();
  const t = useTranslations("posting-invoices");

  const { mutate: mutatePrintRefundReceipt } = useRefundReceipt();

  const { mutate: mutatePrintJobCard, data: printData } =
    usePrintCompleteJobDetails();

  const [formData, setFormData] = useState(null);
  const [jobCardId, setJobCardId] = useState(null);
  const [refundModal, setRefundModal] = useState(null);

  const { mutate, data, isSuccess, isPending, isError } =
    useSearchPastInvoice();
  const isLoading = isPending && !isSuccess && !isError;

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["job_no", "created_at", "id", "price"]);

  useEffect(() => {
    if (data?.data) setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    mutate(formData);
  }, [formData, mutate]);

  useEffect(() => {
    if (printData) window.open(printData?.view || "");
  }, [printData]);

  return (
    <div>
      <Title level={2}>{t("Posting Invoices Form")}</Title>

      <div className="pt-3">
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) =>
            setFormData({
              ...values,
              to_date: dayjs(values?.to_date).format("YYYY-MM-DD"),
              from_date: dayjs(values?.from_date).format("YYYY-MM-DD"),
            })
          }
        >
          <div className="flex flex-wrap items-start gap-1 md:gap-5">
            <Item
              name="from_date"
              label={t("From Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker size="large" className="min-w-52" />
            </Item>

            <Item
              name="to_date"
              label={t("To Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker size="large" className="min-w-52" />
            </Item>

            <Item
              name="type"
              label={t("Type")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                size="large"
                className="min-w-52"
                placeholder={t("Select Type")}
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
                  {
                    label: t("Job Cards"),
                    value: "Job_Cards",
                  },
                  {
                    label: t("Purchase"),
                    value: "Purchase",
                  },
                  {
                    label: t("Sales"),
                    value: "Sales",
                  },
                ]}
              />
            </Item>

            <div className="pt-8">
              <Button type="primary" size="small" htmlType="submit">
                <SearchIcon />
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <div className="pb-3">
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "job_no",
            title: t("Inv No"),
            dataIndex: "job_no",
            sorter: (a, b) => String(a.job_no).localeCompare(b.job_no),
            render: (_, item) =>
              item?.job_no || item?.inv_no || item?.job_id || "-",
          },
          {
            title: t("Date"),
            key: "created_at",
            dataIndex: "created_at",
            sorter: (a, b) => String(a.created_at).localeCompare(b.created_at),
          },
          {
            key: "id",
            title: t("Type"),
            dataIndex: "id",
            sorter: (a, b) => String(a.id).localeCompare(b.id),
            render: (_, item) => item.type || item.inv_type || "-",
          },
          {
            key: "price",
            title: t("Amount"),
            dataIndex: "price",
            sorter: (a, b) =>
              String(a.price || a.total_amt).localeCompare(
                b.price || b.total_amt,
              ),
            render: (_, item) =>
              item.price ||
              item.total_amt ||
              item?.job_card_calculation?.grand_total ||
              "-",
          },
          {
            key: "price",
            title: t("Action"),
            dataIndex: "action",
            render: (_, item) => (
              <div className="flex items-start gap-2">
                {item?.job_card_calculation?.balance < 0 && (
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => setRefundModal(item)}
                  >
                    {t("Refund")}
                  </Button>
                )}

                {item?.job_no && (
                  <>
                    <Button
                      size="small"
                      type="primary"
                      onClick={() => setJobCardId(item?.id)}
                    >
                      {t("View")}
                    </Button>

                    <Button
                      size="small"
                      type="primary"
                      onClick={() => mutatePrintJobCard(item?.id)}
                    >
                      {t("Print")}
                    </Button>
                    {!!item?.job_card_payment && (
                      <Button
                        size="small"
                        type="primary"
                        onClick={() =>
                          item?.id && mutatePrintRefundReceipt(item?.id || "")
                        }
                      >
                        {t("Refund Receipt")}
                      </Button>
                    )}
                  </>
                )}
              </div>
            ),
          },
        ]}
        dataSource={filteredData}
        pagination={{
          showTotal,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />

      <RefundModal
        data={refundModal}
        open={!!refundModal}
        onClose={() => setRefundModal(null)}
        onRefetch={useCallback(() => mutate(formData), [formData, mutate])}
      />

      <CompletedJobCardDetails
        isAccounting
        jobId={jobCardId}
        open={!!jobCardId}
        onClose={() => setJobCardId(null)}
      />
    </div>
  );
}
