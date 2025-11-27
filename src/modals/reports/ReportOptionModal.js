"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import axios from "axios";
import dayjs from "dayjs";
import {
  Button,
  Input,
  Modal,
  Form,
  Radio,
  Select,
  Checkbox,
  DatePicker,
} from "antd";
import { useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function ReportOptionModal({
  open,
  onClose,
  isSupplierReport,

  viewModule,
  sendModule,
  viewEndpoint,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();
  const [sendEmail, setSendEmail] = useState(false);

  const { data } = useSyncDbQuery("Supplier");
  const { isSuccess, isPending, isError, reset, mutate } = useMutation({
    mutationKey: ["print-expense-supplier-report"],
    mutationFn: async (payload) => {
      const form = new FormData();
      form.set("data[supplier]", payload.supplier);
      form.set("module", viewModule);
      form.set(
        "data[supplier_wise_report]",
        payload.supplier_wise_report || "1",
      );
      form.set("data[to_date]", dayjs(payload.to_date).format("YYYY-MM-DD"));
      form.set("data[modulemail]", sendModule);
      form.set("data[module]", viewModule);
      form.set(
        "data[from_date]",
        dayjs(payload.from_date).format("YYYY-MM-DD"),
      );

      if (payload?.send_to) form.set("data[send_to]", payload?.send_to);

      const p1 = axios
        .post(viewEndpoint, form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const { view } = response?.data || {};
          if (view) window.open(view);
        });

      await Promise.all([p1]);
    },
  });

  const isLoading = isSuccess && !isPending && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
    reset();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={
        isSupplierReport
          ? t("Spare Parts Supplier Report")
          : t("Expense Report")
      }
      onCancel={handleClose}
      open={open}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          loading={isLoading}
          disabled={isLoading}
          onClick={() => form.submit()}
        >
          {t("Submit")}
        </Button>,
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={mutate}
        className="w-full"
        initialValues={{
          supplier_wise_report: "1",
        }}
      >
        {isSupplierReport && (
          <Item
            name="supplier"
            label={t("Supplier")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              options={
                data?.data?.map(({ name }) => ({
                  label: name,
                  value: name,
                })) || []
              }
              className="w-full"
              placeholder={t("Supplier")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
        )}

        <div className="grid grid-cols-2 gap-x-6">
          <Item
            name="from_date"
            label={t("From Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("From Date")}
            />
          </Item>

          <Item
            name="to_date"
            label={t("To Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("To Date")}
            />
          </Item>
        </div>

        <Item
          label={t("Frequencies")}
          name="supplier_wise_report"
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Radio.Group
            defaultValue="1"
            options={[
              { label: t("Weekly"), value: "1" },
              { label: t("Monthly"), value: "2" },
              { label: t("Yearly"), value: "3" },
            ]}
          />
        </Item>

        {isSupplierReport && (
          <div>
            <hr />
            <div className="pb-3">
              <Checkbox onClick={() => setSendEmail((prev) => !prev)}>
                {t("Click here to send file in email")}
              </Checkbox>
            </div>
            <Item
              name="send_to"
              label={t("Mail ID")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input
                size="large"
                className="w-full"
                disabled={!sendEmail}
                placeholder={t("Mail ID")}
              />
            </Item>
          </div>
        )}
      </Form>
    </Modal>
  );
}
