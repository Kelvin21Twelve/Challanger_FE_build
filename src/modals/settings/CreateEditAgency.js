"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditAgency({ open, onClose, data, setResponse }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: agency } = useSyncDbQuery("Agency");
  const {
    mutate,
    reset,
    isLoading,
    isSuccess,
    data: response,
  } = useCommonInsertUpdate("agency", "Agency");

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleFinish = (values) => mutate(values);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) {
      setResponse?.(response?.data);
      handleClose();
    }
  }, [handleClose, isSuccess, response?.data, setResponse]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  const isEdit = !!data;

  return (
    <Modal
      title={isEdit ? t("Edit Agency") : t("Create Agency")}
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
          label={t("Agency")}
          name="agency"
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Agency is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = agency?.data?.some(
                  (item) =>
                    String(item?.agency)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.agency) {
                  const condition =
                    String(data?.agency)
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
          <Input size="large" placeholder={t("Agency")} />
        </Item>
      </Form>
    </Modal>
  );
}
