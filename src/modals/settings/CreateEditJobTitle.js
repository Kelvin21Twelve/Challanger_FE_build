"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditJobTitle({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: jobTitle } = useSyncDbQuery("JobTitle");
  const {
    isLoading,
    isSuccess,
    mutate,
    reset,
    data: response,
  } = useCommonInsertUpdate("job_title", "JobTitle");

  const isEdit = !!data;
  const handleFinish = (values) => mutate(values);

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) form.setFieldsValue(data);
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Job Title") : t("Create Job Title")}
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
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Item name="id" hidden />
        <Item
          name="job_title"
          label={t("Job Title")}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Job Title is already exist"),
              validator: (_, value) => {
                const fieldValue = String(value).trim().toLowerCase();
                const isExist = jobTitle?.data?.some(
                  (item) =>
                    String(item?.job_title)
                      .toLowerCase()
                      .localeCompare?.(fieldValue) === 0,
                );

                let flag = true;
                if (isEdit && data?.job_title) {
                  const condition =
                    String(data?.job_title)
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
          <Input size="large" placeholder={t("Job Title")} />
        </Item>
      </Form>
    </Modal>
  );
}
