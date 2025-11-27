"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditBrand from "@/modals/settings/CreateEditBrand";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [brandData, setBrandData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { data, isLoading } = useSyncDbQuery("Brand");
  const { mutate, data: response } = useCommonDelete("Brand");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["brand_name"]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Brand")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("brand-add") && (
            <Button type="primary" onClick={() => setIsPopupVisible(true)}>
              {t("Create New")}
            </Button>
          )}
        </div>
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "brand",
            title: "Brand",
            dataIndex: "brand_name",
            sorter: (a, b) => String(a.brand_name).localeCompare(b.brand_name),
          },

          {
            width: 200,
            key: "edit",
            title: "Edit",
            dataIndex: "edit",
            render: (_, item) => (
              <Button
                size="small"
                type="primary"
                icon={<PencilIcon />}
                onClick={() => {
                  setBrandData(item);
                  setIsPopupVisible(true);
                }}
              >
                {t("Edit")}
              </Button>
            ),
          },
          {
            width: 200,
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
                    ({ isConfirmed }) => isConfirmed && setDeleteId(item.id),
                  )
                }
              >
                {t("Delete")}
              </Button>
            ),
          },
        ]
          .filter((item) => !!item)
          .map((item) => ({
            ...item,
            title: t(item.title),
          }))}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditBrand
        open={isPopupVisible}
        data={brandData}
        onClose={() => {
          setBrandData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
