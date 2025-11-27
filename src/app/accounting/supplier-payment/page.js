"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";

import SparePartsPaymentsModal from "@/modals/accounts/SparePartsPayment";

import { useTableSearch, showTotal } from "@/utils";
import { useSupplierPayments } from "@/queries";

import { SearchBar } from "@/components/SearchBar";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("supplier-payment");
  const { data, isLoading, refetch } = useSupplierPayments();
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "inv_no",
      "inv_type",
      "item_code",
      "total_amt",
      "purchase_qty",
      "remaining_amt",
      "supplier_name",
    ]);

  const [modelData, setModelData] = useState(null);
  const [isOpenForm, setIsOpenForm] = useState(false);

  useEffect(() => {
    setRecords(data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Supplier Payment")}</Title>

        <div className="flex items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />
        </div>
      </div>

      <Table
        bordered
        rowId="id"
        rowKey="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] overflow-x-auto max-w-full"
        columns={[
          {
            title: "Invoice No",
            dataIndex: "inv_no",
            sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
          },
          {
            title: "Supplier Name",
            dataIndex: "supplier_name",
            sorter: (a, b) =>
              String(a.supplier_name).localeCompare(b.supplier_name),
          },
          {
            title: "Invoice Type",
            dataIndex: "inv_type",
            sorter: (a, b) => String(a.inv_type).localeCompare(b.inv_type),
          },
          {
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            title: "Total Amount",
            dataIndex: "total_amt",
            sorter: (a, b) => Number(a.total_amt) - Number(b.total_amt),
          },
          {
            title: "Balance Amount",
            dataIndex: "remaining_amt",
            sorter: (a, b) => Number(a.remaining_amt) - Number(b.remaining_amt),
          },
          {
            title: "Quantity",
            dataIndex: "purchase_qty",
            sorter: (a, b) => Number(a.purchase_qty) - Number(b.purchase_qty),
          },
          {
            key: "edit",
            title: "Action",
            dataIndex: "edit",
            render: (_, item) =>
              item?.status === "pending" && (
                <Button
                  size="small"
                  type="primary"
                  onClick={() => {
                    setModelData(item);
                    setIsOpenForm(true);
                  }}
                >
                  {t("Pay")}
                </Button>
              ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <SparePartsPaymentsModal
        data={modelData}
        open={isOpenForm}
        onRefetch={refetch}
        onClose={() => {
          setModelData(null);
          setIsOpenForm(false);
        }}
      />
    </div>
  );
}
