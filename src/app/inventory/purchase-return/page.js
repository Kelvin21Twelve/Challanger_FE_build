"use client";

import Swal from "sweetalert2";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";

import ReturnPurchaseFormModal from "@/modals/inventory/ReturnPurchaseForm";
import SparePartsPurchaseReturnEditModal from "@/modals/inventory/SparePartsPurchaseReturnEdit";

import { showTotal } from "@/utils";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("purchase-return");

  const [records, setRecords] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [returnItemData, setReturnItemData] = useState(null);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Return Purchase Form")}</Title>

        <div className="flex items-center gap-0.5">
          <Button
            type="primary"
            onClick={() => setIsFormOpen(true)}
            className="!bg-[#6c757d] !rounded-none"
          >
            {t("Purchase Return Form")}
          </Button>
        </div>
      </div>

      <Table
        bordered
        rowKey="id"
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            title: "Inv No",
            dataIndex: "inv_no",
            sorter: (a, b) => String(a.inv_no).localeCompare(b.inv_no),
          },
          {
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            title: "Price",
            dataIndex: "total_amt",
            sorter: (a, b) => Number(a.total_amt) - Number(b.total_amt),
          },
          {
            title: "Quantity",
            dataIndex: "purchase_qty",
            sorter: (a, b) => Number(a.purchase_qty) - Number(b.purchase_qty),
          },
          {
            title: "Return",
            dataIndex: "id",
            render: (_, item) => (
              <Button
                danger
                size="small"
                type="primary"
                onClick={() => setReturnItemData(item)}
              >
                {t("Return")}
              </Button>
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={records}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <ReturnPurchaseFormModal
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onAddPurchase={(item) => setRecords([...records, item])}
      />

      <SparePartsPurchaseReturnEditModal
        data={returnItemData}
        open={!!returnItemData}
        onClose={() => setReturnItemData(null)}
        onRemove={(data) => {
          setRecords((prev) => prev.filter((item) => item.id != data.id));
          Swal.fire({
            title: t("Success"),
            text: t("Purchased Item is removed!"),
          });
        }}
      />
    </div>
  );
}
