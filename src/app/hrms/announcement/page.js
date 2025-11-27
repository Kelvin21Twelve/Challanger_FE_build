"use client";

import Swal from "sweetalert2";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useContext, useEffect } from "react";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography, Table, Form, DatePicker } from "antd";

import { SearchIcon } from "@/assets/icons";
import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateAnnouncementModal from "@/modals/hrms/CreateAnnouncement";

const { Item, useForm } = Form;
const { Title } = Typography;

export default function Page() {
  const [form] = useForm();
  const t = useTranslations("announcement");
  const { permissions } = useContext(UserContext);
  const { mutate } = useCommonDelete("Announcement");
  const { data, isLoading } = useSyncDbQuery("Announcement");
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["ann_date", "description"]);

  const [filterData, setFilterData] = useState();
  const [modelData, setModelData] = useState(null);
  const [isModelOpen, setIsModelOpen] = useState(false);

  const handleFinish = (values) => {
    const { start_date, end_date } = values || {};
    if (!start_date && !end_date) {
      Swal.fire({ text: t("Please select at least one field") });
      return;
    }

    setFilterData(values);
  };

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("announcement-view"))
      redirect("/hrms/add-employee");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Announcement")}</Title>

        {permissions.includes("announcement-add") && (
          <div className="flex items-center gap-3">
            <Button type="primary" onClick={() => setIsModelOpen(true)}>
              {t("Create")}
            </Button>
          </div>
        )}
      </div>

      <div className="pt-4 md:pt-0">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <div className="flex flex-wrap gap-1 md:gap-4">
            <Item name="start_date" label={t("From Date")}>
              <DatePicker placeholder={t("From Date")} />
            </Item>

            <Item name="end_date" label={t("To Date")}>
              <DatePicker placeholder={t("To Date")} />
            </Item>

            <div className="pt-7 flex items-start gap-2">
              <Button type="primary" size="small" htmlType="submit">
                <span className="[&_svg]:w-5">
                  <SearchIcon />
                </span>
                <span>{t("Search")}</span>
              </Button>

              {filterData && (
                <Button
                  danger
                  size="small"
                  type="primary"
                  onClick={() => {
                    form.resetFields();
                    setFilterData(null);
                  }}
                >
                  <span className="[&_svg]:w-5">
                    <FontAwesomeIcon icon={faX} />
                  </span>
                  <span>{t("Clear")}</span>
                </Button>
              )}
            </div>
          </div>
        </Form>
      </div>

      <div>
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            title: t("Date"),
            dataIndex: "ann_date",
            sorter: (a, b) => String(a.ann_date).localeCompare(b.ann_date),
          },
          {
            title: t("Announcement"),
            dataIndex: "description",
            sorter: (a, b) =>
              String(a.description).localeCompare(b.description),
          },
          permissions.includes("announcement-edit")
            ? {
                key: "edit",
                title: t("Edit"),
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
          permissions.includes("announcement-delete")
            ? {
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
                        ({ isConfirmed }) => isConfirmed && mutate(item.id),
                      )
                    }
                  >
                    {t("Delete")}
                  </Button>
                ),
              }
            : null,
        ].filter((item) => !!item)}
        dataSource={
          filterData
            ? filteredData.filter(({ ann_date }) => {
                const { start_date, end_date } = filterData;
                const ad = new Date(ann_date).getTime();
                const sd = new Date(start_date).getTime();
                const ed = new Date(end_date).getTime();

                if (start_date && !end_date) return ad >= sd;
                if (!start_date && end_date) return ad <= ed;
                if (start_date && end_date) return ad >= sd && ad <= ed;
              })
            : filteredData
        }
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateAnnouncementModal
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
