"use client";

import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Modal, Form, Select, Input, Radio } from "antd";

import { handle422Errors } from "@/utils";
import { useCreateEditSystemUser, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function CreateEditUsers({ open, onClose, data, onRefetch }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data: user } = useSyncDbQuery("User");
  const { data: roleData } = useSyncDbQuery("Role");

  const {
    data: response,
    isPending,
    isError,
    mutate,
    reset,
  } = useCreateEditSystemUser();

  const isEdit = !!data;
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

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
    if (isSuccess) {
      onRefetch();
      handleClose();
    }
  }, [handleClose, isSuccess, onRefetch]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    if (response?.msg) Swal.fire({ text: response?.msg });
  }, [response]);

  return (
    <Modal
      title={isEdit ? t("Edit Users") : t("Create Users")}
      onCancel={handleClose}
      width={1000}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Item name="id" hidden />

          <Item
            name="name"
            label={t("Name")}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Name is already exist"),
                validator: (_, value) => {
                  const fieldValue = String(value).trim().toLowerCase();
                  const isExist = user?.data?.some(
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
            <Input size="large" placeholder={t("Name")} />
          </Item>

          <Item
            name="max_desc"
            label={t("Discount")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              min={0}
              step={0.01}
              size="large"
              type="number"
              placeholder={t("Discount")}
              onKeyDown={(e) =>
                ["+", "-", "e"].includes(e.key) && e.preventDefault()
              }
            />
          </Item>

          <Item
            name="email"
            label={t("Email")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input size="large" placeholder={t("Email")} />
          </Item>

          <Item
            name="department"
            label={t("Department")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Department")}
              options={roleData?.data?.map(({ id, name }) => ({
                label: name,
                value: String(id),
              }))}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item name="password" label={t("Password")}>
            <Input size="large" placeholder={t("Password")} type="password" />
          </Item>

          <Item name="acc_code" label={t("Acc Code")}>
            <Input size="large" placeholder={t("Acc Code")} />
          </Item>

          <Item name="Confirm_password" label={t("Confirm Password")}>
            <Input
              size="large"
              type="password"
              placeholder={t("Confirm Password")}
            />
          </Item>

          <Item name="is_active" label={t("Active")} layout="horizontal">
            <Radio.Group>
              <Radio value={1}>{t("Yes")}</Radio>
              <Radio value={0}>{t("No")}</Radio>
            </Radio.Group>
          </Item>
        </div>
      </Form>
    </Modal>
  );
}
