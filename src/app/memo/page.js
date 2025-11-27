"use client";

import dayjs from "dayjs";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useEffect, useState, useContext } from "react";

import { useTableSearch, showConfirmBox, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { UserContext } from "@/contexts/UserContext";
import { SearchBar } from "@/components/SearchBar";

import CreateEditMemoModal from "@/modals/memo/CreateEditMemo";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("memo");
  const { permissions } = useContext(UserContext);
  const { data, isLoading } = useSyncDbQuery("Memo");
  const { mutate, data: response } = useCommonDelete("Memo");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["note", "date", "username"]);

  const [memoData, setMemoData] = useState(null);
  const [deleteId, setDeleteId] = useState(false);
  const [isModelOpen, setIsModelOpen] = useState(false);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate, response]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    if (!permissions.includes("memo-view")) redirect("/permission-issue");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Memo")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            isSearchLoading={isSearchLoading}
            setQueryValue={setQueryValue}
          />

          {permissions.includes("memo-add") && (
            <Button onClick={() => setIsModelOpen(true)} type="primary">
              {t("Create Memo")}
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
            key: "note",
            title: "Note",
            dataIndex: "note",
            sorter: (a, b) => String(a.note).localeCompare(b.note),
          },
          {
            key: "date",
            title: "Date",
            dataIndex: "date",
            sorter: (a, b) => String(a.date).localeCompare(b.date),
          },
          {
            key: "username",
            title: "Username",
            dataIndex: "username",
            sorter: (a, b) => String(a.username).localeCompare(b.username),
          },
          permissions.includes("memo-edit")
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
                      setMemoData({
                        ...item,
                        date: dayjs(item.date),
                      });
                      setIsModelOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("memo-delete")
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
            label: t(item.title),
          }))}
        dataSource={filteredData}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditMemoModal
        data={memoData}
        open={isModelOpen}
        onClose={() => {
          setMemoData(null);
          setIsModelOpen(false);
        }}
      />
    </div>
  );
}
