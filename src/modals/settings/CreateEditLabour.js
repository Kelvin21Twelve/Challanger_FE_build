"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo } from "react";
import { Button, Modal, Form, Select, Input, Checkbox } from "antd";

import { handle422Errors } from "@/utils";
import { useSyncDbQuery, useCommonInsertUpdate } from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function CreateEditLabour({ open, onClose, data, onRefetch }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const makeValue = useWatch("car_view", form);
  const modelValue = useWatch("car_type", form);

  const { data: labours } = useSyncDbQuery("Labour");
  const { data: makeData } = useSyncDbQuery("CarMake");
  const { data: modelData } = useSyncDbQuery("CarModel");
  const { data: labourServiceTypeData } = useSyncDbQuery("LabourServiceType");
  const {
    data: response,
    isPending,
    isError,
    mutate,
    reset,
  } = useCommonInsertUpdate("labours", "Labour");

  const isEdit = !!data;
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      apply_for_all: values?.apply_for_all ? "yes" : "no",
      print_adoption: values?.print_adoption ? "yes" : "no",
    };

    mutate(payload);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data,
        apply_for_all: data?.apply_for_all == "yes",
        print_adoption: data?.print_adoption == "yes",
      });
    }
  }, [data, form]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    if (isSuccess) {
      onRefetch?.();
      handleClose();
    }
  }, [handleClose, isSuccess, onRefetch]);

  const filteredModels = useMemo(
    () => modelData?.data?.filter((item) => item.make == makeValue) || [],
    [modelData, makeValue],
  );

  useEffect(() => {
    const condition = makeValue && modelValue && modelData?.data;
    if (!condition) return;

    if (!filteredModels.some((item) => item.id == modelValue))
      form.setFieldValue("car_type");
  }, [form, makeValue, modelData?.data, modelData, filteredModels, modelValue]);

  return (
    <Modal
      title={isEdit ? t("Edit Labour") : t("Create Labour")}
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
            name="car_view"
            label={t("Car View")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Car View")}
              options={
                makeData?.data?.map(({ make, id }) => ({
                  label: make,
                  value: id,
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Item
            name="price"
            label={t("Price")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              min={0}
              step={0.1}
              size="large"
              type="number"
              placeholder={t("Price")}
              onKeyDown={(e) =>
                ["+", "-", "e"].includes(e.key) && e.preventDefault()
              }
            />
          </Item>
          <Item
            name="car_type"
            label={t("Car Model")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Car Model")}
              options={filteredModels.map(({ model, id }) => ({
                label: model,
                value: id,
              }))}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Item
            name="service_type"
            label={t("Service Type")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Service Type")}
              options={
                labourServiceTypeData?.data?.map(({ type, id }) => ({
                  label: type,
                  value: String(id),
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Item
            name="name"
            label={t("Labour Name")}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Labour already exists"),
                validator: (_, value) => {
                  const { car_view, car_type } = form.getFieldsValue();

                  const fieldValue = String(value).trim().toLowerCase();
                  const isExist = labours?.data
                    ?.filter(
                      (item) =>
                        item?.car_type == car_type &&
                        item?.car_view == car_view,
                    )
                    ?.some(
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
            <Input size="large" placeholder={t("Labour Name")} />
          </Item>

          <div className="font-semibold">
            <Item
              className="!mb-0"
              name="apply_for_all"
              valuePropName="checked"
            >
              <Checkbox size="large">{t("Apply For All")}</Checkbox>
            </Item>
            <Item name="print_adoption" valuePropName="checked">
              <Checkbox size="large">{t("Print Approval Disclaimer")}</Checkbox>
            </Item>
          </div>
        </div>
      </Form>
    </Modal>
  );
}
