"use client";

import {
  Form,
  Table,
  Input,
  Select,
  Button,
  DatePicker,
  Typography,
} from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useEffect, useState, useCallback } from "react";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ViewIcon, PlusIcon, TrashIcon } from "@/assets/icons/actions";

import AddSparePartsItemModal from "@/modals/inventory/AddSparePartsItem";
import CreateEditSupplierModal from "@/modals/settings/CreateEditSupplier";
import PurchaseOrderDetailsModal from "@/modals/inventory/PurchaseOrderDetails";

import {
  useSyncDbQuery,
  useSparePartsHistory,
  useAddSparePartsPurchase,
} from "@/queries";
import { showTotal } from "@/utils";

const { Item, useForm, useWatch } = Form;
const { TextArea } = Input;
const { Title } = Typography;

function PartsForm({ form, onFinish }) {
  const t = useTranslations("spare-parts-purchase");
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  const { data: suppliers } = useSyncDbQuery("Supplier");
  const { data: invoiceTypes } = useSyncDbQuery("InvoiceType");

  return (
    <div className="py-5">
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{
          date: new dayjs(),
        }}
      >
        <Item
          name="date"
          label={t("Date")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <DatePicker
            placeholder={t("Date")}
            className="!w-full"
            size="large"
          />
        </Item>

        <Item
          name="inv_type"
          label={t("Invoice Type")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            size="large"
            placeholder={t("Invoice Type")}
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
            options={
              invoiceTypes?.data?.map(({ type }) => ({
                label: type,
                value: type,
              })) || []
            }
          />
        </Item>

        <div className="flex gap-4 items-start">
          <Item
            className="grow"
            name="supplier_name"
            label={t("Supplier")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              allowClear
              showSearch
              size="large"
              placeholder={t("Supplier Name")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              options={
                suppliers?.data?.map(({ name }) => ({
                  label: name,
                  value: name,
                })) || []
              }
            />
          </Item>
          <Button
            size="small"
            type="primary"
            className="mt-8"
            onClick={() => setIsSupplierModalOpen(true)}
          >
            <PlusIcon />
          </Button>
        </div>

        <Item
          name="inv_no"
          label={t("Invoice No")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Invoice No")} size="large" type="number" />
        </Item>

        <Item name="notes" label={t("Notes")}>
          <TextArea placeholder={t("Notes")} size="large" />
        </Item>
      </Form>

      <CreateEditSupplierModal
        onClose={() => setIsSupplierModalOpen(false)}
        open={isSupplierModalOpen}
        setResponse={useCallback(
          ({ name }) =>
            !!name &&
            setTimeout(() => form.setFieldValue("supplier_name", name), 500),
          [form],
        )}
      />
    </div>
  );
}

export default function Page() {
  const [form] = useForm();
  const t = useTranslations("spare-parts-purchase");

  const [invoiceNo, setInvoiceNo] = useState();
  const supplierValue = useWatch("supplier_name", form);

  const { mutate: submitPurchase, data: response } = useAddSparePartsPurchase();

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: sparePartsHistory,
  } = useSparePartsHistory();
  const isLoading = isPending && !isSuccess && !isError;

  const [records, setRecords] = useState([]);
  const [addItemOpen, setAddItemOpen] = useState(false);

  const onClickSave = () => form.submit();

  const handleSubmit = () => {
    const formValues = form.getFieldsValue();

    const formData = new FormData();
    Object.keys(formValues).forEach((key) =>
      formData.append(key, formValues[key] || ""),
    );

    formData.set("date", dayjs(formValues.date).format("YYYY-MM-DD"));

    records.forEach((item, index) => {
      const { total_amount, quantity, item_code, item_name, agent_price } =
        item || {};

      formData.append(`item_data[${index}][]`, item_code);
      formData.append(`item_data[${index}][]`, item_name);
      formData.append(`item_data[${index}][]`, quantity);
      formData.append(`item_data[${index}][]`, agent_price);
      formData.append(`item_data[${index}][]`, total_amount);
      formData.append(`item_data[${index}][]`, quantity);
    });

    submitPurchase(formData);
  };

  useEffect(() => {
    if (supplierValue) {
      const formData = new FormData();
      formData.append("supplier", supplierValue);
      mutate(formData);
    }
  }, [mutate, supplierValue]);

  useEffect(() => {
    if (response) {
      const { msg } = response || {};
      if (msg) Swal.fire({ text: msg });
    }
  }, [response]);

  useEffect(() => {
    if (response) {
      const { success } = response || {};
      if (success) {
        form.resetFields();
        setRecords([]);
        reset();
      }
    }
  }, [form, reset, response]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center pb-4">
        <Title level={2}>{t("Spare Parts Purchase Form")}</Title>

        <div className="flex items-center gap-0.5">
          <Button
            type="primary"
            onClick={onClickSave}
            className="!bg-[#ffc107] !shadow-none"
          >
            <FontAwesomeIcon icon={faSave} className="!h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
        <div>
          <PartsForm form={form} onFinish={handleSubmit} />
        </div>

        <div>
          <Table
            bordered
            rowId="id"
            loading={isLoading}
            dataSource={sparePartsHistory || []}
            className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
            columns={[
              {
                key: "id",
                title: "ID",
                dataIndex: "id",
                sorter: (a, b) => Number(a.id) - Number(b.id),
              },
              {
                key: "inv_no",
                title: "Inv No",
                dataIndex: "inv_no",
                sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
              },
              {
                title: "Supplier",
                key: "supplier_name",
                dataIndex: "supplier_name",
                sorter: (a, b) =>
                  String(a.supplier_name).localeCompare(b.supplier_name),
              },
              {
                key: "total_qty",
                dataIndex: "total_qty",
                title: "Purchased Quantity",
                sorter: (a, b) => Number(a.total_qty) - Number(b.total_qty),
              },
              {
                key: "totalAmt",
                title: "Total Amount",
                dataIndex: "totalAmt",
                sorter: (a, b) => Number(a.totalAmt) - Number(b.totalAmt),
              },
              {
                key: "action",
                title: "Details",
                dataIndex: "action",
                render: (_, item) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<ViewIcon />}
                    onClick={() => setInvoiceNo(item?.inv_no || "")}
                  />
                ),
              },
            ].map((item) => ({
              ...item,
              title: t(item.title),
            }))}
            pagination={{
              pageSize: 5,
              hideOnSinglePage: true,
              pageSizeOptions: [10, 25, 50, 100],
              showTotal: (total, range) =>
                `Showing ${range[0]}-${range[1]} of ${total} data`,
            }}
          />
        </div>
      </div>

      <hr />

      <div className="flex justify-end items-center gap-2">
        <Button type="primary" onClick={() => setAddItemOpen(true)}>
          {t("Add Item")}
        </Button>
      </div>

      <Table
        bordered
        rowId="uuid"
        dataSource={records}
        className="mt-3 border-[#dfe0e1] overflow-x-auto max-w-full"
        columns={[
          {
            key: "item_code",
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            key: "item_name",
            title: "Item Name",
            dataIndex: "item_name",
            sorter: (a, b) => String(a.item_name).localeCompare(b.item_name),
          },
          {
            key: "quantity",
            title: "Quantity",
            dataIndex: "quantity",
            sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
          },
          {
            key: "agent_price",
            title: "Supplier Price",
            dataIndex: "agent_price",
            sorter: (a, b) => Number(a.agent_price) - Number(b.agent_price),
          },
          {
            key: "total_amount",
            title: "Total Amount",
            dataIndex: "total_amount",
            sorter: (a, b) => Number(a.total_amount) - Number(b.total_amount),
          },
          {
            key: "quantity",
            title: "Balance",
            dataIndex: "quantity",
            sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
          },
          {
            key: "action",
            title: "Delete",
            render: (_, item) => (
              <Button
                danger
                size="small"
                type="primary"
                icon={<TrashIcon />}
                onClick={() =>
                  setRecords((prev) =>
                    prev.filter((record) => record.uuid != item.uuid),
                  )
                }
              />
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      {records.length > 0 && (
        <div className="pt-4 flex items-center gap-2 text-2xl font-semibold">
          <div>{t("Total Amount:")} </div>
          <div>
            {records.reduceRight(
              (acc, item) => acc + Number(item.total_amount),
              0,
            )}
          </div>
        </div>
      )}

      <AddSparePartsItemModal
        open={addItemOpen}
        onClose={() => setAddItemOpen(false)}
        onSubmit={(item) => setRecords((prev) => [...prev, item])}
      />

      <PurchaseOrderDetailsModal
        open={!!invoiceNo}
        invoiceNo={invoiceNo}
        onClose={() => setInvoiceNo(null)}
      />
    </div>
  );
}
