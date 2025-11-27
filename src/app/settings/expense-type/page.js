"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { useSyncDbQuery, useCommonDelete } from "@/queries";
import { showConfirmBox, useTableSearch, showTotal } from "@/utils";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditExpenseType from "@/modals/settings/CreateEditExpenseType";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [expenseTypeData, setExpenseTypeData] = useState(null);

  const { data, isLoading } = useSyncDbQuery("ExpenseType");
  const { mutate, data: response } = useCommonDelete("ExpenseType");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["account_number", "account_name", "type"]);

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
        <Title level={2}>{t("Manage Expense Type")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("expense-type-add") && (
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
            key: "account_no",
            title: t("Account Number"),
            dataIndex: "account_number",
            sorter: (a, b) =>
              String(a.account_number).localeCompare(b.account_number),
          },
          {
            key: "account_name",
            title: t("Account Name"),
            dataIndex: "account_name",
            sorter: (a, b) =>
              String(a.account_name).localeCompare(b.account_name),
          },
          {
            key: "expense_type",
            title: t("Expense Type"),
            dataIndex: "type",
            sorter: (a, b) => String(a.type).localeCompare(b.type),
          },
          permissions.includes("expense-type-edit")
            ? {
                width: 200,
                key: "edit",
                title: t("Edit"),
                dataIndex: "edit",
                render: (_, item) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setExpenseTypeData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("expense-type-delete")
            ? {
                width: 200,
                key: "delete",
                title: t("Delete"),
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
        ].filter((item) => !!item)}
        dataSource={filteredData}
        pagination={{
          showTotal,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />

      <CreateEditExpenseType
        open={isPopupVisible}
        data={expenseTypeData}
        onClose={() => {
          setExpenseTypeData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
