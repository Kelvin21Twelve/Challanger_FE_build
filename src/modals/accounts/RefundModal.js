"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Input, Radio } from "antd";

import { useJobCardPaymentRefund, useRefundReceipt } from "@/queries";

const { Item, useForm } = Form;

export default function RefundModal({ open, onClose, data, onRefetch }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { mutate: printRefundReceipt } = useRefundReceipt();

  const { mutate, isPending, isSuccess, isError, reset } =
    useJobCardPaymentRefund();
  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleFinish = useCallback(
    ({ refund_reason, id, refund_by }) => {
      const form = new FormData();
      form.set("job_id", id);
      form.set("refund_by", refund_by);
      form.set("refund_reason", refund_reason);
      mutate(form);
    },
    [mutate],
  );

  useEffect(() => {
    if (data && open) {
      form.setFieldValue("id", data?.id);
      form.setFieldValue(
        "refund_amount",
        Math.abs(data?.job_card_calculation?.balance || 0),
      );
    }
  }, [data, form, open]);

  useEffect(() => {
    if (isSuccess && data) {
      onRefetch();
      printRefundReceipt(data?.id);
      handleClose();
    }
  }, [data, handleClose, isSuccess, onRefetch, printRefundReceipt]);

  return (
    <Modal
      title={t("Refund for Invoice") + " # " + data?.job_no}
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
          {t("Cancel")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        initialValues={{
          reason: "",
          refund_amount: "",
        }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Item name="id" hidden />
        <Item name="refund_amount" label={t("Refund Amount")}>
          <Input
            placeholder={t("Refund Amount")}
            size="large"
            suffix="KD"
            disabled
          />
        </Item>

        <Item
          name="refund_by"
          label={t("Refund By")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Radio.Group>
            <Radio value="Cash">{t("Cash")}</Radio>
            <Radio value="Card">{t("Card")}</Radio>
          </Radio.Group>
        </Item>

        <Item
          label={t("Reason")}
          name="refund_reason"
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input.TextArea placeholder={t("Reason")} size="large" />
        </Item>
      </Form>
    </Modal>
  );
}
