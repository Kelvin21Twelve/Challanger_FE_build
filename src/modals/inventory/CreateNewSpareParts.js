"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Form, Select } from "antd";

import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

import CreateEditBrandModal from "@/modals/settings/CreateEditBrand";
import CreateEditSupplierModal from "@/modals/settings/CreateEditSupplier";

const { Item, useForm } = Form;

export default function CreateNewSparePartsModal({ open, onClose, data }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const { data: brandData } = useSyncDbQuery("Brand");
  const { data: supplierData } = useSyncDbQuery("Supplier");
  const { data: newSparePartsData } = useSyncDbQuery("NewSpareParts");
  const {
    data: response,
    isPending,
    isSuccess,
    isError,
    mutate,
    reset,
  } = useCommonInsertUpdate("new_parts", "NewSpareParts");

  const isEdit = !!data;
  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  useEffect(() => {
    if (data) {
      const item = newSparePartsData?.data?.find(({ id }) => id == data.id);
      if (item) form.setFieldsValue(item);
    }
  }, [data, form, newSparePartsData]);

  useEffect(() => {
    if (isSuccess) handleClose();
  }, [handleClose, isSuccess]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  return (
    <Modal
      title={!isEdit ? t("Create New Spare Parts") : t("Edit New Spare Parts")}
      onCancel={handleClose}
      width={{ lg: "70%" }}
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
      <Form
        form={form}
        layout="vertical"
        onFinish={mutate}
        className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0"
      >
        <Item name="id" hidden />
        <Item
          name="item_code"
          label={t("Item Code")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Item Code")} />
        </Item>

        <Item
          name="sale_price"
          label={t("Sales Price")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Sales Price")}
            type="number"
            size="large"
            step={0.01}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="item_name"
          label={t("Item Name")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input size="large" placeholder={t("Item Name")} />
        </Item>

        <Item
          name="balance"
          label={t("Balance")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Balance")}
            type="number"
            size="large"
            step={1}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="item_unit"
          label={t("Item Unit")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            showSearch
            size="large"
            placeholder={t("Item Unit")}
            options={[
              { label: t("Pcs"), value: "Pcs" },
              { label: t("Litre"), value: "Litre" },
              { label: t("Carton"), value: "Carton" },
            ]}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item
          name="avg_cost"
          label={t("Average Cost")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Average Cost")}
            type="number"
            size="large"
            step={0.01}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <div className="flex items-start gap-2">
          <Item
            name="brand"
            className="grow"
            label={t("Brand")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Brand")}
              options={
                brandData?.data?.map(({ brand_name, id }) => ({
                  label: brand_name,
                  value: String(id),
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Button
            type="primary"
            className="mt-8"
            onClick={() => setIsBrandModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>

        <Item
          name="min_limit"
          label={t("Min Limit")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            placeholder={t("Min Limit")}
            type="number"
            size="large"
            step={1}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e", "."].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <Item
          name="agent_price"
          label={t("Supplier Price")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input
            size="large"
            placeholder={t("Supplier Price")}
            type="number"
            step={0.01}
            min={0}
            onKeyDown={(e) =>
              ["+", "-", "e"].includes(e.key) && e.preventDefault()
            }
          />
        </Item>

        <div className="flex items-start gap-2">
          <Item
            name="supplier"
            className="grow"
            label={t("Supplier")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              size="large"
              placeholder={t("Supplier")}
              options={
                supplierData?.data?.map(({ name, id }) => ({
                  label: name,
                  value: String(id),
                })) || []
              }
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Button
            type="primary"
            className="mt-8"
            onClick={() => setIsSupplierModalOpen(true)}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>
      </Form>

      <CreateEditBrandModal
        open={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        setResponse={useCallback(
          ({ id }) =>
            !!id &&
            setTimeout(() => form.setFieldValue("brand", String(id)), 500),
          [form],
        )}
      />

      <CreateEditSupplierModal
        open={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        setResponse={useCallback(
          ({ id }) =>
            !!id &&
            setTimeout(() => form.setFieldValue("supplier", String(id)), 500),
          [form],
        )}
      />
    </Modal>
  );
}
