"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";

import { useUpdateJobCardLabour } from "@/queries";

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
  } = useUpdateJobCardLabour(data?.id || "");

  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => mutate(values);

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
      title={t("Update Labour")}
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
        <Item name="labour_name" label={t("Name")}>
          <Input size="large" placeholder={t("Name")} disabled />
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
            step={0.01}
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
