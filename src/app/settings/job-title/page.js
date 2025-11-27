"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useEffect, useState, useContext } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateEditJobTitle from "@/modals/settings/CreateEditJobTitle";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [jobTitleData, setJobTitleData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { data, isLoading } = useSyncDbQuery("JobTitle");
  const { mutate, data: response } = useCommonDelete("JobTitle");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["job_title"]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    if (!permissions.includes("job-title-view")) redirect("/settings/brand");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Job Title")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("job-title-add") && (
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
            key: "job_title",
            title: "Job Title",
            dataIndex: "job_title",
            sorter: (a, b) => String(a.job_title).localeCompare(b.job_title),
          },
          permissions.includes("job-title-edit")
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
                      setJobTitleData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("job-title-delete")
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

      <CreateEditJobTitle
        data={jobTitleData}
        open={isPopupVisible}
        onClose={() => {
          setJobTitleData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
