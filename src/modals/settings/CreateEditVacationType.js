"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Select, Input } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function CreateEditVacationType({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: visaType } = useSyncDbQuery("VacType");
  const {
    reset,
    mutate,
    isLoading,
    isSuccess,
    data: response,
  } = useCommonInsertUpdate("vac_type", "VacType");

  const handleFinish = (value) => mutate(value);

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [form, handleClose, isSuccess]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  const isEdit = !!data;

  return (
    <Modal
      title={isEdit ? t("Edit Vacation Type") : t("Create Vacation Type")}
      onCancel={handleClose}
      open={open}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          loading={isLoading}
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
              message: t("Name already exists"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = visaType?.data?.some(
                  (item) =>
                    String(item?.name)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                const { name } = data || {};

                if (isEdit && name) {
                  const condition =
                    String(name).toLowerCase().localeCompare(fieldValue) === 0;

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
          name="vac_limit"
          label={t("Limit")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Limit")}
            type="number"
            size="large"
            step={1}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>
        <Item
          name="is_payable"
          label={t("Is Payable")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            placeholder={t("Select")}
            options={[
              { label: "Yes", value: "1" },
              { label: "No", value: "0" },
            ]}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>
        <Item name="description" label={t("Description")}>
          <TextArea
            rows={2}
            size="large"
            placeholder={t("Description(Optional)")}
          />
        </Item>
      </Form>
    </Modal>
  );
}
