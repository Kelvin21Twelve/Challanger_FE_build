"use client";

import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useTranslations } from "next-intl";
import { Button, Select, Modal, Form, Input } from "antd";

import { useGetItemCode } from "@/queries";

const { Item, useForm, useWatch } = Form;

export default function AddSparePartsSalesItem({ open, onClose, onAddNew }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const item_code_id = useWatch("id", form);
  const item_quantity = useWatch("quantity", form);
  const item_discount = useWatch("discount", form);

  const { data } = useGetItemCode();

  const itemsOptions = data?.data?.map((item) => ({
    label: item.item_code,
    value: item.id,
  }));

  const handleFinish = () => {
    onAddNew({
      uid: uuid(),
      ...form.getFieldsValue(),
    });

    handleClose();
  };

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    if (item_code_id) {
      const list = data?.data || [];
      const item = list.find((item) => item.id == item_code_id);

      form.setFieldsValue(item);
      form.setFieldValue("quantity", 1);
      form.setFieldValue("discount", 0);
      form.setFieldValue("total", item.sale_price);
    }
  }, [data?.data, form, item_code_id]);

  useEffect(() => {
    if (item_code_id) {
      const list = data?.data || [];
      const item = list.find((item) => item.id == item_code_id);
      if (item) {
        const { sale_price } = item;
        const total = Number(item_quantity) * Number(sale_price);
        const discountedAmount = (total * Number(item_discount)) / 100;
        const discountedTotal = total - discountedAmount;
        form.setFieldValue("total", discountedTotal);
      }
    }
  }, [item_quantity, item_discount, item_code_id, data?.data, form]);

  return (
    <Modal
      title={t("Add Spare Part Sales Item")}
      onCancel={handleClose}
      open={open}
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
        onFinish={handleFinish}
        className="grid grid-cols-1 sm:grid-cols-2 sm:gap-4"
      >
        <Item name="item_code" hidden />
        <Item
          name="id"
          label={t("Item Code")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            allowClear
            options={itemsOptions}
            placeholder={t("Item Code")}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item
          name="item_name"
          label={t("Item Name")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Item Name")} disabled />
        </Item>

        <Item
          name="quantity"
          label={t("Quantity")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            min={0}
            step={1}
            type="number"
            placeholder={t("Quantity")}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          label={t("Price")}
          name="sale_price"
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Price")} type="number" step={0.01} disabled />
        </Item>

        <Item
          name="discount"
          label={t("Discount")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            min={0}
            step={0.01}
            type="number"
            placeholder={t("Discount")}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="total"
          label={t("Total")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Total")} disabled type="number" step={0.01} />
        </Item>
      </Form>
    </Modal>
  );
}
