"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditColor({ open, onClose, data, setResponse }) {
  const [form] = useForm();
  const t = useTranslations("modals");

  const { data: colors } = useSyncDbQuery("CarColor");
  const {
    reset,
    mutate,
    isError,
    isPending,
    data: response,
  } = useCommonInsertUpdate("color", "CarColor");

  const isEdit = !!data?.id;
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (value) => mutate(value);

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
  }, [form, handleClose, isSuccess, response?.data, setResponse]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Color") : t("Create Color")}
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
          name="color"
          label={t("Color")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Color is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = colors?.data?.some(
                  (item) =>
                    String(item?.color)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.color) {
                  const condition =
                    String(data?.color)
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
          <Input size="large" placeholder={t("Color")} />
        </Item>
      </Form>
    </Modal>
  );
}
