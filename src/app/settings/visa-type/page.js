"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";
import CreateEditVisaType from "@/modals/settings/CreateEditVisaType";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("VisaType");
  const { data, isLoading } = useSyncDbQuery("VisaType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["visa_type"]);

  const [visaData, setVisaData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("visa-type-view"))
      redirect("/settings/vacation-type");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Visa Type")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("visa-type-add") && (
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
        className="mt-3 border-[#dfe0e1] overflow-x-auto max-w-full"
        columns={[
          {
            key: "name",
            title: "Name",
            dataIndex: "visa_type",
            sorter: (a, b) => String(a.visa_type).localeCompare(b.visa_type),
          },
          permissions.includes("visa-type-edit")
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
                      setVisaData(item);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("visa-type-delete")
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

      <CreateEditVisaType
        data={visaData}
        open={isPopupVisible}
        onClose={() => {
          setVisaData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
