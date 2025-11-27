"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect, useMemo } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { UserContext } from "@/contexts/UserContext";
import { SearchBar } from "@/components/SearchBar";

import CreateEditExpenseModal from "@/modals/accounts/CreateEditExpense";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("user-expense");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("Expense");
  const { data, isLoading } = useSyncDbQuery("Expense");
  const { data: expenseType } = useSyncDbQuery("ExpenseType");

  const [modelData, setModelData] = useState();
  const [isModelOpen, setIsModelOpen] = useState(false);

  const tableData = useMemo(
    () =>
      data?.data?.map?.((item) => ({
        ...item,
        expense_type_name: expenseType?.data?.find(
          (type) => String(type.id) == item.expense_type,
        )?.type,
      })),
    [data?.data, expenseType?.data],
  );

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "exp_date",
      "user_account",
      "expense_type_name",
      "vendor",
      "amount",
    ]);

  useEffect(() => {
    setRecords(tableData || []);
  }, [setRecords, tableData]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("User Expense")}</Title>

        <div className="flex items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("expense-add") && (
            <Button type="primary" onClick={() => setIsModelOpen(true)}>
              {t("Create")}
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
            title: "Date",
            key: "exp_date",
            dataIndex: "exp_date",
            sorter: (a, b) => String(a.exp_date).localeCompare(b.exp_date),
          },
          {
            key: "user_account",
            title: "Account Name",
            dataIndex: "user_account",
            sorter: (a, b) =>
              String(a.user_account).localeCompare(b.user_account),
          },
          {
            title: "Expense Type",
            key: "expense_type_name",
            dataIndex: "expense_type_name",
            sorter: (a, b) =>
              String(a.expense_type_name).localeCompare(b.expense_type_name),
          },
          {
            key: "vendor",
            dataIndex: "vendor",
            title: "Account Number",
            sorter: (a, b) => String(a.vendor).localeCompare(b.vendor),
          },
          {
            key: "amount",
            title: "Amount",
            dataIndex: "amount",
            sorter: (a, b) => String(a.amount).localeCompare(b.amount),
          },
          permissions.includes("expense-edit")
            ? {
                width: 100,
                key: "edit",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setModelData(item);
                      setIsModelOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("expense-delete")
            ? {
                width: 100,
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

      <CreateEditExpenseModal
        data={modelData}
        open={isModelOpen}
        onClose={() => {
          setModelData(null);
          setIsModelOpen(false);
        }}
      />
    </div>
  );
}
