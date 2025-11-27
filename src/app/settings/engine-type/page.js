"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useEffect, useContext, useMemo } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";
import CreateEditEngineType from "@/modals/settings/CreateEditEngineType";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("settings");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("CarEngine");
  const { data: makeData } = useSyncDbQuery("CarMake");
  const { data: modelData } = useSyncDbQuery("CarModel");
  const { data, isLoading } = useSyncDbQuery("CarEngine");

  const [modalData, setModalData] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const updatedData = useMemo(
    () =>
      data?.data?.map((item) => ({
        ...item,
        make_name: makeData?.data?.find((make) => make.id == item.make)?.make,
        model_name: modelData?.data?.find((model) => model.id == item.model)
          ?.model,
      })),
    [data?.data, makeData?.data, modelData?.data],
  );

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["make_name", "model_name", "engine_type", "liter"]);

  useEffect(() => {
    if (!isPopupVisible) setModalData(null);
  }, [isPopupVisible]);

  useEffect(() => {
    if (!permissions.includes("engine-menu-visible"))
      redirect("/settings/color");
  }, [permissions]);

  useEffect(() => {
    setRecords(updatedData || []);
  }, [setRecords, updatedData]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Engine Type")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("engine-menu-add") && (
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
            title: t("Make"),
            dataIndex: "make_name",
            sorter: (a, b) => String(a.make_name).localeCompare(b.make_name),
          },
          {
            key: "model",
            title: t("Model"),
            dataIndex: "model_name",
            sorter: (a, b) => String(a.model_name).localeCompare(b.model_name),
          },
          {
            key: "engine",
            title: t("Engine"),
            dataIndex: "engine_type",
            sorter: (a, b) =>
              String(a.engine_type).localeCompare(b.engine_type),
          },
          {
            key: "liter",
            title: t("Liter"),
            dataIndex: "liter",
            sorter: (a, b) => String(a.liter).localeCompare(b.liter),
          },
          permissions.includes("engine-menu-edit")
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
                      setModalData(item);
                      setIsPopupVisible(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("engine-menu-delete")
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
        ].filter((item) => !!item)}
        dataSource={filteredData || []}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateEditEngineType
        open={isPopupVisible}
        data={modalData}
        onClose={() => {
          setModalData(null);
          setIsPopupVisible(false);
        }}
      />
    </div>
  );
}
