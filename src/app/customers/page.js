"use client";

import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button, Typography, Table } from "antd";
import { useState, useContext, useEffect } from "react";

import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import { showConfirmBox, useTableSearch, showTotal } from "@/utils";
import { useCommonDelete, useSyncDbQuery } from "@/queries";

import { SearchBar } from "@/components/SearchBar";
import { UserContext } from "@/contexts/UserContext";

import CreateCustomerModal from "@/modals/customers/CreateCustomer";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("customers");
  const { permissions } = useContext(UserContext);

  const { mutate } = useCommonDelete("Customer");
  const { data, isLoading } = useSyncDbQuery("Customer");

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(["cust_name", "civil_id", "phone"]);

  const [customerDataId, setCustomerDataId] = useState(null);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] =
    useState(false);

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    if (!permissions.includes("customer-view")) redirect("/permission-issue");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage Customers")}</Title>

        <div className="flex flex-wrap items-center gap-3">
          <SearchBar
            setQueryValue={setQueryValue}
            isSearchLoading={isSearchLoading}
          />

          {permissions.includes("customer-add") && (
            <Button
              type="primary"
              onClick={() => setIsCreateCustomerModalOpen(true)}
            >
              {t("Create Customer")}
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
            key: "cust_name",
            title: "Customer Name",
            dataIndex: "cust_name",
            sorter: (a, b) => String(a.cust_name).localeCompare(b.cust_name),
          },
          {
            key: "civil_id",
            title: "Civil Id",
            dataIndex: "civil_id",
            sorter: (a, b) => String(a.civil_id).localeCompare(b.civil_id),
          },
          {
            key: "phone",
            title: "Mobile",
            dataIndex: "phone",
            sorter: (a, b) => String(a.phone).localeCompare(b.phone),
          },
          {
            width: 150,
            key: "is_company",
            title: "Is Company",
            dataIndex: "is_company",
            render: (is_company) => (is_company ? t("Yes") : t("No")),
            sorter: (a, b) => String(a.is_company).localeCompare(b.is_company),
          },
          permissions.includes("customer-edit")
            ? {
                width: 150,
                key: "action",
                title: "Edit",
                dataIndex: "edit",
                render: (_, item) => (
                  <Button
                    size="small"
                    type="primary"
                    icon={<PencilIcon />}
                    onClick={() => {
                      setCustomerDataId(item.id);
                      setIsCreateCustomerModalOpen(true);
                    }}
                  >
                    {t("Edit")}
                  </Button>
                ),
              }
            : null,
          permissions.includes("customer-delete")
            ? {
                width: 150,
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

      <CreateCustomerModal
        open={isCreateCustomerModalOpen}
        dataId={customerDataId}
        onClose={() => {
          setIsCreateCustomerModalOpen(false);
          setCustomerDataId(null);
        }}
      />
    </div>
  );
}
