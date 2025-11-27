"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditNationality from "@/modals/settings/CreateEditNationality";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);
  const { mutate } = useCommonDelete("Nationality");
  const { data, isLoading } = useSyncDbQuery("Nationality");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["nationality"]);

  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [nationalityData, setNationalityData] = useState(null);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("nationality-view"))
      redirect("/settings/visa-type");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Nationality")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("nationality-add") && (
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
            key: "nationality",
            title: "Nationality",
            dataIndex: "nationality",
            sorter: (a, b) =>
              String(a.nationality).localeCompare(b.nationality),
          },
          permissions.includes("nationality-edit")
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
                      setIsPopupVisible(true);
                      setNationalityData(item);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("nationality-delete")
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
                      showConfirmBox().then(({ isConfirmed }) =>
                        isConfirmed ? mutate(item.id) : null,
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

      <CreateEditNationality
        open={isPopupVisible}
        data={nationalityData}
        onClose={() => {
          setNationalityData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
