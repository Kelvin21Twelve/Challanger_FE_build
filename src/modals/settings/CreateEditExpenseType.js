"use client";

import { useTranslations } from "next-intl";
import { useEffect, useCallback } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditExpenseType({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const isEdit = !!data;
  const { data: expenseType } = useSyncDbQuery("ExpenseType");
  const {
    isLoading,
    isSuccess,
    mutate,
    reset,
    data: response,
  } = useCommonInsertUpdate("expense_type", "ExpenseType");

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
      title={isEdit ? t("Edit Expense Type") : t("Create Expense Type")}
      onCancel={handleClose}
      open={open}
      width={1000}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Item name="id" hidden />
          <Item
            name="account_number"
            label={t("Account Number")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input size="large" placeholder={t("Account Number")} />
          </Item>
          <Item
            name="account_name"
            label={t("Account Name")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input size="large" placeholder={t("Account Name")} />
          </Item>
          <Item
            name="type"
            label={t("Expense Type")}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Expense Type is already exist"),
                validator: (_, value) => {
                  const fieldValue = String(value).trim().toLowerCase();
                  const isExist = expenseType?.data?.some(
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
            <Input size="large" placeholder={t("Expense Type")} />
          </Item>
        </div>
      </Form>
    </Modal>
  );
}
