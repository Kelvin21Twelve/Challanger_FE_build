"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Modal, Form, Select, DatePicker, Table } from "antd";

import { useTableSearch } from "@/utils";
import { useSearchSparePartsPurchased, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";

import SparePartsPurchaseDetailsModal from "./SparePartsPurchaseDetails";

const { Item, useForm } = Form;

function SearchFrom({ t, mutate, form, handleClose }) {
  const { data: supplier, isLoading: supplierLoading } =
    useSyncDbQuery("Supplier");

  const handleFinish = (values) => {
    const payload = {
      ...values,
      date1: values?.date1.format("YYYY-MM-DD"),
      date2: values?.date2.format("YYYY-MM-DD"),
    };

    mutate(payload);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
        <Item
          label={t("Supplier")}
          name="supp_name"
          rules={[{ required: true, message: "This field is required" }]}
        >
          <Select
            showSearch
            size="large"
            placeholder={t("Supplier")}
            loading={supplierLoading}
            options={
              supplier?.data?.map(({ name }) => ({
                label: name,
                value: name,
              })) || []
            }
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item name="InvNo" label={t("Invoice No")}>
          <Input size="large" placeholder={t("Invoice No")} />
        </Item>

        <Item
          name="date1"
          label={t("From Date")}
          rules={[{ required: true, message: "This field is required" }]}
        >
          <DatePicker
            size="large"
            className="w-full"
            placeholder={t("From Date")}
          />
        </Item>

        <Item
          name="date2"
          label={t("To Date")}
          rules={[{ required: true, message: "This field is required" }]}
        >
          <DatePicker
            size="large"
            className="w-full"
            placeholder={t("To Date")}
          />
        </Item>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="primary" htmlType="submit">
          {t("Submit")}
        </Button>
        <Button type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>
      </div>
    </Form>
  );
}

export default function ReturnPurchaseFormModal({
  open,
  onClose,
  onAddPurchase,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const [viewData, setViewData] = useState(null);

  const { filteredData, isSearchLoading, setQueryValue, setRecords } =
    useTableSearch([
      "supplier_name",
      "created_at",
      "item_code",
      "total_amt",
      "inv_no",
    ]);

  const { mutate, reset, data, isSuccess, isError, isPending } =
    useSearchSparePartsPurchased();
  const isLoading = isPending && !isSuccess && !isError;

  const handleClose = () => {
    form.resetFields();
    reset();
    onClose();
  };

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <Modal
      title={t("Spare Parts Purchase Return Search Form")}
      onCancel={handleClose}
      footer={null}
      open={open}
    >
      <SearchFrom t={t} mutate={mutate} form={form} handleClose={handleClose} />

      <hr />

      <SearchBar
        setQueryValue={setQueryValue}
        isSearchLoading={isSearchLoading}
      />

      <Table
        rowId="id"
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        dataSource={filteredData}
        loading={isLoading}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} data`,
        }}
        bordered
        columns={[
          {
            key: "inv_no",
            title: "Invoice No",
            dataIndex: "inv_no",
            sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
          },
          {
            key: "supplier_name",
            title: "Name",
            dataIndex: "supplier_name",
            sorter: (a, b) =>
              String(a.supplier_name).localeCompare(b.supplier_name),
          },
          {
            key: "item_code",
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            title: "Date",
            key: "created_at",
            dataIndex: "created_at",
            sorter: (a, b) => String(a.created_at).localeCompare(b.created_at),
          },
          {
            title: "Total",
            key: "total_amt",
            dataIndex: "total_amt",
            sorter: (a, b) => Number(a.total_amt) - Number(b.total_amt),
          },
          {
            key: "inv_no",
            title: "View",
            dataIndex: "inv_no",
            sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
            render: (_, item) => (
              <Button
                onClick={() => setViewData(item)}
                type="primary"
                size="small"
              >
                {t("View")}
              </Button>
            ),
          },
          {
            key: "id",
            title: "Add",
            dataIndex: "id",
            render: (_, item) => {
              const { status, purchase_qty = 0, returned_qty = 0 } = item || {};

              const condition =
                status !== "pending" &&
                Number(purchase_qty) > Number(returned_qty);

              return condition ? (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    onAddPurchase(item);
                    handleClose();
                  }}
                >
                  {t("Add")}
                </Button>
              ) : null;
            },
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
      />

      <SparePartsPurchaseDetailsModal
        data={viewData}
        open={!!viewData}
        onClose={() => setViewData(null)}
      />
    </Modal>
  );
}
