"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect } from "react";

import CreateEditAccountModal from "@/modals/accounts/CreateEditAccount";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("tree-of-accounts");
  const { permissions } = useContext(UserContext);
  const { mutate } = useCommonDelete("Account");
  const { data, isLoading } = useSyncDbQuery("Account");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "account_name_en",
      "account_name_ar",
      "opening_balance",
      "super_account",
      "account_code",
      "balance",
    ]);

  useEffect(() => {
    if (data?.data) setRecords(data?.data || []);
  }, [data, setRecords]);

  const [modelData, setModelData] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Accounts")}</Title>

        <div className="flex items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("account-add") && (
            <Button onClick={() => setIsModelOpen(true)} type="primary">
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
            title: "Account Name",
            key: "account_name_en",
            dataIndex: "account_name_en",
            sorter: (a, b) =>
              String(a.account_name_en).localeCompare(b.account_name_en),
          },
          {
            key: "account_name_ar",
            dataIndex: "account_name_ar",
            title: "Account Name Arabic",
            sorter: (a, b) =>
              String(a.account_name_ar).localeCompare(b.account_name_ar),
          },
          {
            key: "account_code",
            title: "Account Code",
            dataIndex: "account_code",
            sorter: (a, b) =>
              String(a.account_code).localeCompare(b.account_code),
          },
          {
            key: "super_account",
            title: "Super Account",
            dataIndex: "super_account",
            sorter: (a, b) =>
              String(a.super_account).localeCompare(b.super_account),
          },
          {
            key: "opening_balance",
            title: "Opening Balance",
            dataIndex: "opening_balance",
            sorter: (a, b) =>
              Number(a.opening_balance) - Number(b.opening_balance),
          },
          {
            key: "balance",
            title: "Balance",
            dataIndex: "balance",
            sorter: (a, b) => Number(a.balance) - Number(b.balance),
          },
          permissions.includes("account-edit")
            ? {
                width: 100,
                key: "edit",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => (
                  <Button
                    type="primary"
                    size="small"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setModelData(item);
                      setIsModelOpen(true);
                    }}
                  >
                    Edit
                  </Button>
                ),
              }
            : null,
          permissions.includes("account-delete")
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
                    Delete
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
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditAccountModal
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
