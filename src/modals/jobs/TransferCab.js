"use client";

import { useTranslations } from "next-intl";
import { Button, Select, Modal, Form } from "antd";
import { useCallback, useEffect, useContext } from "react";

import { useTransferCab, useGetCab } from "@/queries";

import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

const { Item, useForm } = Form;

export default function TransferCab({ open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const [, dispatch] = useContext(ModelContext);

  const {
    data: toCabs,
    refetch: toRefetch,
    isLoading: toCabsLoading,
  } = useGetCab("");
  const {
    data: fromCabs,
    refetch: fromRefetch,
    isLoading: fromCabLoading,
  } = useGetCab("1");

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useTransferCab();
  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
    reset();
  }, [form, onClose, reset]);

  useEffect(() => {
    const { success } = response || {};
    if (success) {
      dispatch({ type: ACTIONS.refetchJobCardList, payload: true });
      setTimeout(
        () => dispatch({ type: ACTIONS.refetchJobCardList, payload: false }),
        0,
      );
      handleClose();
    }
  }, [dispatch, handleClose, response]);

  useEffect(() => {
    if (open) {
      toRefetch();
      fromRefetch();
    }
  }, [fromRefetch, open, toRefetch]);

  return (
    <Modal
      title={t("Transfer Cab")}
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
          {t("Transfer")}
        </Button>,
        <Button key="search" type="primary" danger onClick={onClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={mutate}>
        <Item
          name="from_cab"
          label={t("From Cab")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            loading={fromCabLoading}
            placeholder={t("From Cab")}
            options={
              fromCabs?.map((item) => ({
                value: item.cab_no,
                label: item.cab_no,
              })) || []
            }
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item
          name="to_cab"
          label={t("To Cab")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            loading={toCabsLoading}
            placeholder={t("To Cab")}
            options={
              toCabs?.map((item) => ({
                value: item.cab_no,
                label: item.cab_no,
              })) || []
            }
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>
      </Form>
    </Modal>
  );
}
