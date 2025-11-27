"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useContext } from "react";

import CreateCarModal from "@/modals/cars/CreateCar";
import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useGetCarDetails, useCommonDelete } from "@/queries";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("cars");
  const queryClient = useQueryClient();
  const { permissions } = useContext(UserContext);
  const { data, isLoading, refetch } = useGetCarDetails();
  const { mutate, data: deleteResponse } = useCommonDelete("Vehicle");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "model",
      "plate_no",
      "customer",
      "car_view",
      "car_type",
      "car_make",
      "car_color",
      "car_engine",
      "civil_id",
      "phone",
    ]);

  const [dataId, setDataId] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isCreateCarOpen, setIsCreateCarOpen] = useState(false);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (deleteResponse?.success) {
      queryClient.setQueryData(["get-car-details"], (oldData) => ({
        ...oldData,
        data: oldData?.data?.filter?.((item) => item.id != deleteId),
      }));
      setDataId(null);
    }
  }, [deleteId, queryClient, deleteResponse]);

  useEffect(() => {
    if (!permissions.includes("car-view")) redirect("/permission-issue");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Cars")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("car-add") && (
            <Button type="primary" onClick={() => setIsCreateCarOpen(true)}>
              {t("Create Car")}
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
            title: "Plate No",
            dataIndex: "plate_no",
            sorter: (a, b) => String(a.plate_no).localeCompare(b.plate_no),
          },
          {
            title: "Customer",
            dataIndex: "customer",
            sorter: (a, b) => String(a.customer).localeCompare(b.customer),
          },
          {
            title: "Car View",
            dataIndex: "car_view",
            sorter: (a, b) => String(a.car_view).localeCompare(b.car_view),
          },
          {
            title: "Car Type",
            dataIndex: "car_type",
            sorter: (a, b) => String(a.car_type).localeCompare(b.car_type),
          },
          {
            title: "Model",
            dataIndex: "model",
            sorter: (a, b) => String(a.model).localeCompare(b.model),
          },
          {
            title: "Car Make",
            dataIndex: "car_make",
            sorter: (a, b) => String(a.car_make).localeCompare(b.car_make),
          },
          {
            title: "Engine Type",
            dataIndex: "car_engine",
            sorter: (a, b) => String(a.car_engine).localeCompare(b.car_engine),
          },
          {
            title: "Car Color",
            dataIndex: "car_color",
            sorter: (a, b) => String(a.car_color).localeCompare(b.car_color),
          },
          permissions.includes("car-edit")
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
                      setDataId(item.id);
                      setIsCreateCarOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("car-delete")
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
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      {isCreateCarOpen && (
        <CreateCarModal
          open={true}
          dataId={dataId}
          refetchCars={refetch}
          onClose={() => {
            setDataId(null);
            setIsCreateCarOpen(false);
          }}
        />
      )}
    </div>
  );
}
