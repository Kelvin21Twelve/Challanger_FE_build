"use client";

import axios from "axios";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { Button, Modal, Form, Input, Checkbox } from "antd";

const { useForm, Item } = Form;

export default function ViewEmailModal({ data, open, onClose }) {
  const t = useTranslations("modals");
  const {
    label: title,
    viewEmailModule,
    sendEmailModule,
    viewFileEndpoint,
    sendEmailEndpoint,
  } = data || {};
  const [toggleEmail, setToggleEmail] = useState(false);

  const {
    mutate: viewFileMutate,
    isPending,
    isSuccess,
    isError,
    reset,
  } = useMutation({
    mutationKey: [viewEmailModule + "-reports"],
    mutationFn: async () => {
      const response = await axios.post(viewFileEndpoint, {
        module: viewEmailModule,
      });

      const { view } = response?.data || {};
      if (view) window.open(view);

      return response?.data;
    },
  });
  const isLoading = isPending && !isSuccess && !isError;

  const {
    mutate: sendEmailMutate,
    isPending: sendIsPending,
    isSuccess: sendIsSuccess,
    isError: sendIsError,
    reset: sendReset,
  } = useMutation({
    mutationKey: [sendEmailModule + "-reports"],
    mutationFn: async (payload) => {
      const response = await axios.post(sendEmailEndpoint, {
        data: payload,
        module: sendEmailModule,
      });

      const { view } = response?.data || {};
      if (view) window.open(view);

      return response?.data;
    },
  });

  const sendIsLoading = sendIsPending && !sendIsSuccess && !sendIsError;

  const [form] = useForm();

  const handleFinish = (values) => sendEmailMutate(values?.email || "");

  const handleClose = () => {
    form.resetFields();
    reset();
    sendReset();
    setToggleEmail(false);
    onClose();
  };

  return (
    <Modal
      onCancel={handleClose}
      title={title}
      open={open}
      footer={[
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <div>
        <div className="bg-white rounded shadow border border-[#dfe0e1] p-5 w-full">
          <div className="text-xl font-semibold">{t("View the file")}</div>
          <hr />
          <Button
            block
            type="primary"
            loading={isLoading}
            disabled={isLoading}
            onClick={() => viewFileMutate()}
          >
            {t("PDF")}
          </Button>
        </div>

        <div className="bg-white rounded shadow border border-[#dfe0e1] p-5 w-full mt-4">
          <div className="text-xl font-semibold">{t("Email the file")}</div>
          <hr />
          <div>
            <Checkbox
              checked={toggleEmail}
              onChange={(e) => setToggleEmail(e.target.checked)}
            >
              {t("Click here to send file in email")}
            </Checkbox>
          </div>

          <div className="py-2" />

          <Form form={form} layout="vertical" onFinish={handleFinish}>
            <Item
              label={t("Mail ID")}
              name="email"
              rules={[
                { required: true, message: t("This field is required") },
                {
                  type: "email",
                  message: t("Please enter a valid email"),
                },
              ]}
            >
              <Input
                size="large"
                disabled={!toggleEmail}
                placeholder={t("Receiver Email")}
              />
            </Item>

            <Button
              block
              type="primary"
              htmlType="submit"
              loading={sendIsLoading}
              disabled={!toggleEmail || sendIsLoading}
            >
              {t("Send Email")}
            </Button>
          </Form>
        </div>
      </div>
    </Modal>
  );
}
