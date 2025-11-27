"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useGetUsedSpareParts, useCommonDelete } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateUsedSparePartsModal from "@/modals/inventory/CreateUsedSpareParts";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("used-spare-parts");
  const { data, refetch, isLoading } = useGetUsedSpareParts();
  const { mutate, data: response } = useCommonDelete("UsedSpareParts");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "item_name",
      "car_view",
      "car_type",
      "sale_price",
      "balance",
      "min_limit",
      "edit",
    ]);

  const [modelData, setModelData] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const { permissions } = useContext(UserContext);

  useEffect(() => {
    setRecords(data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (response?.success) refetch();
  }, [response, refetch]);

  useEffect(() => {
    if (!permissions.includes("used-spare-parts-view"))
      redirect("/inventory/new-spare-parts");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Used Spare Parts")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("used-spare-parts-add") && (
            <Button type="primary" onClick={() => setIsModelOpen(true)}>
              {t("Create")}
            </Button>
          )}
        </div>
      </div>

      <Table
        bordered
        rowKey="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "item_name",
            title: "Item Name",
            dataIndex: "item_name",
            sorter: (a, b) => String(a.item_name).localeCompare(b.item_name),
          },
          {
            key: "car_view",
            title: "Car View",
            dataIndex: "car_view",
            sorter: (a, b) => String(a.car_view).localeCompare(b.car_view),
          },
          {
            key: "car_type",
            title: "Car Type",
            dataIndex: "car_type",
            sorter: (a, b) => String(a.car_type).localeCompare(b.car_type),
          },
          {
            key: "sale_price",
            title: "Sale Price",
            dataIndex: "sale_price",
            sorter: (a, b) => String(a.sale_price).localeCompare(b.sale_price),
          },
          {
            key: "balance",
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => String(a.balance).localeCompare(b.balance),
          },
          {
            key: "min_limit",
            title: "Min Limit",
            dataIndex: "min_limit",
            sorter: (a, b) => String(a.min_limit).localeCompare(b.min_limit),
          },
          permissions.includes("used-spare-parts-edit")
            ? {
                key: "edit",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setModelData(item);
                      setIsModelOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("used-spare-parts-delete")
            ? {
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
                        ({ isConfirmed }) => isConfirmed && mutate(item.id),
                      )
                    }
                  >
                    {t("Delete")}
                  </Button>
                ),
              }
            : null,
        ]
          .filter((item) => !!item)
          .map((item) => ({
            ...item,
            title: t(item.title),
          }))}
        dataSource={filteredData || []}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateUsedSparePartsModal
        dataId={modelData?.id}
        onRefetch={refetch}
        open={isModelOpen}
        onClose={() => {
          setModelData(null);
          setIsModelOpen(false);
        }}
      />
    </div>
  );
}
