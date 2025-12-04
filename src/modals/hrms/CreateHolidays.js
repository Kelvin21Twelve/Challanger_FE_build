"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Input, Modal, Form, DatePicker } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate } from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function CreateEditHolidays({ open, onClose, data }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const {
    data: response,
    isSuccess,
    isLoading,
    mutate,
    reset,
  } = useCommonInsertUpdate("holyday", "Holyday");

  const isEdit = !!data;

  const handleFinish = (values) => {
    const payload = {
      ...values,
      end_date: dayjs(values?.end_date).format("YYYY-MM-DD"),
      start_date: dayjs(values?.start_date).format("YYYY-MM-DD"),
      resume_date: dayjs(values?.resume_date).format("YYYY-MM-DD"),
    };

    mutate(payload);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data)
      form.setFieldsValue({
        ...data,
        end_date: dayjs(data?.end_date),
        start_date: dayjs(data?.start_date),
        resume_date: dayjs(data?.resume_date),
      });
  }, [data, form]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={isEdit ? t("Edit Holiday") : t("Create Holiday")}
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
          name="start_date"
          label={t("Start Date")}
          dependencies={["end_date"]}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Date range is invalid"),
              validator: (_, startDate) => {
                let endDate = form.getFieldValue("end_date");

                if (!!startDate && !!endDate) {
                  const endDate2 = endDate.format("YYYY-MM-DD");
                  const startDate2 = startDate.format("YYYY-MM-DD");

                  const isSame = dayjs(startDate2).isSame(endDate2);
                  const isAfter = dayjs(startDate2).isAfter(endDate2);

                  if (isAfter || isSame) return Promise.reject(new Error(""));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker placeholder={t("Start Date")} className="w-full" />
        </Item>

        <Item
          name="end_date"
          label={t("End Date")}
          dependencies={["start_date"]}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Date range is invalid"),
              validator: (_, endDate) => {
                let startDate = form.getFieldValue("start_date");

                if (!!startDate && !!endDate) {
                  const endDate2 = endDate.format("YYYY-MM-DD");
                  const startDate2 = startDate.format("YYYY-MM-DD");

                  const isSame = dayjs(startDate2).isSame(endDate2);
                  const isAfter = dayjs(startDate2).isAfter(endDate2);

                  if (isAfter || isSame) return Promise.reject(new Error(""));
                }

                return Promise.resolve();
              },
            },
            {
              message: t("Date range is invalid"),
              validator: (_, startDate) => {
                let endDate = form.getFieldValue("resume_date");

                if (!!startDate && !!endDate) {
                  const endDate2 = endDate.format("YYYY-MM-DD");
                  const startDate2 = startDate.format("YYYY-MM-DD");

                  const isSame = dayjs(startDate2).isSame(endDate2);
                  const isAfter = dayjs(startDate2).isAfter(endDate2);

                  if (isAfter || isSame) return Promise.reject(new Error(""));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker placeholder={t("End Date")} className="w-full" />
        </Item>

        <Item
          name="resume_date"
          label={t("Resume Date")}
          dependencies={["end_date", "resume_date"]}
          rules={[
            { required: true, message: t("This field is required") },
            {
              message: t("Date range is invalid"),
              validator: (_, endDate) => {
                let startDate = form.getFieldValue("end_date");

                if (!!startDate && !!endDate) {
                  const endDate2 = endDate.format("YYYY-MM-DD");
                  const startDate2 = startDate.format("YYYY-MM-DD");

                  const isSame = dayjs(startDate2).isSame(endDate2);
                  const isAfter = dayjs(startDate2).isAfter(endDate2);

                  if (isAfter || isSame) return Promise.reject(new Error(""));
                }

                return Promise.resolve();
              },
            },
          ]}
        >
          <DatePicker placeholder={t("Resume Date")} className="w-full" />
        </Item>

        <Item
          name="description"
          label={t("Description")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <TextArea placeholder={t("Description")} className="w-full" />
        </Item>
      </Form>
    </Modal>
  );
}
