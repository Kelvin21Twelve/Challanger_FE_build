"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { Button, Input, Modal, Form, Select } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function CreateUsedSparePartsModal({
  open,
  dataId,
  onClose,
  onRefetch,
  partialData,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const makeValue = useWatch("car_view", form);
  const modelValue = useWatch("car_type", form);

  const { data: makeData, isLoading: makeLoading } = useSyncDbQuery("CarMake");
  const { data: modelData, isLoading: modelLoading } =
    useSyncDbQuery("CarModel");
  const { data: usedSparePartsData } = useSyncDbQuery("UsedSpareParts");

  const data = useMemo(
    () => usedSparePartsData?.data?.find(({ id }) => id == dataId) || {},
    [dataId, usedSparePartsData],
  );

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useCommonInsertUpdate("used_parts", "UsedSpareParts");

  const isEdit = !!dataId;
  const isLoading = isPending && !response?.success && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    if (dataId && data) form.setFieldsValue(data);
  }, [data, dataId, form]);

  useEffect(() => {
    if (isSuccess) {
      onRefetch?.();
      handleClose();
    }
  }, [handleClose, isSuccess, onRefetch]);

  const makeOptions = useMemo(
    () =>
      makeData?.data?.map(({ make, id }) => ({
        label: make,
        value: String(id),
      })) || [],
    [makeData],
  );

  const modelOptions = useMemo(
    () =>
      modelData?.data.map(({ model, id, make }) => ({
        label: model,
        value: String(id),
        make,
      })) || [],
    [modelData],
  );

  const filteredModelOptions = useMemo(
    () => modelOptions.filter(({ make }) => make == makeValue) || [],
    [modelOptions, makeValue],
  );

  useEffect(() => {
    const condition = makeValue && modelValue && modelData?.data;
    if (!condition) return;

    if (!filteredModelOptions?.some((item) => item.value == modelValue))
      form.setFieldValue("car_type");
  }, [filteredModelOptions, form, makeValue, modelData, modelValue]);

  useEffect(() => {
    if (partialData && open) form.setFieldsValue(partialData);
  }, [form, open, partialData]);

  return (
    <Modal
      title={
        !isEdit ? t("Create Used Spare Parts") : t("Edit Used Spare Parts")
      }
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
        onFinish={mutate}
        initialValues={{ sale_price: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 sm:gap-x-6 gap-y-0"
      >
        <div>
          <Item
            name="car_view"
            label={t("Car View")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              options={makeOptions}
              loading={makeLoading}
              placeholder={t("Car View")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item
            name="car_type"
            label={t("Car Type")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              loading={modelLoading}
              placeholder={t("Car Type")}
              options={filteredModelOptions}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item
            name="item_name"
            label={t("Item Name")}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Item name is already exists"),
                validator: (_, value) => {
                  const fieldValue = String(value).trim().toLowerCase();
                  const isExist = usedSparePartsData?.data
                    ?.filter(
                      (item) =>
                        item.car_view == makeValue &&
                        item.car_type == modelValue,
                    )
                    ?.some(
                      (item) =>
                        String(item?.item_name)
                          .toLowerCase()
                          .localeCompare?.(fieldValue) === 0,
                    );

                  let flag = true;
                  if (isEdit && data?.item_name) {
                    const condition =
                      String(data?.item_name)
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
            <Input size="large" placeholder={t("Item Name")} />
          </Item>
        </div>
        <div>
          <Item name="id" hidden />

          <Item
            name="sale_price"
            label={t("Sales Price")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("Sales Price")}
              type="number"
              size="large"
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
              size="large"
              step={0.01}
              min={0}
              onKeyDown={(e) =>
                ["+", "-", "e"].includes(e.key) && e.preventDefault()
              }
            />
          </Item>

          <Item
            name="min_limit"
            label={t("Min Limit")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("Min Limit")}
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
