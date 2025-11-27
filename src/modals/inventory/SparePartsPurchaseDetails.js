"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Input, Modal, Form, Button } from "antd";

const { Item, useForm } = Form;

export default function SparePartsPurchaseDetails({ data, open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const handleClose = () => {
    form.resetFields();
    onClose();
  };

  useEffect(() => {
    form.setFieldsValue(data);
  }, [data, form]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={t("Spare Parts Purchase Return Search Form")}
      footer={[
        <Button key="close" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8"
      >
        <Item label={t("Inv No")} name="inv_no">
          <Input disabled />
        </Item>

        <Item name="item_code" label={t("Item Code")}>
          <Input disabled />
        </Item>

        <Item name="item_name" label={t("Item Name")}>
          <Input disabled />
        </Item>

        <Item name="supplier_name" label={t("Supplier Name")}>
          <Input disabled />
        </Item>

        <Item name="purchase_qty" label={t("Purchase Quantity")}>
          <Input disabled />
        </Item>

        <Item name="balance_qty" label={t("Balance Quantity")}>
          <Input disabled />
        </Item>

        <Item name="remaining_amt" label={t("Remaining Quantity")}>
          <Input disabled />
        </Item>

        <Item name="total_amt" label={t("Total Amount")}>
          <Input disabled />
        </Item>
      </Form>
    </Modal>
  );
}
