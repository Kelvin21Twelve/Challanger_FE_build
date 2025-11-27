"use client";

import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { Button, Input, Modal, Form, Select } from "antd";

import { PlusIcon } from "@/assets/icons/actions";

import { useSyncDbQuery } from "@/queries";

import CreateNewSparePartsModal from "@/modals/inventory/CreateNewSpareParts";

const { Item, useForm, useWatch } = Form;

export default function CreateAddSparePartsItemModal({
  open,
  onClose,
  onSubmit,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const itemCodeValue = useWatch("item_code", form);
  const quantityValue = useWatch("quantity", form);
  const agentPriceValue = useWatch("agent_price", form);
  const [addNewSpareParts, setAddNewSpareParts] = useState(false);

  const { data } = useSyncDbQuery("NewSpareParts");

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  const handleSubmit = () => {
    const values = form.getFieldsValue();
    onSubmit({
      ...values,
      uuid: uuid(),
    });
    handleClose();
  };

  const itemCodeOptions = useMemo(() => data?.data || [], [data]);

  useEffect(() => {
    if (itemCodeValue) {
      const item =
        itemCodeOptions?.find(({ item_code }) => item_code == itemCodeValue) ||
        {};

      if (item) form.setFieldsValue(item);
    }
  }, [form, itemCodeOptions, itemCodeValue]);

  useEffect(() => {
    if (quantityValue && agentPriceValue) {
      form.setFieldValue(
        "total_amount",
        Number(quantityValue || 0) * Number(agentPriceValue || 0),
      );
    }
  }, [quantityValue, agentPriceValue, form]);

  useEffect(() => {
    if (itemCodeValue) form.setFieldValue("quantity", 0);
  }, [form, itemCodeValue]);

  return (
    <Modal
      title={t("Add Item")}
      onCancel={handleClose}
      open={open}
      width={{ lg: "70%" }}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
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
        initialValues={{
          balance: 0,
          quantity: 0,
          agent_price: 0,
          total_amount: 0,
        }}
        onFinish={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0"
      >
        <div className="flex items-start gap-3">
          <Item name="id" hidden />
          <Item
            name="item_code"
            className="grow"
            label={t("Item Code")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Item Code")}
              options={
                itemCodeOptions?.map(({ item_code }) => ({
                  label: item_code,
                  value: item_code,
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Button
            size="small"
            type="primary"
            className="mt-8"
            onClick={() => setAddNewSpareParts(true)}
          >
            <PlusIcon />
          </Button>
        </div>

        <Item
          name="item_name"
          label={t("Item Name")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Item Name")} disabled />
        </Item>

        <Item
          name="quantity"
          label={t("Quantity")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Quantity must be greater than zero"),
              validator: (_, value) =>
                Number(value) > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("")),
            },
          ]}
        >
          <Input
            placeholder={t("Quantity")}
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
          name="agent_price"
          label={t("Supplier Price")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Supplier price must be greater than zero"),
              validator: (_, value) =>
                Number(value) > 0
                  ? Promise.resolve()
                  : Promise.reject(new Error("")),
            },
          ]}
        >
          <Input
            placeholder={t("Supplier Price")}
            size="large"
            step={0.1}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="total_amount"
          label={t("Total Amount")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            disabled
            size="large"
            type="number"
            placeholder={t("Total Amount")}
          />
        </Item>

        <Item
          name="quantity"
          label={t("Balance")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Balance")}
            type="number"
            size="large"
            disabled
          />
        </Item>
      </Form>

      <CreateNewSparePartsModal
        open={addNewSpareParts}
        onClose={() => setAddNewSpareParts(false)}
      />
    </Modal>
  );
}
