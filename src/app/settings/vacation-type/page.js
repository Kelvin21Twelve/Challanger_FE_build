"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditVacationType from "@/modals/settings/CreateEditVacationType";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);
  const { mutate } = useCommonDelete("VacType");
  const { data, isLoading } = useSyncDbQuery("VacType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["name", "vac_limit", "is_payable"]);

  const [vacationData, setVacationData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("vacation-type-view"))
      redirect("/settings/labour");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Vacation Type")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("vacation-type-add") && (
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
            key: "name",
            title: "Name",
            dataIndex: "name",
            sorter: (a, b) => String(a.name).localeCompare(b.name),
          },
          {
            key: "vacation",
            dataIndex: "vac_limit",
            title: "Vacation Limit",
            sorter: (a, b) => Number(a.vac_limit) - Number(b.vac_limit),
          },
          {
            key: "is_payable",
            dataIndex: "is_payable",
            title: "Is Payable",
            sorter: (a, b) => String(a.is_payable).localeCompare(b.is_payable),
            render: (is_payable) => (is_payable ? "Yes" : "No"),
          },
          permissions.includes("vacation-type-edit")
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
                      setVacationData(item);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("vacation-type-delete")
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

      <CreateEditVacationType
        data={vacationData}
        open={isPopupVisible}
        onClose={() => {
          setVacationData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
