"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";

import { handle422Errors } from "@/utils";
import { useCreateEditRole } from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function CreateEditDepartment({
  open,
  data,
  onClose,
  onRefetch,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const isEdit = !!data;
  const {
    isSuccess,
    isLoading,
    mutate,
    reset,
    data: response,
  } = useCreateEditRole();

  const handleFinish = (values) => mutate(values);

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) {
      onRefetch();
      handleClose();
    }
  }, [handleClose, isSuccess, onRefetch]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Roles") : t("Create Roles")}
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
        <Item
          name="name"
          label={t("Role Name")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Role Name")} />
        </Item>
        <Item
          name="description"
          label={t("Role Description")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <TextArea rows={2} size="large" placeholder={t("Role Description")} />
        </Item>
      </Form>
    </Modal>
  );
}
