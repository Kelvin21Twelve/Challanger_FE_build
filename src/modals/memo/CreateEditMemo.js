"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form, DatePicker } from "antd";

import { useCommonInsertUpdate } from "@/queries";

const { Item, useForm } = Form;
const { TextArea } = Input;

export default function CreateEditMemo({ open, data, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { isError, isPending, isSuccess, mutate, reset } =
    useCommonInsertUpdate("memo", "Memo");

  const isEdit = !!data;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      date: dayjs(values.date).format("YYYY-MM-DD"),
    };

    mutate(payload);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={isEdit ? t("Edit Memo") : t("Create Memo")}
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
          name="note"
          label={t("Note")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <TextArea size="large" placeholder={t("Note")} />
        </Item>

        <Item
          name="date"
          label={t("Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker size="large" placeholder={t("Date")} className="w-full" />
        </Item>
      </Form>
    </Modal>
  );
}
