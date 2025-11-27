"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useEffect, useState, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditLabour from "@/modals/settings/CreateEditLabour";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [labourData, setLabourData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { data, isLoading } = useSyncDbQuery("Labour");
  const { mutate, data: response } = useCommonDelete("Labour");
  const { data: serviceTypes } = useSyncDbQuery("LabourServiceType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["name", "price", "labour_service", "print_adoption"]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    if (!permissions.includes("labour-view"))
      redirect("/settings/service-type");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Labour")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("labour-add") && (
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
            dataIndex: "name",
            sorter: (a, b) => String(a.name).localeCompare(b.name),
          },
          {
            key: "price",
            title: "Price",
            dataIndex: "price",
            sorter: (a, b) => Number(a.price) - Number(b.price),
          },
          {
            key: "service_type",
            title: "Service Type",
            dataIndex: "service_type",
            render: (service_type) =>
              serviceTypes?.data?.find((item) => item.id == service_type)
                ?.type || "",
            sorter: (a, b) =>
              String(a.service_type).localeCompare(b.service_type),
          },
          {
            key: "print_adoption",
            title: "Print Adoption",
            dataIndex: "print_adoption",
            sorter: (a, b) =>
              String(a.print_adoption).localeCompare(b.print_adoption),
          },
          permissions.includes("labour-edit")
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
          permissions.includes("labour-view")
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

      <CreateEditLabour
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
