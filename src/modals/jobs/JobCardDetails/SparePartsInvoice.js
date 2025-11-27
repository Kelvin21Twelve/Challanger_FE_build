import { Table, Button, Input } from "antd";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";

import { showConfirmBox } from "@/utils";
import { useGetSparePartsInvoices, useCommonDelete } from "@/queries";

import { updateCommonJobCardCalculation } from "./common";

import { TrashIcon } from "@/assets/icons/actions";

import FiledSet from "@/components/FiledSet";

export default function SparePartsInvoice({ jobId, onDelete }) {
  const queryClient = useQueryClient();
  const t = useTranslations("modals");
  const { data, isLoading } = useGetSparePartsInvoices(jobId || "");
  const { mutate, data: response } = useCommonDelete("CustomersNewSpareParts");

  const filteredData = data?.data || [];
  const total = filteredData.reduce((acc, item) => acc + item.total, 0);

  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) {
      queryClient.setQueryData(
        ["get-spare-parts-invoices", jobId],
        (oldData) => ({
          data: oldData?.data?.filter?.((item) => item.id != deleteId),
        }),
      );

      setDeleteId(null);
      onDelete();
    }
  }, [deleteId, jobId, onDelete, queryClient, response]);

  useEffect(() => {
    if (response?.success) {
      updateCommonJobCardCalculation(queryClient, response?.used_part_calc);
    }
  }, [queryClient, response]);

  return (
    <FiledSet label={t("Spare Parts Invoice")}>
      <div className="py-3">
        <div className="max-w-full overflow-x-auto">
          <Table
            bordered
            rowId="id"
            size="small"
            pagination={false}
            loading={isLoading}
            scroll={{ y: 222 }}
            dataSource={filteredData}
            className="border-[#dfe0e1] min-w-[800px]"
            columns={[
              {
                key: "item_code",
                title: "Item Code",
                dataIndex: "item_code",
                sorter: (a, b) =>
                  String(a.item_code).localeCompare(b.item_code),
              },
              {
                key: "item",
                title: "Item",
                dataIndex: "item",
                sorter: (a, b) => String(a.item).localeCompare(b.item),
              },
              {
                width: 110,
                key: "quantity",
                title: "Quantity",
                dataIndex: "quantity",
                sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
              },
              {
                width: 100,
                key: "price",
                title: "Price",
                dataIndex: "price",
                sorter: (a, b) => Number(a.price) - Number(b.price),
              },
              {
                width: 100,
                key: "total",
                title: "Total",
                dataIndex: "total",
                sorter: (a, b) => Number(a.total) - Number(b.total),
              },
              {
                width: 80,
                key: "delete",
                title: "Delete",
                dataIndex: "delete",
                render: (_, item) => (
                  <Button
                    danger
                    size="small"
                    type="primary"
                    icon={<TrashIcon />}
                    onClick={() =>
                      showConfirmBox().then(
                        ({ isConfirmed }) =>
                          isConfirmed && setDeleteId(item.id),
                      )
                    }
                  />
                ),
              },
            ].map((item) => ({
              ...item,
              title: t(item.title),
            }))}
          />
        </div>

        <div className="flex justify-end pt-5">
          <div className="flex items-center gap-2">
            <div className="font-bold pr-2 leading-none">{t("Total:")}</div>
            <Input value={total} disabled className="!w-full" />
          </div>
        </div>
      </div>
    </FiledSet>
  );
}
