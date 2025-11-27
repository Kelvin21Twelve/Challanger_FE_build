"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditMakeModal from "@/modals/settings/CreateEditMake";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("CarMake");
  const { data, isLoading } = useSyncDbQuery("CarMake");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["make"]);

  const [modalData, setModalData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (!isPopupVisible) setModalData(null);
  }, [isPopupVisible]);

  useEffect(() => {
    if (!permissions.includes("make-view")) redirect("/settings/model");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Make")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />
          {permissions.includes("make-add") && (
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
            key: "make",
            title: "Make",
            dataIndex: "make",
            sorter: (a, b) => String(a.make).localeCompare(b.make),
          },
          permissions.includes("make-edit")
            ? {
                key: "edit",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => {
                  return (
                    <Button
                      size="small"
                      type="primary"
                      icon={<PencilIcon />}
                      onClick={() => {
                        setModalData(item);
                        setIsPopupVisible(true);
                      }}
                    >
                      {t("Edit")}
                    </Button>
                  );
                },
              }
            : null,
          permissions.includes("make-delete")
            ? {
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
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditMakeModal
        data={modalData}
        open={isPopupVisible}
        onClose={() => {
          setModalData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
