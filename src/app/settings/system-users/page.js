"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useEffect, useState, useContext, useMemo } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditUsers from "@/modals/settings/CreateEditUsers";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const [deleteId, setDeleteId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const { permissions } = useContext(UserContext);
  const { data: roleData } = useSyncDbQuery("Role");
  const { mutate, data: response } = useCommonDelete("User");
  const { data, isLoading, refetch } = useSyncDbQuery("User");

  const filterData = useMemo(
    () =>
      data?.data?.map((item) => ({
        ...item,
        department_name: roleData?.data?.find(
          (role) => role.id == item.department,
        )?.name,
      })) || [],
    [data?.data, roleData?.data],
  );

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["name", "email", "max_desc", "labour_desc", "department"]);

  useEffect(() => {
    setRecords(filterData);
  }, [filterData, setRecords]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [response]);

  useEffect(() => {
    if (!permissions.includes("system-user-view"))
      redirect("/settings/department");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Users")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("system-user-add") && (
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
            key: "email",
            title: "Email",
            dataIndex: "email",
            sorter: (a, b) => String(a.email).localeCompare(b.email),
          },
          {
            key: "max_disc",
            title: "Max Disc",
            dataIndex: "max_desc",
            sorter: (a, b) => String(a.max_desc).localeCompare(b.max_desc),
          },
          {
            key: "labour_disc",
            title: "Labour Disc",
            dataIndex: "labour_desc",
            sorter: (a, b) =>
              String(a.labour_desc).localeCompare(b.labour_desc),
          },
          {
            title: "Department",
            key: "department_name",
            dataIndex: "department_name",
            sorter: (a, b) =>
              String(a.department_name).localeCompare(b.department_name),
          },
          {
            key: "active",
            title: "Active",
            dataIndex: "is_active",
            sorter: (a, b) => String(a.is_active).localeCompare(b.is_active),
            render: (is_active) => (is_active ? "Yes" : "No"),
          },
          permissions.includes("system-user-edit")
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
                      setUserData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("system-user-delete")
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

      <CreateEditUsers
        data={userData}
        onRefetch={refetch}
        open={isPopupVisible}
        onClose={() => {
          setUserData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
