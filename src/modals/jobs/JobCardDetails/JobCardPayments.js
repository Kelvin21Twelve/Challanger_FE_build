"use client";

import { Modal, Form, Table, Input, Select, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { SearchBar } from "@/components/SearchBar";

import { getPaymentMethod, useTableSearch } from "@/utils";
import { usePaymentInsert, useJobCardPaymentsPrint } from "@/queries";

import { RoundTickIcon, PrintIcon } from "@/assets/icons/actions";

import FiledSet from "@/components/FiledSet";

const { Option } = Select;
const { useForm, Item, useWatch } = Form;

export default function JobCardPaymentsModal({
  open,
  data,
  jobId,
  onClose,
  refetch,
  isLoading,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const payBy = useWatch("pay_by", form);

  const { filteredData, isSearchLoading, setQueryValue, setRecords } =
    useTableSearch(["amount", "pay_by", "remaining"]);

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = usePaymentInsert();
  const paymentLoading = isPending && !isSuccess && !isError;

  const { mutate: handlePrint, data: printData } =
    useJobCardPaymentsPrint(jobId);

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (printData?.view) window.open(printData?.view);
  }, [printData]);

  useEffect(() => {
    if (data && open) {
      const { overdue, balance, grand_total } = data || {};
      form.setFieldValue("overdue", overdue || 0);
      form.setFieldValue("balance", balance || 0);
      form.setFieldValue("grand_total", grand_total || 0);
    }
  }, [data, form, open]);

  useEffect(() => {
    if (response?.success) {
      reset();
      refetch();
      form.setFieldValue("amount");
      form.setFieldValue("pay_by");
    }
  }, [response, refetch, form, reset]);

  useEffect(() => {
    const { error, data } = response || {};
    if (error) {
      Swal.fire({ text: data });
      reset();
    }
  }, [form, reset, response]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <Modal
      open={open}
      width={1024}
      footer={null}
      title={t("Payments")}
      onCancel={handleClose}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5">
        <div>
          <FiledSet label={t("All Payment List")}>
            <div>
              <div className="pb-2">
                <SearchBar
                  setQueryValue={setQueryValue}
                  isSearchLoading={isSearchLoading}
                />
              </div>
              <div className="max-w-full overflow-x-auto">
                <Table
                  rowId="id"
                  columns={[
                    {
                      key: "amount",
                      title: "Amount",
                      dataIndex: "amount",
                      render: (_, item) =>
                        typeof item.amount === "number" ? item.amount : "-",
                      sorter: (a, b) => Number(a.amount) - Number(b.amount),
                    },
                    {
                      key: "pay_by",
                      title: "Pay By",
                      dataIndex: "pay_by",
                      render: (_, item) => getPaymentMethod(item.pay_by),
                      sorter: (a, b) =>
                        String(a.pay_by).localeCompare(b.pay_by),
                    },
                    {
                      key: "remaining",
                      title: "Remaining",
                      dataIndex: "remaining",
                      render: (_, item) =>
                        typeof item.remaining === "number"
                          ? item.remaining
                          : "-",
                      sorter: (a, b) =>
                        Number(a.remaining) - Number(b.remaining),
                    },
                  ].map((item) => ({
                    ...item,
                    title: t(item.title),
                  }))}
                  bordered
                  size="small"
                  pagination={false}
                  scroll={{ y: 388 }}
                  loading={isLoading}
                  dataSource={filteredData}
                  className="border-[#dfe0e1] min-w-96"
                />
              </div>
            </div>
          </FiledSet>
        </div>
        <div>
          <FiledSet label={t("Form")}>
            <Form
              form={form}
              onFinish={mutate}
              labelCol={{ span: 8 }}
              disabled={paymentLoading}
              initialValues={{
                amount: 0,
                balance: 0,
                overdue: 0,
                auth_code: "",
                job_id: jobId,
                grand_total: 0,
              }}
              className="[&_label]:w-full [&_label]:!h-full [&_label]:whitespace-break-spaces [&_label]:text-left"
            >
              <Item name="job_id" hidden />
              <Item name="amount" label={t("Amount To Pay")} colon={false}>
                <Input
                  min={0}
                  size="large"
                  type="number"
                  step={0.1}
                  onKeyDown={(e) =>
                    ["+", "-", "e"].includes(e.key) && e.preventDefault()
                  }
                  placeholder={t("Amount")}
                />
              </Item>

              <Item label={t("Pay By")} name="pay_by" colon={false}>
                <Select
                  showSearch
                  size="large"
                  placeholder={t("Pay By")}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                >
                  <Option value="1">Cash</Option>
                  <Option value="2">K-Net</Option>
                  <Option value="3">Visa</Option>
                  <Option value="4">Master</Option>
                </Select>
              </Item>

              {["2", "3", "4"].includes(payBy) && (
                <Item
                  label={t("Authorization Code")}
                  name="auth_code"
                  colon={false}
                >
                  <Input placeholder={t("Authorization Code")} size="large" />
                </Item>
              )}

              <Item label={t("Total")} name="grand_total" colon={false}>
                <Input placeholder={t("Total")} disabled size="large" />
              </Item>

              <Item name="balance" label={t("Balance")} colon={false}>
                <Input placeholder={t("Balance")} size="large" disabled />
              </Item>

              <div className="flex items-start gap-1.5 justify-end [&_svg]:w-5 [&_button]:min-w-10">
                <Button
                  size="small"
                  title="Print"
                  type="primary"
                  onClick={handlePrint}
                >
                  <PrintIcon />
                </Button>
                <Button
                  size="small"
                  title="Close"
                  type="primary"
                  htmlType="button"
                  onClick={handleClose}
                  className="!bg-[#dc3545]"
                >
                  <FontAwesomeIcon icon={faClose} />
                </Button>
                <Button
                  size="small"
                  title="Save"
                  type="primary"
                  htmlType="submit"
                  className="!bg-[#28a745]"
                >
                  <RoundTickIcon />
                </Button>
              </div>
            </Form>
          </FiledSet>
        </div>
      </div>
    </Modal>
  );
}
