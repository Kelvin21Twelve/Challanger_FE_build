"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Input } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;
const { TextArea } = Input;

export default function CreateEditSupplier({
  open,
  data,
  onClose,
  setResponse,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: supplier } = useSyncDbQuery("Supplier");
  const {
    data: response,
    isLoading,
    isSuccess,
    mutate,
    reset,
  } = useCommonInsertUpdate("supplier", "Supplier");

  const isEdit = !!data;
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
      setResponse?.(response?.data);
      handleClose();
    }
  }, [handleClose, isSuccess, response?.data, setResponse]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Supplier") : t("Create Supplier")}
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
          name="name"
          label={t("Name")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Name is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = supplier?.data?.some(
                  (item) =>
                    String(item?.name)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.name) {
                  const condition =
                    String(data?.name)
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
          <Input size="large" placeholder={t("Name")} />
        </Item>
        <Item
          name="phone"
          label={t("Phone")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Phone")} />
        </Item>
        <Item
          name="profit_perc"
          label={t("Profit Percentage")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            min={0}
            step={0.01}
            size="large"
            type="number"
            placeholder={t("Profit Percentage")}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>
        <Item
          name="fax"
          label={t("Fax")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Fax")} />
        </Item>
        <Item
          name="account_no"
          label={t("Account No")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Account No")} />
        </Item>
        <Item name="address" label={t("Address")}>
          <TextArea
            rows={2}
            size="large"
            placeholder={t("Address(Optional)")}
          />
        </Item>
      </Form>
    </Modal>
  );
}
