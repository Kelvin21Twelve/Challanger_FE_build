"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form, DatePicker } from "antd";

import { useCommonInsertUpdate } from "@/queries";

const { Item, useForm } = Form;
const { TextArea } = Input;

export default function CreateEditAnnouncement({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const isEdit = !!data;
  const { isLoading, isSuccess, mutate, reset } = useCommonInsertUpdate(
    "ann",
    "Announcement",
  );

  const handleFinish = (values) => {
    mutate({
      ...values,
      ann_date: dayjs(values.ann_date).format("YYYY-MM-DD"),
    });
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
        ann_date: dayjs(data?.ann_date),
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={isEdit ? t("Edit Announcement") : t("Create Announcement")}
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
        <Item name="id" hidden />
        <Item
          name="ann_date"
          label={t("Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker placeholder={t("Date")} className="w-full" />
        </Item>

        <Item
          name="description"
          label={t("Description")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <TextArea placeholder={t("Description")} className="w-full" />
        </Item>
      </Form>
    </Modal>
  );
}
