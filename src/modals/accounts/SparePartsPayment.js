"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input } from "antd";

import { useCreateSupplierPayments } from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function CreateCar({ open, data, onClose, onRefetch }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const paymentType = useWatch("payment_mode", form);

  const {
    data: response,
    isPending,
    isError,
    mutate,
    reset,
  } = useCreateSupplierPayments();
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      payment_id: data?.id,
      invoice_no: data?.inv_no,
      payment_supplier: data?.supplier_name,
      user_id: localStorage.getItem("user_id"),
    };

    const formData = new FormData();
    Object.keys(payload).forEach((key) => formData.append(key, payload[key]));
    mutate(formData);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        total_amount:
          data.remaining_amt == 0 ? data.total_amt : data.remaining_amt,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) {
      handleClose();
      onRefetch();
    }
  }, [handleClose, isSuccess, onRefetch]);

  return (
    <Modal
      title={t("Spare Part Payment")}
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
        <div className="flex flex-col">
          <Item
            name="payment_mode"
            label={t("Payment Type")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              options={[
                {
                  label: t("Cash"),
                  value: "Cash",
                },
                {
                  label: t("Visa"),
                  value: "Visa",
                },
                {
                  label: t("Cheque"),
                  value: "Cheque",
                },
              ]}
              size="large"
              placeholder={t("Payment Type")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item
            name="check_no"
            label={t("Cheque No")}
            rules={
              paymentType === "Cheque"
                ? [{ required: true, message: t("This field is required") }]
                : []
            }
            hidden={paymentType !== "Cheque"}
          >
            <Input placeholder={t("Cheque No")} size="large" />
          </Item>

          <Item
            name="total_amount"
            label={t("Total Amount")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Total Amount")} size="large" disabled />
          </Item>

          <Item
            name="amount"
            label={t("Amount")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("Amount")}
              size="large"
              type="number"
              step={0.01}
            />
          </Item>
        </div>
      </Form>
    </Modal>
  );
}
