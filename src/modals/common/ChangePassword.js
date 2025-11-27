"use client";

import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useChangePassword } from "@/queries";

const { Item, useForm } = Form;

export default function ChangePassword({ open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useChangePassword();

  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleSubmit = useCallback(() => {
    reset();
    mutate(form.getFieldsValue());
  }, [form, mutate, reset]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    const { success, msg } = response || {};
    if (success) {
      Swal.fire({ text: msg });
      handleClose();
    }
  }, [handleClose, response]);

  return (
    <Modal
      title={t("Change Password")}
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Item
          name="user_old_password"
          label={t("Old Password")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" type="password" placeholder={t("Old Password")} />
        </Item>
        <Item
          name="user_new_password"
          label={t("New Password")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("New password must be at least six characters long"),
              validator: (_, value) =>
                String(value).length < 6
                  ? Promise.reject(new Error(""))
                  : Promise.resolve(),
            },
          ]}
        >
          <Input size="large" type="password" placeholder={t("New Password")} />
        </Item>
        <Item
          name="user_confirm_password"
          label={t("Confirm New Password")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Confirm password does not match"),
              validator: (_, value) => {
                const newPass = form.getFieldValue("user_new_password");
                if (String(newPass).localeCompare(String(value)) === 0)
                  return Promise.resolve();
                return Promise.reject(new Error(""));
              },
            },
          ]}
        >
          <Input
            size="large"
            type="password"
            placeholder={t("Confirm New Password")}
          />
        </Item>
      </Form>
    </Modal>
  );
}
