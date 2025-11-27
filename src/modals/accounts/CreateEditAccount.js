"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input, Checkbox } from "antd";

import { useCommonInsertUpdate } from "@/queries";

const { Item, useForm } = Form;

export default function CreateCar({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { isError, isPending, isSuccess, mutate, reset } =
    useCommonInsertUpdate("account", "Account");

  const isEdit = !!data;
  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      printable: values?.printable ? "1" : "0",
      is_bank_account: values?.is_bank_account ? "1" : "0",
      is_cash_account: values?.is_cash_account ? "1" : "0",
    };

    mutate(payload);
  };

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        printable: data?.printable == 1,
        is_bank_account: data?.is_bank_account == 1,
        is_cash_account: data?.is_cash_account == 1,
      });
    }
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  return (
    <Modal
      title={!isEdit ? t("Create Account") : t("Edit Account")}
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
              label={t("Account Name")}
              name="account_name_en"
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Account Name")} />
            </Item>

            <Item
              name="account_name_ar"
              label={t("Account Name Arabic")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Account Name Arabic")} />
            </Item>

            <Item name="account_code" label={t("Account Code")}>
              <Input placeholder={t("Account Code")} />
            </Item>

            <Item
              name="super_account"
              label={t("Super Account")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                options={[
                  {
                    label: t("Supper Account 1"),
                    value: "1",
                  },
                  {
                    label: t("Supper Account 2"),
                    value: "2",
                  },
                ]}
                className="grow"
                placeholder={t("Super Account")}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>
          </div>

          <div className="flex flex-col">
            <Item
              name="opening_balance"
              label={t("Opening Balance")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input
                placeholder={t("Opening Balance")}
                type="number"
                step={0.01}
                min={0}
                onKeyDown={(e) =>
                  ["+", "-", "e"].includes(e.key) && e.preventDefault()
                }
              />
            </Item>

            <Item
              name="balance"
              label={t("Balance")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input
                placeholder={t("Balance")}
                type="number"
                step={0.01}
                min={0}
                onKeyDown={(e) =>
                  ["+", "-", "e"].includes(e.key) && e.preventDefault()
                }
              />
            </Item>

            <div className="flex flex-col gap-2">
              <Item name="printable" noStyle valuePropName="checked">
                <Checkbox className="font-semibold">
                  {t("Print in sheet balance reports")}
                </Checkbox>
              </Item>

              <Item name="is_cash_account" noStyle valuePropName="checked">
                <Checkbox className="font-semibold">
                  {t("Cash Account")}
                </Checkbox>
              </Item>

              <Item name="is_bank_account" noStyle valuePropName="checked">
                <Checkbox className="font-semibold">
                  {t("Bank Account")}
                </Checkbox>
              </Item>
            </div>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
