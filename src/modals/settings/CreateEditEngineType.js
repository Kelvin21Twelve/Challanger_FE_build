"use client";

import { useTranslations } from "next-intl";
import { useEffect, useCallback, useMemo } from "react";
import { Button, Modal, Form, Select, Input } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function CreateEditEngineType({
  open,
  data,
  onClose,
  setResponse,
}) {
  const t = useTranslations("modals");
  const isEdit = !!data?.id;

  const [form] = useForm();
  const makeValue = useWatch("make", form);
  const modelValue = useWatch("model", form);

  const { data: make } = useSyncDbQuery("CarMake");
  const { data: model } = useSyncDbQuery("CarModel");
  const { data: engine } = useSyncDbQuery("CarEngine");

  const {
    reset,
    mutate,
    isError,
    isPending,
    data: response,
  } = useCommonInsertUpdate("engine", "CarEngine", "_rec");

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

  const modelData = useMemo(
    () => model?.data?.filter((item) => item.make == makeValue) || [],
    [makeValue, model?.data],
  );

  useEffect(() => {
    const condition = makeValue && modelValue && model?.data;
    if (!condition) return;

    if (!modelData.some((item) => item.id == modelValue))
      form.setFieldValue("model");
  }, [form, makeValue, model?.data, modelData, modelValue]);

  return (
    <Modal
      title={isEdit ? t("Edit Engine Type") : t("Create Engine Type")}
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
            size="large"
            showSearch
            disabled={isEdit}
            placeholder={t("Make")}
            loading={make?.isLoading}
            options={make?.data?.map((item) => ({
              label: item.make,
              value: String(item.id),
            }))}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>
        <Item
          name="model"
          label={t("Model")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            disabled={isEdit}
            placeholder={t("Model")}
            loading={model?.isLoading}
            options={modelData.map((item) => ({
              label: item.model,
              value: String(item.id),
            }))}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item
          name="engine_type"
          label={t("Engine Type")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Engine type already exists"),
              validator: (_, value) => {
                const makeValue = form.getFieldValue("make");
                const modelValue = form.getFieldValue("model");
                const filteredEngines =
                  engine?.data?.filter(
                    ({ make, model }) =>
                      make == makeValue && model == modelValue,
                  ) || [];

                const isExist = filteredEngines.some(
                  ({ engine_type }) =>
                    String(engine_type)
                      .toLowerCase()
                      .localeCompare(String(value).toLowerCase()) === 0,
                );

                let flag = true;
                const { engine_type } = data || {};
                if (isEdit && engine_type) {
                  const condition =
                    String(engine_type)
                      .toLowerCase()
                      .localeCompare(value.toLowerCase()) === 0;

                  if (condition) flag = false;
                }

                return isExist && flag
                  ? Promise.reject(new Error(""))
                  : Promise.resolve();
              },
            },
          ]}
        >
          <Input size="large" placeholder={t("Engine Type")} />
        </Item>
        <Item name="liter" label={t("Liter")}>
          <Input
            min={0}
            showSearch
            step={0.01}
            size="large"
            type="number"
            placeholder={t("Liter")}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>
      </Form>
    </Modal>
  );
}
