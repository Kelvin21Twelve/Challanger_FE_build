"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { Button, Select, Modal, Form, Input, DatePicker } from "antd";

import { handle422Errors } from "@/utils";
import {
  useSyncDbQuery,
  useGetGeneralLedgerById,
  useCreateEditGeneralLedger,
} from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function CreateEditGeneralLedger({
  open,
  data,
  onClose,
  onRefetch,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const toAccountNo = useWatch("to_acc_no", form);
  const fromAccountNo = useWatch("from_acc_no", form);

  const { data: accounts } = useSyncDbQuery("Account");
  const { data: ledgerData } = useGetGeneralLedgerById(data?.transaction_id);
  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useCreateEditGeneralLedger();

  const isEdit = !!data?.transaction_id;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => {
    mutate({
      ...values,
      date: dayjs(values?.date).format("YYYY-MM-DD"),
    });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (ledgerData && open)
      form.setFieldsValue({
        ...ledgerData,
        date: dayjs(ledgerData?.date),
      });
  }, [ledgerData, form, open]);

  const accountOptions = useMemo(
    () =>
      accounts?.data?.map(({ account_code, account_name_en, id }) => ({
        id,
        label: account_code,
        value: account_code,
        name: account_name_en,
      })) || [],
    [accounts],
  );

  useEffect(() => {
    if (fromAccountNo) {
      form.setFieldValue(
        "from_acc_name",
        accountOptions.find((item) => item.value === fromAccountNo)?.name,
      );
    }
  }, [accountOptions, form, fromAccountNo]);

  useEffect(() => {
    if (toAccountNo) {
      form.setFieldValue(
        "to_acc_name",
        accountOptions.find((item) => item.value === toAccountNo)?.name,
      );
    }
  }, [accountOptions, form, toAccountNo]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    if (isSuccess) {
      onRefetch();
      handleClose();
    }
  }, [handleClose, isSuccess, onRefetch]);

  return (
    <Modal
      title={!isEdit ? t("Create General Ledger") : t("Edit General Ledger")}
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
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
          <div className="flex flex-col">
            <Item name="id" hidden />
            <Item
              name="from_acc_no"
              label={t("From Account No")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                options={accountOptions}
                placeholder={t("From Account No")}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item
              name="to_acc_no"
              label={t("To Account No")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                options={accountOptions}
                placeholder={t("To Account No")}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item
              name="date"
              label={t("Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker className="w-full" placeholder={t("Date")} />
            </Item>

            <Item
              name="amount"
              label={t("Amount")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input
                placeholder={t("Amount")}
                className="w-full"
                type="number"
                step={0.01}
                min={0}
                onKeyDown={(e) =>
                  ["+", "-", "e"].includes(e.key) && e.preventDefault()
                }
              />
            </Item>
          </div>

          <div className="flex flex-col">
            <Item name="from_acc_name" label={t("From Account Name")}>
              <Input placeholder={t("From Account Name")} disabled />
            </Item>

            <Item name="to_acc_name" label={t("To Account Name")}>
              <Input placeholder={t("To Account Name")} disabled />
            </Item>

            <Item
              name="type"
              label={t("Type")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                options={[
                  {
                    label: t("Type 1"),
                    value: "1",
                  },
                  {
                    label: t("Type 2"),
                    value: "2",
                  },
                ]}
                placeholder={t("Type")}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item
              name="description"
              label={t("Description")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input className="w-full" placeholder={t("Description")} />
            </Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
