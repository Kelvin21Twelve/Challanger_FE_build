"use client";

import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Modal, Form, Table, DatePicker } from "antd";

import { SearchBar } from "@/components/SearchBar";

import { useTableSearch } from "@/utils";
import { useSparePartsReturn } from "@/queries";

const { Item, useForm } = Form;

function SearchForm({ t, form, mutate, isLoading, handleClose }) {
  const handleFinish = (values) => {
    const payload = {
      ...values,
      date1: dayjs(values?.date1).format("YYYY-MM-DD"),
      date2: dayjs(values?.date2).format("YYYY-MM-DD"),
    };

    const form = new FormData();
    Object.keys(payload).forEach(
      (key) => payload[key] && form.append(key, payload[key]),
    );

    mutate(form);
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
        <Item
          name="date1"
          label={t("From Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker
            size="large"
            placeholder={t("From Date")}
            className="w-full"
          />
        </Item>

        <Item
          name="date2"
          label={t("To Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker
            size="large"
            className="w-full"
            placeholder={t("To Date")}
          />
        </Item>

        <Item name="InvNo" label={t("Inv No")}>
          <Input size="large" placeholder={t("Inv No")} className="w-full" />
        </Item>
      </div>

      <hr />

      <div className="flex justify-end gap-2">
        <Button
          type="primary"
          htmlType="submit"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("Submit")}
        </Button>
        <Button type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>
      </div>
    </Form>
  );
}

export default function SparePartsReturnFormModal({ open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();
  const { mutate, data, reset, isPending, isSuccess, isError } =
    useSparePartsReturn();
  const isLoading = isPending && !isSuccess && !isError;

  const { filteredData, isSearchLoading, setQueryValue, setRecords } =
    useTableSearch(["inv_no", "item_code", "item", "quantity", "created_at"]);

  const handleClose = () => {
    form.resetFields();
    reset();
    onClose();
  };

  useEffect(() => {
    if (data) setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <Modal
      title={t("Spare Parts Return Form")}
      onCancel={handleClose}
      footer={null}
      open={open}
    >
      <SearchForm
        t={t}
        form={form}
        mutate={mutate}
        isLoading={isLoading}
        handleClose={handleClose}
      />

      <div className="mt-6">
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="border-[#dfe0e1] mt-3 max-w-full overflow-x-auto"
        columns={[
          {
            key: "inv_no",
            title: t("Inv No"),
            dataIndex: "inv_no",
            sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
          },
          {
            key: "item_code",
            title: t("Item Code"),
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            key: "item",
            title: t("Name"),
            dataIndex: "item",
            sorter: (a, b) => String(a.item).localeCompare(b.item),
          },
          {
            key: "quantity",
            title: t("Quantity"),
            dataIndex: "quantity",
            sorter: (a, b) => String(a.quantity).localeCompare(b.quantity),
          },
          {
            title: t("Date"),
            key: "created_at",
            dataIndex: "created_at",
            sorter: (a, b) => String(a.created_at).localeCompare(b.created_at),
          },
        ]}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} data`,
        }}
      />
    </Modal>
  );
}
