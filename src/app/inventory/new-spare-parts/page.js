"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import SparePartsUploadModal from "@/modals/inventory/SparePartsUploadModal";
import CreateNewSparePartsModal from "@/modals/inventory/CreateNewSpareParts";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("new-spare-parts");
  const { mutate } = useCommonDelete("NewSpareParts");
  const { data, isLoading } = useSyncDbQuery("NewSpareParts");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "item_code",
      "item_name",
      "item_unit",
      "brand",
      "agent_price",
      "sale_price",
      "balance",
      "avg_cost",
      "min_limit",
    ]);

  const { permissions } = useContext(UserContext);

  const [uploadData, setUploadData] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [sparePartsData, setSparePartsData] = useState(null);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("new-spare-parts-view"))
      redirect("/inventory/spare-parts-return");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage New Spare Parts")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("new-spare-parts-add") && (
            <Button type="primary" onClick={() => setIsModelOpen(true)}>
              {t("Create")}
            </Button>
          )}

          <Button type="primary" onClick={() => setUploadData(true)}>
            {t("Import")}
          </Button>
        </div>
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            title: "Item Name",
            dataIndex: "item_name",
            sorter: (a, b) => String(a.item_name).localeCompare(b.item_name),
          },
          {
            title: "Item Unit",
            dataIndex: "item_unit",
            sorter: (a, b) => String(a.item_unit).localeCompare(b.item_unit),
          },
          {
            title: "Brand",
            dataIndex: "brand",
            sorter: (a, b) => String(a.brand).localeCompare(b.brand),
          },
          {
            title: "Supplier Price",
            dataIndex: "agent_price",
            sorter: (a, b) =>
              String(a.agent_price).localeCompare(b.agent_price),
          },
          {
            title: "Sale Price",
            dataIndex: "sale_price",
            sorter: (a, b) => String(a.sale_price).localeCompare(b.sale_price),
          },
          {
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => String(a.balance).localeCompare(b.balance),
          },
          {
            title: "Avg Cost",
            dataIndex: "avg_cost",
            sorter: (a, b) => String(a.avg_cost).localeCompare(b.avg_cost),
          },
          {
            title: "Min Limit",
            dataIndex: "min_limit",
            sorter: (a, b) => String(a.min_limit).localeCompare(b.min_limit),
          },
          permissions.includes("new-spare-parts-edit")
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
                      setSparePartsData(item);
                      setIsModelOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("new-spare-parts-delete")
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
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateNewSparePartsModal
        open={isModelOpen}
        data={sparePartsData}
        onClose={() => {
          setSparePartsData(null);
          setIsModelOpen(false);
        }}
      />

      <SparePartsUploadModal
        open={uploadData}
        onClose={() => setUploadData(false)}
      />
    </div>
  );
}
