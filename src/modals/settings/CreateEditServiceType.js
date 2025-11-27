"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditServiceType({ open, onClose, data }) {
  const [form] = useForm();
  const t = useTranslations("modals");

  const { data: serviceType } = useSyncDbQuery("LabourServiceType");
  const {
    reset,
    mutate,
    isLoading,
    data: response,
  } = useCommonInsertUpdate("labourservicetype", "LabourServiceType");

  const isEdit = !!data;
  const isSuccess = !!response?.success;

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
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Service Type") : t("Create Service Type")}
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
          name="type"
          label={t("Type")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Service Type is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = serviceType?.data?.some(
                  (item) =>
                    String(item?.type)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.type) {
                  const condition =
                    String(data?.type)
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
          <Input size="large" placeholder={t("Service Type")} />
        </Item>
      </Form>
    </Modal>
  );
}
