"use client";

import { useTranslations } from "next-intl";
import { useEffect, useCallback } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditMake({ open, onClose, data, setResponse }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: make } = useSyncDbQuery("CarMake");
  const {
    reset,
    mutate,
    isLoading,
    data: response,
  } = useCommonInsertUpdate("make", "CarMake");
  const isSuccess = !!response?.success;

  const handleFinish = (payload) => {
    mutate({
      ...data,
      ...payload,
    });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (isSuccess) {
      setResponse?.(response?.data);
      handleClose();
    }
  }, [handleClose, isSuccess, response, setResponse]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  const isEdit = !!data?.id;

  return (
    <Modal
      title={isEdit ? t("Edit Make") : t("Create Make")}
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
          name="make"
          label={t("Make")}
          rules={[
            {
              required: true,
              message: t("This field is required"),
            },
            {
              message: t("Make already exists"),
              validator(_, value) {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = make?.data?.some(
                  (item) =>
                    String(item.make)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.make) {
                  const condition =
                    String(data?.make)
                      .toLowerCase()
                      .localeCompare(value.toLowerCase()) === 0;

                  if (condition) flag = false;
                }

                return isExist && flag
                  ? Promise.reject(new Error())
                  : Promise.resolve();
              },
            },
          ]}
        >
          <Input size="large" placeholder={t("Make")} />
        </Item>
      </Form>
    </Modal>
  );
}
