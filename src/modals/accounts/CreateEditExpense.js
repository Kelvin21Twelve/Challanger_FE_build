"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input, DatePicker } from "antd";

import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function CreateEditExpenseModal({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: expenseType } = useSyncDbQuery("ExpenseType");
  const { isLoading, isSuccess, mutate, reset } = useCommonInsertUpdate(
    "expense",
    "Expense",
  );
  const isEdit = !!data;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      exp_date: dayjs(values.date).format("YYYY-MM-DD"),
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
    form.setFieldValue("exp_date", dayjs());
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={!isEdit ? t("Create Expense") : t("Edit Expense")}
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
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="grid sm:grid-cols-2 sm:gap-5"
      >
        <Item name="id" hidden />
        <Item
          name="exp_date"
          label={t("Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker placeholder={t("Date")} className="w-full" disabled />
        </Item>

        <Item
          name="amount"
          label={t("Amount")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Amount")}
            type="number"
            step={0.01}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="user_account"
          label={t("Account Name")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Account Name")} />
        </Item>

        <Item
          name="vendor"
          label={t("Account Number")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Account Number")} />
        </Item>

        <Item
          name="expense_type"
          label={t("Expense Type")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            options={
              expenseType?.data
                ?.map(({ type, id }) => ({
                  label: type,
                  value: String(id),
                }))
                ?.filter((item) => !!item.label) || []
            }
            placeholder={t("Expense Type")}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item name="note" label={t("Notes")}>
          <TextArea placeholder={t("Notes")} />
        </Item>
      </Form>
    </Modal>
  );
}
