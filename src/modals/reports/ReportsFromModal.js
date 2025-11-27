"use client";

import dayjs from "dayjs";
import axios from "axios";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { Button, Input, Modal, Form, DatePicker, Checkbox } from "antd";

const { Item, useForm } = Form;

export default function ReportsFromModal(props) {
  const t = useTranslations("modals");
  const { open, onClose, data } = props || {};
  const { label, options, selected, defaultOption } = data || {};
  const selectedOption = options?.find(
    (item) => item.value == (selected || defaultOption),
  );

  const [form] = useForm();
  const [sendEmail, setSendEmail] = useState(false);

  const { mutate, isError, isPending, isSuccess, reset } = useMutation({
    mutationKey: ["reports-from-modal"],
    mutationFn: async (payload) => {
      const {
        viewModule,
        sendEmailModule,
        viewEmailEndpoint,
        sendEmailEndpoint,
      } = selectedOption || {};

      const formData = new FormData();
      formData.set("module", viewModule);
      formData.set("data[module]", viewModule);
      formData.set("data[send_to]", payload.send_to);
      formData.set("data[to_date]", payload.to_date);
      formData.set("data[modulemail]", sendEmailModule);
      formData.set("data[from_date]", payload.from_date);

      const p1 = axios
        .post(viewEmailEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const { view } = response?.data || {};
          if (view) window.open(view);
        });

      formData.set("module", sendEmailModule);

      const p2 = axios
        .post(sendEmailEndpoint, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          const { view } = response?.data || {};
          if (view) window.open(view);
        });

      await Promise.all([p1, p2]);
    },
  });

  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      from_date: dayjs(values?.from_date).format("YYYY-MM-DD"),
      to_date: dayjs(values?.to_date).format("YYYY-MM-DD"),
    };

    mutate(payload);
  };

  const handleClose = () => {
    form.resetFields();
    reset();
    onClose();
  };

  return (
    <Modal
      title={label + t(" Report Form")}
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
      <Form
        form={form}
        layout="vertical"
        className="w-full"
        onFinish={handleFinish}
      >
        <div className="grid grid-cols-2 gap-x-6">
          <Item
            name="from_date"
            label={t("From Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("From Date")}
            />
          </Item>

          <Item
            name="to_date"
            label={t("To Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              placeholder={t("To Date")}
              className="w-full"
            />
          </Item>
        </div>

        <hr />

        <Checkbox onChange={(e) => setSendEmail(e.target.checked)}>
          {t("Click here to send file in email")}
        </Checkbox>

        <div className="py-1" />

        <Item
          label={t("Mail ID")}
          name="send_to"
          rules={
            sendEmail
              ? [{ required: true, message: t("This field is required") }]
              : []
          }
        >
          <Input
            size="large"
            className="w-full"
            disabled={!sendEmail}
            placeholder={t("Mail ID")}
          />
        </Item>
      </Form>
    </Modal>
  );
}
