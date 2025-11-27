"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input, DatePicker } from "antd";

import { useSyncDbQuery, usePrintAccountStatement } from "@/queries";

const { Item, useForm } = Form;

export default function SearchAccountModal({ open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data } = useSyncDbQuery("Account");
  const { isError, isPending, isSuccess, mutate, reset } =
    usePrintAccountStatement();

  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      to_date: dayjs(values?.to_date).format("YYYY-MM-DD"),
      from_date: dayjs(values?.from_date).format("YYYY-MM-DD"),
    };

    mutate(payload);
  };

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={t("Search Account")}
      onCancel={handleClose}
      open={open}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
          <Item
            name="account_code"
            label={t("Account Code")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              size="large"
              placeholder={t("Account Code")}
              options={
                data?.data?.map(({ account_code }) => ({
                  label: account_code,
                  value: account_code,
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item name="account_name_ar" label={t("Account Name Arabic")}>
            <Input placeholder={t("Account Name Arabic")} size="large" />
          </Item>

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

          <Item name="module" hidden />
        </div>
      </Form>
    </Modal>
  );
}
