"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input } from "antd";

import { useSearchCabMutation, useSyncDbQuery } from "@/queries";

import { SearchIcon } from "@/assets/icons";

const { Item, useForm } = Form;

export default function CreateEditMake({ open, onClose, onSetCustomerIds }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data, isLoading: customerLoading } = useSyncDbQuery("Customer");
  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: searchResponse,
  } = useSearchCabMutation();

  const customers = data?.data || [];
  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = (values) => mutate(values);

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (searchResponse?.success) {
      const { result_new_ids_arr } = searchResponse;
      if (result_new_ids_arr) onSetCustomerIds(result_new_ids_arr);
      handleClose();
    }
  }, [handleClose, onSetCustomerIds, searchResponse]);

  return (
    <Modal
      open={open}
      title={t("Cab Search")}
      onCancel={handleClose}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          disabled={isLoading}
          onClick={() => form.submit()}
        >
          <span className="[&_svg]:w-4.5">
            <SearchIcon />
          </span>
          <span>{t("Search")}</span>
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Item name="customer_search" label={t("Customer")}>
          <Select
            showSearch
            size="large"
            loading={customerLoading}
            placeholder={t("Customer")}
            options={customers.map((item) => ({
              value: item.id,
              label: item.cust_name,
            }))}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item name="phone_search" label={t("Phone")}>
          <Input size="large" placeholder={t("Phone")} />
        </Item>

        <Item name="plate_no_search" label={t("Plate No")}>
          <Input size="large" placeholder={t("Plate No")} />
        </Item>
      </Form>
    </Modal>
  );
}
