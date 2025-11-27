"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Modal, Table } from "antd";

import { SearchBar } from "@/components/SearchBar";

import { useTableSearch } from "@/utils";
import { useOrderHistory, usePrintInvoiceDetails } from "@/queries";

import { PrintIcon } from "@/assets/icons";

function PurchaseDetailsTable({ t, data, invoiceNo, isLoading }) {
  const { order, total_amt } = data || {};

  const { mutate } = usePrintInvoiceDetails(invoiceNo);

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "inv_no",
      "inv_type",
      "supplier_name",
      "item_code",
      "item_name",
      "purchase_qty",
      "total_amt",
    ]);

  useEffect(() => {
    setRecords(order || []);
  }, [data, order, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3 pb-4 justify-between">
        <div className="text-2xl font-medium">{t("Purchase Details")}</div>
        <div className="flex items-center gap-4">
          <div>
            <SearchBar
              isSearchLoading={isSearchLoading}
              setQueryValue={setQueryValue}
            />
          </div>

          <div>
            <Button
              size="small"
              type="primary"
              onClick={() => mutate()}
              className="[&_svg]:w-5"
            >
              <PrintIcon />
            </Button>
          </div>
        </div>
      </div>

      <Table
        className="max-w-full overflow-x-auto"
        dataSource={filteredData}
        loading={isLoading}
        columns={[
          {
            key: "inv_no",
            title: "Inv No",
            dataIndex: "inv_no",
          },
          {
            key: "inv_type",
            title: "Invoice Type",
            dataIndex: "inv_type",
          },
          {
            key: "supplier_name",
            title: "Supplier Name",
            dataIndex: "supplier_name",
          },
          {
            key: "item_code",
            title: "Item Code",
            dataIndex: "item_code",
          },
          {
            key: "item_name",
            title: "Item Name",
            dataIndex: "item_name",
          },
          {
            key: "purchase_qty",
            title: "Quantity",
            dataIndex: "purchase_qty",
          },
          {
            key: "total_amt",
            title: "Total Amount",
            dataIndex: "total_amt",
          },
          {
            key: "date",
            title: "Date",
            dataIndex: "date",
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
      />

      <div className="mt-2 text-xl font-medium">
        {t("Total Amount:")}
        {total_amt}
      </div>
    </div>
  );
}

function ReturnDetailsTable({ t, data, isLoading }) {
  const { return: returnData } = data || {};

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["inv_no", "item_code", "item", "quantity", "date"]);

  useEffect(() => {
    setRecords(returnData || []);
  }, [returnData, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap items-start gap-3 pb-4 justify-between">
        <div className="text-2xl font-medium">{t("Return Details")}</div>
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        className="max-w-full overflow-x-auto"
        dataSource={filteredData || []}
        loading={isLoading}
        columns={[
          {
            key: "inv_no",
            title: "Inv No",
            dataIndex: "inv_no",
          },
          {
            key: "item_code",
            title: "Item Code",
            dataIndex: "item_code",
          },
          {
            key: "item",
            dataIndex: "item",
            title: "Item Name",
          },
          {
            key: "quantity",
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            key: "date",
            title: "Date",
            dataIndex: "date",
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
      />
    </div>
  );
}

export default function PurchaseOrderDetails({ open, onClose, invoiceNo }) {
  const t = useTranslations("modals");
  const { data, isLoading } = useOrderHistory(invoiceNo);

  const handleClose = () => onClose();

  return (
    <Modal
      open={open}
      footer={null}
      width={{ lg: "70%" }}
      title={t("Order Details")}
      onCancel={handleClose}
    >
      <PurchaseDetailsTable
        t={t}
        data={data}
        invoiceNo={invoiceNo}
        isLoading={isLoading}
      />

      <hr />

      <ReturnDetailsTable
        t={t}
        data={data}
        invoiceNo={invoiceNo}
        isLoading={isLoading}
      />
    </Modal>
  );
}
