"use client";

import Swal from "sweetalert2";
import { Button, Modal, Form } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";

import { useUploadSparePartsData } from "@/queries";

const { Item, useForm } = Form;

export default function SparePartsUploadModal({ open, onClose }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const [file, setFile] = useState(false);

  const { isError, isPending, reset, mutate, data } = useUploadSparePartsData();
  const isSuccess = !!data?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = () => {
    if (file?.length === 0 || !file) {
      form.setFields([
        {
          name: "file",
          errors: [t("Please choose a file")],
        },
      ]);
      return;
    } else {
      form.setFields([
        {
          name: "file",
          errors: [],
        },
      ]);
    }

    const formData = new FormData();
    formData.set("file", file[0]);
    mutate(formData);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (isSuccess) {
      Swal.fire({
        title: t("Success"),
        text: t("File imported successfully"),
      });

      handleClose();
    }
  }, [handleClose, isSuccess, t]);

  useEffect(() => {
    if (isError) {
      Swal.fire({
        title: t("Info!"),
        text: t("Please upload a valid file"),
      });
    }
  }, [isError, t]);

  return (
    <Modal
      title={t("Upload File")}
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
        <Item name="file" label={t("Choose File")}>
          <label htmlFor="file-upload">
            <span className="hidden">{t("Choose File")}</span>
            <input
              type="file"
              id="file-upload"
              onChange={(e) => setFile(e.target.files)}
              className="border px-2 py-1 shadow-none rounded border-[#d9d9d9] ring-0"
            />
          </label>
        </Item>

        <a target="_blank" href={process.env.NEXT_PUBLIC_EXCEL_URL}>
          {t("Click here to download the sample file")}
        </a>
      </Form>
    </Modal>
  );
}
