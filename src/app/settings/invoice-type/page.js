"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditInvoiceType from "@/modals/settings/CreateEditInvoiceType";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [invoiceTypeData, setInvoiceTypeData] = useState(null);

  const { data, isLoading } = useSyncDbQuery("InvoiceType");
  const { mutate, data: response } = useCommonDelete("InvoiceType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["type"]);

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
        <Title level={2}>{t("Manage Invoice Type")}</Title>

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
          permissions.includes("invc-menu-edit")
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
                      setInvoiceTypeData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("invc-menu-delete")
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

      <CreateEditInvoiceType
        open={isPopupVisible}
        data={invoiceTypeData}
        onClose={() => {
          setIsPopupVisible(false);
          setInvoiceTypeData(null);
        }}
      />
    </div>
  );
}
