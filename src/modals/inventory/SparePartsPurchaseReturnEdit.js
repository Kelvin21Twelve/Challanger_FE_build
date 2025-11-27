"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Input, Modal, Form, Button } from "antd";

import { handle422Errors } from "@/utils";
import { usePurchaseReturn } from "@/queries";

const { Item, useForm } = Form;

export default function SparePartsPurchaseReturnEdit({
  data,
  open,
  onClose,
  onRemove,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { mutate, reset, data: response } = usePurchaseReturn();
  const isSuccess = !!response?.success;

  const handleFinish = (values) => {
    const { inv_no, item_code, quantity, total_amt, balance, id } =
      values || {};

    const formData = new FormData();
    formData.append("myData[InvNo]", inv_no);
    formData.append("myData[item_code]", item_code);
    formData.append("myData[quntity]", quantity);
    formData.append("myData[price]", total_amt);
    formData.append("myData[balance]", balance);
    formData.append("myData[id]", id);
    formData.append("myData[p_quantity]", "");

    mutate(formData);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) {
      const { balance_qty, purchase_qty } = data || {};

      form.setFieldsValue({
        ...data,
        quantity: 0,
        balance: balance_qty == 0 ? purchase_qty || 0 : balance_qty || 0,
      });
    }
  }, [data, form, open]);

  useEffect(() => {
    if (isSuccess) {
      onRemove(data);
      handleClose();
    }
  }, [data, handleClose, isSuccess, onRemove]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      title={t("Spare Parts Purchase Return Edit")}
      footer={[
        <Button key="submit" type="primary" onClick={() => form.submit()}>
          {t("Submit")}
        </Button>,
        <Button key="close" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-8"
      >
        <Item name="id" hidden />
        <Item label={t("Inv No")} name="inv_no">
          <Input disabled size="large" />
        </Item>

        <Item name="item_code" label={t("Item Code")}>
          <Input disabled size="large" />
        </Item>

        <Item
          name="quantity"
          label={t("Quantity")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t(
                "Return quantity should be equal to or less than ordered quantity",
              ),
              validator: (_, value) => {
                const { balance } = form.getFieldsValue();
                const condition = Number(value || 0) > Number(balance || 0);
                return !condition ? Promise.resolve() : Promise.reject();
              },
            },
            {
              message: t("Quantity has to be grater than zero"),
              validator: (_, value) => {
                return !(value <= 0) ? Promise.resolve() : Promise.reject();
              },
            },
          ]}
        >
          <Input size="large" type="number" min={1} />
        </Item>

        <Item name="total_amt" label={t("Price")}>
          <Input disabled size="large" />
        </Item>

        <Item name="balance" label={t("Balance")}>
          <Input disabled size="large" />
        </Item>
      </Form>
    </Modal>
  );
}
