import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { Table, Button, Input, Select, Form } from "antd";

import { PlusIcon, TrashIcon, PencilIcon } from "@/assets/icons/actions";

import { showConfirmBox } from "@/utils";
import {
  useCommonDelete,
  useAddJobCardLabour,
  useGetJobCardLabours,
  useGetJobCardLabourList,
} from "@/queries";

import { UserContext } from "@/contexts/UserContext";

import FiledSet from "@/components/FiledSet";

import UpdateLabourModal from "./UpdateLabourModal";

const { Item, useForm, useWatch } = Form;

function LabourForm({
  onRefetchCalculations,
  onClickAddNew,
  carType,
  jobId,
  refetchFlag,
}) {
  const t = useTranslations("modals");

  const { permissions } = useContext(UserContext);

  const [form] = useForm();
  const selectedId = useWatch("labour", form);

  const {
    mutate,
    isError,
    isSuccess,
    isPending,
    data: response,
  } = useAddJobCardLabour();
  const isLoading = isPending && !isSuccess && !isError;

  const {
    data: laboursDropdownList,
    isLoading: laboursDropdownListLoading,
    refetch,
  } = useGetJobCardLabourList(carType);

  useEffect(() => {
    if (refetchFlag) refetch();
  }, [refetch, refetchFlag]);

  useEffect(() => {
    if (selectedId) {
      form.setFieldValue(
        "price",
        laboursDropdownList?.find((item) => item.id === selectedId)?.price ||
          "",
      );
    }
  }, [form, laboursDropdownList, selectedId]);

  useEffect(() => {
    if (response?.success) {
      form.resetFields();
    }
  }, [form, response]);

  useEffect(() => {
    if (response?.success) onRefetchCalculations?.();
  }, [onRefetchCalculations, response]);

  return (
    <Form form={form} onFinish={mutate} disabled={isLoading}>
      <div className="flex flex-wrap items-start sm:gap-4 justify-between pb-4">
        <div className="inline-flex flex-wrap gap-2 sm:gap-4">
          <Item name="job_id" initialValue={jobId} hidden />
          <Item
            name="labour"
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              allowClear
              className="sm:min-w-64"
              placeholder={t("Select Labour")}
              loading={laboursDropdownListLoading}
              options={laboursDropdownList?.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Item
            name="price"
            rules={[
              { required: true, message: t("This field is required") },
              {
                validator: (_, value) => {
                  const isValid = value > 0;
                  return isValid
                    ? Promise.resolve()
                    : Promise.reject(new Error(""));
                },
                message: t("Please enter valid price"),
              },
            ]}
          >
            <Input
              min={0}
              step={0.01}
              type="number"
              placeholder={t("Price")}
              onKeyDown={(e) =>
                ["+", "-", "e"].includes(e.key) && e.preventDefault()
              }
            />
          </Item>
        </div>
        <div className="inline-flex gap-2">
          {permissions.includes("customers-labour-add") && (
            <Button
              type="primary"
              htmlType="submit"
              iconPosition="end"
              loading={isLoading}
              disabled={isLoading}
            >
              {t("Add")}
            </Button>
          )}

          <Button type="primary" onClick={onClickAddNew}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default function JobCardLabours({
  jobId,
  carType,
  discount,
  refetchFlag,
  onClickAddNew,
  onRefetchCalculations,
}) {
  const queryClient = useQueryClient();
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data, isLoading } = useGetJobCardLabours(jobId);

  const { mutate, data: response } = useCommonDelete("CustomersLabour");

  const [deleteId, setDeleteId] = useState(null);
  const [editData, setEditData] = useState(null);

  const filteredData = data?.data || [];

  const total = filteredData.reduce(
    (acc, { quantity, price }) => acc + Number(quantity) * Number(price),
    0,
  );

  const discountedTotal = total;

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) {
      queryClient.setQueryData(
        ["get-job-card-labours-invoices", jobId],
        (oldData) => ({
          data: oldData?.data?.filter?.((item) => item.id !== deleteId),
        }),
      );

      setDeleteId(null);
    }
  }, [deleteId, jobId, queryClient, response]);

  useEffect(() => {
    form.setFieldValue("discount", discount);
  }, [discount, form]);

  useEffect(() => {
    if (response?.success) onRefetchCalculations?.();
  }, [onRefetchCalculations, response]);

  return (
    <FiledSet label={t("Labours")}>
      <div className="py-1">
        <LabourForm
          jobId={jobId}
          carType={carType}
          refetchFlag={refetchFlag}
          onClickAddNew={onClickAddNew}
          onRefetchCalculations={onRefetchCalculations}
        />

        <div className="max-w-full overflow-x-auto">
          <Table
            rowId="id"
            columns={[
              {
                key: "labour_name",
                title: "Item Name",
                dataIndex: "labour_name",
                sorter: (a, b) =>
                  String(a.labour_name).localeCompare(b.labour_name),
              },
              {
                width: 120,
                key: "quantity",
                title: "Quantity",
                dataIndex: "quantity",
                sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
              },
              {
                width: 120,
                key: "price",
                title: "Price",
                dataIndex: "price",
                sorter: (a, b) => Number(a.price) - Number(b.price),
              },
              {
                width: 100,
                key: "delete",
                title: "Action",
                dataIndex: "delete",
                render: (_, item) => (
                  <div className="flex gap-1">
                    <Button
                      size="small"
                      type="primary"
                      icon={<PencilIcon />}
                      onClick={() => setEditData(item)}
                    />
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
                    />
                  </div>
                ),
              },
            ].map((item) => ({
              ...item,
              title: t(item.title),
            }))}
            bordered
            size="small"
            pagination={false}
            scroll={{ y: 222 }}
            loading={isLoading}
            dataSource={filteredData}
            className="border-[#dfe0e1] min-w-[800px]"
          />
        </div>

        <div className="flex justify-end pt-4">
          <div className="flex items-center gap-2">
            <div className="font-bold pr-2 leading-none">{t("Total:")}</div>
            <Input value={discountedTotal} disabled />
          </div>
        </div>
      </div>

      <UpdateLabourModal
        data={editData}
        open={!!editData}
        onClose={() => setEditData(null)}
        onRefetchCalculations={onRefetchCalculations}
      />
    </FiledSet>
  );
}
