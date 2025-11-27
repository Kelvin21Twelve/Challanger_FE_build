"use client";

import { Button, Modal, Form, Input } from "antd";
import { useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditVisaType({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: visaType } = useSyncDbQuery("VisaType");
  const {
    reset,
    mutate,
    isError,
    isPending,
    data: response,
  } = useCommonInsertUpdate("visa_type", "VisaType");

  const isEdit = !!data;
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (value) => mutate(value);

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (response?.success) handleClose();
  }, [handleClose, response]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Visa Type") : t("Create Visa Type")}
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
          name="visa_type"
          label={t("Visa Type")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Visa Type is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = visaType?.data?.some(
                  (item) =>
                    String(item?.visa_type)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.visa_type) {
                  const condition =
                    String(data?.visa_type)
                      .toLowerCase()
                      .localeCompare(fieldValue) === 0;

                  if (condition) flag = false;
                }

                return isExist && flag
                  ? Promise.reject(new Error())
                  : Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder={t("Visa Type")} />
        </Item>
      </Form>
    </Modal>
  );
}
