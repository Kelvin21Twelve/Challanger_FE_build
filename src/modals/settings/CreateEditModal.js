"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { Button, Modal, Form, Select, Input } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditModal({ open, onClose, data, setResponse }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: modelData } = useSyncDbQuery("CarModel");
  const { data: makeData } = useSyncDbQuery("CarMake");
  const {
    data: response,
    isPending,
    isError,
    mutate,
    reset,
  } = useCommonInsertUpdate("model", "CarModel");

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
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) {
      setResponse?.(response?.data);
      handleClose();
    }
  }, [handleClose, isSuccess, response, setResponse]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  const makeOptions = useMemo(
    () =>
      makeData?.data?.map((item) => ({
        label: item.make,
        value: String(item.id),
      })) || [],
    [makeData?.data],
  );

  return (
    <Modal
      title={isEdit ? t("Edit Model") : t("Create Model")}
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
          name="make"
          label={t("Make")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            placeholder={t("Make")}
            options={makeOptions}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item
          name="model"
          label={t("Model")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Model already exists"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const makeValue = form.getFieldValue("make");
                const filteredModels =
                  modelData?.data?.filter(({ make }) => make == makeValue) ||
                  [];

                const isExist = filteredModels.some(
                  ({ model }) =>
                    String(model).toLowerCase().localeCompare(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.model) {
                  const condition =
                    String(data?.model)
                      .toLowerCase()
                      .localeCompare(fieldValue) === 0;

                  if (condition) flag = false;
                }

                return isExist && flag
                  ? Promise.reject(new Error(""))
                  : Promise.resolve();
              },
            },
          ]}
        >
          <Input showSearch size="large" placeholder={t("Model")} />
        </Item>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Item
            name="from_model_year"
            label={t("From Year")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("From Year")}
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
            name="to_model_year"
            label={t("To Year")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("To Year")}
              type="number"
              size="large"
              step={1}
              min={0}
              onKeyDown={(e) =>
                ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
              }
            />
          </Item>
        </div>
      </Form>
    </Modal>
  );
}
