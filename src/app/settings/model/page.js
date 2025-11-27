"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext, useMemo } from "react";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditModal from "@/modals/settings/CreateEditModal";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("CarModel");
  const { data: carMake } = useSyncDbQuery("CarMake");
  const { data, isLoading } = useSyncDbQuery("CarModel");

  const [modalData, setModalData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    if (!isPopupVisible) setModalData(null);
  }, [isPopupVisible]);

  useEffect(() => {
    if (!permissions.includes("model-view")) redirect("/settings/engine-type");
  }, [permissions]);

  const updatedData = useMemo(
    () =>
      data?.data?.map((item) => ({
        ...item,
        make_name: carMake?.data?.find((make) => make.id == item.make)?.make,
      })) || [],
    [carMake?.data, data?.data],
  );

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["make_name", "model", "from_model_year", "to_model_year"]);

  useEffect(() => {
    setRecords(updatedData);
  }, [setRecords, updatedData]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Model")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("model-add") && (
            <Button
              type="primary"
              onClick={() => {
                setModalData(null);
                setIsPopupVisible(true);
              }}
            >
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
            dataIndex: "make_name",
            sorter: (a, b) => String(a.make).localeCompare(b.make),
          },
          {
            key: "model",
            title: "Model",
            dataIndex: "model",
            sorter: (a, b) => String(a.model).localeCompare(b.model),
          },
          {
            key: "from",
            title: "From",
            dataIndex: "from_model_year",
            sorter: (a, b) =>
              String(a.from_model_year).localeCompare(b.from_model_year),
          },
          {
            key: "to",
            title: "To",
            dataIndex: "to_model_year",
            sorter: (a, b) =>
              String(a.to_model_year).localeCompare(b.to_model_year),
          },
          permissions.includes("model-edit")
            ? {
                key: "edit",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => (
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
                ),
              }
            : null,
          permissions.includes("model-delete")
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

      <CreateEditModal
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
