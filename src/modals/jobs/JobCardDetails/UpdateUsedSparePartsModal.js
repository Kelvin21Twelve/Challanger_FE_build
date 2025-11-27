"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";

import { useJobCardUsedPartsInsert } from "@/queries";

const { Item, useForm } = Form;

export default function UpdateLabourModal({
  data,
  open,
  onClose,
  onRefetchCalculations,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const {
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useJobCardUsedPartsInsert(data?.id || "");

  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (data) => {
    const { price, quantity } = data || {};
    mutate({ price, quantity });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (response?.success) {
      onRefetchCalculations?.();
      handleClose();
    }
  }, [handleClose, onRefetchCalculations, response]);

  return (
    <Modal
      open={open}
      title={t("Update Used Spare Parts")}
      onCancel={handleClose}
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
        <Button
          danger
          key="close"
          type="primary"
          htmlType="button"
          onClick={handleClose}
        >
          {t("Close")}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Item name="id" hidden />
        <Item name="job_id" hidden />
        <Item name="item_id" hidden />
        <Item name="item_name" label={t("Item Name")}>
          <Input size="large" placeholder={t("Item Name")} disabled />
        </Item>
        <Item
          name="quantity"
          label={t("Quantity")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            min={0}
            step={1}
            size="large"
            type="number"
            placeholder={t("Quantity")}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>
        <Item
          name="price"
          label={t("Price")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            min={0}
            step={0.1}
            size="large"
            type="number"
            placeholder={t("Price")}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>
      </Form>
    </Modal>
  );
}
