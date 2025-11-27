"use client";

import { useTranslations } from "next-intl";
import { Button, Typography, Table, Form, DatePicker } from "antd";
import { useCallback, useEffect, useState, useContext } from "react";

import { UserContext } from "@/contexts/UserContext";

import { SearchIcon } from "@/assets/icons";
import { PencilIcon, TrashIcon } from "@/assets/icons/actions";

import CreateEditGeneralLedgerModal from "@/modals/accounts/CreateEditGeneralLedger";

import {
  useDeleteGeneralLedger,
  useGeneralLedgerSearchMutation,
} from "@/queries";
import { showConfirmBox, showTotal } from "@/utils";

const { Item } = Form;
const { Title } = Typography;

export default function Page() {
  const t = useTranslations("general-ledger");
  const { permissions } = useContext(UserContext);

  const [formData, setFormData] = useState(null);
  const [modelData, setModelData] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { mutate: deleteMutate, isSuccess: deleteIsSuccess } =
    useDeleteGeneralLedger();
  const { data, isPending, isError, isSuccess, mutate, reset } =
    useGeneralLedgerSearchMutation();

  const isLoading = isPending && !isError && !isSuccess;

  const handleSearch = useCallback(() => {
    if (!formData) return;

    reset();
    mutate(formData);
  }, [formData, mutate, reset]);

  useEffect(() => {
    if (formData) handleSearch();
  }, [formData, handleSearch, deleteIsSuccess]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Manage General Ledger")}</Title>

        {permissions.includes("account-add") && (
          <div className="flex items-center gap-3">
            <Button onClick={() => setIsModalOpen(true)} type="primary">
              {t("Create")}
            </Button>
          </div>
        )}
      </div>

      <div className="pt-3">
        <Form layout="vertical" onFinish={setFormData}>
          <div className="flex flex-wrap items-start gap-1 md:gap-3">
            <Item
              name="from_date"
              label={t("From Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker size="large" placeholder={t("From Date")} />
            </Item>

            <Item
              name="to_date"
              label={t("To Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker size="large" placeholder={t("To Date")} />
            </Item>

            <div className="md:pt-8">
              <Button type="primary" htmlType="submit">
                <SearchIcon />
              </Button>
            </div>
          </div>
        </Form>
      </div>

      <Table
        bordered
        rowId="id"
        loading={isLoading}
        className="border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            key: "id",
            dataIndex: "id",
            title: "GLID",
            sorter: (a, b) => String(a.id).localeCompare(b.id),
          },
          {
            key: "acc_no",
            dataIndex: "acc_no",
            title: "Account",
            sorter: (a, b) => String(a.acc_no).localeCompare(b.acc_no),
          },
          {
            key: "date",
            title: "GL Date",
            dataIndex: "date",
            sorter: (a, b) => String(a.date).localeCompare(b.date),
          },
          {
            key: "credit",
            title: "Credit",
            dataIndex: "credit",
            sorter: (a, b) => String(a.credit).localeCompare(b.credit),
          },
          {
            key: "debit",
            title: "Debit",
            dataIndex: "debit",
            sorter: (a, b) => String(a.debit).localeCompare(b.debit),
          },
          {
            key: "description",
            title: "Description",
            dataIndex: "description",
            sorter: (a, b) =>
              String(a.description).localeCompare(b.description),
          },
          {
            width: 100,
            key: "edit",
            title: "Edit",
            dataIndex: "edit",
            render: (_, item) => (
              <Button
                size="small"
                type="primary"
                icon={<PencilIcon />}
                onClick={() => {
                  setModelData(item);
                  setIsModalOpen(true);
                }}
              >
                {t("Edit")}
              </Button>
            ),
          },
          {
            width: 100,
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
                    ({ isConfirmed }) => isConfirmed && deleteMutate(item.id),
                  )
                }
              >
                {t("Delete")}
              </Button>
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={data?.data || []}
        pagination={{
          showTotal,
          pageSize: 10,
          hideOnSinglePage: true,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />

      <CreateEditGeneralLedgerModal
        onRefetch={handleSearch}
        open={isModalOpen}
        data={modelData}
        onClose={() => {
          setModelData(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
