"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditServiceType from "@/modals/settings/CreateEditServiceType";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const [deleteId, setDeleteId] = useState(null);
  const [labourData, setLabourData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { permissions } = useContext(UserContext);
  const { data, isLoading } = useSyncDbQuery("LabourServiceType");
  const { mutate, data: response } = useCommonDelete("LabourServiceType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["type"]);

  useEffect(() => {
    if (deleteId !== null) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response?.success]);

  useEffect(() => {
    if (!permissions.includes("service-menu-visible"))
      redirect("/settings/supplier");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Service Type")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("service-menu-add") && (
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
            key: "type",
            title: "Type",
            dataIndex: "type",
            sorter: (a, b) => String(a.type).localeCompare(b.type),
          },
          permissions.includes("service-menu-edit")
            ? {
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
                      setLabourData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("service-menu-delete")
            ? {
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
                        ({ isConfirmed }) =>
                          isConfirmed && setDeleteId(item.id),
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
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditServiceType
        data={labourData}
        open={isPopupVisible}
        onClose={() => {
          setLabourData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
