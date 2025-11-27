"use client";

import dayjs from "dayjs";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Input, Modal, Form, Table, DatePicker } from "antd";

import { SearchBar } from "@/components/SearchBar";

import { useTableSearch } from "@/utils";
import { useSearchSparePartsSold } from "@/queries";

const { Item, useForm } = Form;

export default function SparePartsSalesSearchFormModal({
  open,
  onClose,
  onAddItem,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const { mutate, reset, data } = useSearchSparePartsSold();

  const { filteredData, isSearchLoading, setQueryValue, setRecords } =
    useTableSearch(["job_id", "item", "created_at", "type", "price"]);

  const handleFinish = (values) => {
    const { InvNo, date1, date2 } = values || {};

    const formData = new FormData();
    if (InvNo) formData.append("InvNo", InvNo);
    formData.append("date1", dayjs(date1).format("YYYY-MM-DD"));
    formData.append("date2", dayjs(date2).format("YYYY-MM-DD"));
    mutate(formData);
  };

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
      title={t("Spare Parts Sales Search Form")}
      onCancel={handleClose}
      footer={null}
      open={open}
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0">
          <Item
            name="date1"
            label={t("From Date")}
            rules={[{ required: true, message: t("This field is required") }]}
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
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("To Date")}
            />
          </Item>

          <Item name="InvNo" label={t("Job ID")}>
            <Input size="large" placeholder={t("Job ID")} className="w-full" />
          </Item>
        </div>

        <hr />

        <div className="flex justify-end gap-2">
          <Button type="primary" htmlType="submit">
            {t("Submit")}
          </Button>
          <Button type="primary" danger onClick={handleClose}>
            {t("Close")}
          </Button>
        </div>
      </Form>

      <div className="mt-8">
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        bordered
        rowId="id"
        size="small"
        className="border-[#dfe0e1] mt-3 max-w-full overflow-x-auto"
        columns={[
          {
            key: "job_id",
            title: "Job ID",
            dataIndex: "job_id",
            sorter: (a, b) => String(a.job_id).localeCompare(b.job_id),
          },
          {
            key: "item",
            title: "Name",
            dataIndex: "item",
            render: (_, item) => item?.item_name || item.item || "-",
            sorter: (a, b) => String(a.item).localeCompare(b.item),
          },
          {
            title: "Date",
            key: "created_at",
            dataIndex: "created_at",
            sorter: (a, b) => String(a.created_at).localeCompare(b.created_at),
          },
          {
            key: "type",
            title: "Type",
            dataIndex: "type",
            render: () => "Job Card",
            sorter: (a, b) => String(a.type).localeCompare(b.type),
          },
          {
            key: "price",
            title: "Total",
            dataIndex: "price",
            sorter: (a, b) => String(a.price).localeCompare(b.price),
          },
          {
            width: 100,
            key: "edit",
            title: "Add",
            dataIndex: "edit",
            render: (_, item) => (
              <Button
                type="primary"
                size="small"
                onClick={() => {
                  onAddItem(item);
                  handleClose();
                }}
              >
                {t("Add")}
              </Button>
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={filteredData}
        pagination={{
          pageSize: 5,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal: (total, range) =>
            `Showing ${range[0]}-${range[1]} of ${total} data`,
        }}
      />
    </Modal>
  );
}
