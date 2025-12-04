"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography, Table, Form, DatePicker } from "antd";

import { SearchIcon } from "@/assets/icons";
import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useSyncDbQuery, useCommonDelete } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateHolidaysModal from "@/modals/hrms/CreateHolidays";

const { Title } = Typography;
const { Item, useForm } = Form;

export default function Page() {
  const [form] = useForm();
  const t = useTranslations("holidays");
  const { permissions } = useContext(UserContext);
  const { mutate } = useCommonDelete("Holyday");
  const { data, isLoading } = useSyncDbQuery("Holyday");
  const { filteredData, isSearchLoading, setQueryValue, setRecords } =
    useTableSearch(["start_date", "end_date", "resume_date", "description"]);

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
    if (!permissions.includes("holidays-view")) redirect("/hrms/announcement");
  }, [permissions]);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data?.data, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Holiday")}</Title>

        {permissions.includes("holidays-add") && (
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

      <SearchBar
        setQueryValue={setQueryValue}
        isSearchLoading={isSearchLoading}
      />

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            title: t("Start Date"),
            dataIndex: "start_date",
            sorter: (a, b) => String(a.start_date).localeCompare(b.start_date),
          },
          {
            title: t("End Date"),
            dataIndex: "end_date",
            sorter: (a, b) => String(a.end_date).localeCompare(b.end_date),
          },
          {
            title: t("Resume Date"),
            dataIndex: "resume_date",
            sorter: (a, b) =>
              String(a.resume_date).localeCompare(b.resume_date),
          },
          {
            title: t("Description"),
            dataIndex: "description",
            sorter: (a, b) =>
              String(a.description).localeCompare(b.description),
          },
          permissions.includes("holidays-edit")
            ? {
                key: "edit",
                title: t("Edit"),
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
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("holidays-delete")
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
            ? filteredData.filter((item) => {
                const ied = new Date(item.end_date).getTime();
                const isd = new Date(item.start_date).getTime();

                const { start_date, end_date } = filterData;
                const sd = new Date(start_date).getTime();
                const ed = new Date(end_date).getTime();

                if (start_date && !end_date) return isd >= sd;
                if (!start_date && end_date) return ed >= ied;
                if (start_date && end_date) return isd >= sd && ed >= ied;
              })
            : filteredData
        }
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <CreateHolidaysModal
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
