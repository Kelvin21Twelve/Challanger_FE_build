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
import CreateEditSupplier from "@/modals/settings/CreateEditSupplier";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const [deleteId, setDeleteId] = useState(null);
  const [supplierData, setSupplierData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { permissions } = useContext(UserContext);
  const { data, isLoading } = useSyncDbQuery("Supplier");
  const { mutate, data: response } = useCommonDelete("Supplier");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["name", "phone", "fax", "profit_perc", "account_no"]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    if (!permissions.includes("supplier-view")) redirect("/settings/agencies");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Supplier")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("supplier-add") && (
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
            key: "phone",
            title: "Phone",
            dataIndex: "phone",
            sorter: (a, b) => String(a.phone).localeCompare(b.phone),
          },
          {
            key: "fax",
            title: "Fax",
            dataIndex: "fax",
            sorter: (a, b) => String(a.fax).localeCompare(b.fax),
          },
          {
            key: "profit_percent",
            title: "Profit Percent",
            dataIndex: "profit_perc",
            sorter: (a, b) =>
              String(a.profit_perc).localeCompare(b.profit_perc),
          },
          {
            key: "account_no",
            title: "Account No",
            dataIndex: "account_no",
            sorter: (a, b) => String(a.account_no).localeCompare(b.account_no),
          },
          permissions.includes("supplier-edit")
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
                      setSupplierData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("supplier-delete")
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

      <CreateEditSupplier
        data={supplierData}
        open={isPopupVisible}
        onClose={() => {
          setSupplierData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
