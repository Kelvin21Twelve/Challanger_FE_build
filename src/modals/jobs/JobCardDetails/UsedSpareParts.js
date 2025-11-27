import { useTranslations } from "next-intl";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect, useContext } from "react";
import { Table, Button, Input, Select, Form } from "antd";

import { PlusIcon, TrashIcon, PencilIcon } from "@/assets/icons/actions";

import FiledSet from "@/components/FiledSet";
import { UserContext } from "@/contexts/UserContext";

import {
  useSyncDbQuery,
  useCommonDelete,
  useJobCardUsedPartsInsert,
  useGetJobCardUsedSparePartsList,
} from "@/queries";
import { showConfirmBox } from "@/utils";

import UpdateUsedSparePartsModal from "./UpdateUsedSparePartsModal";

const { Item, useForm } = Form;

function SparePartsForm({
  jobId,
  onClickAddNew,
  isSpareRefetch,
  onRefetchCalculations,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");

  const { permissions } = useContext(UserContext);

  const { mutate: submit, data: response } = useJobCardUsedPartsInsert();

  const {
    refetch,
    data: usedSpareParts,
    isLoading: usedSparePartsLoading,
  } = useGetJobCardUsedSparePartsList();

  const handleSubmit = () => {
    const { id } = form.getFieldsValue();
    const item = usedSpareParts?.data?.find((item) => item.id == id) || {};

    if (!item?.id) return;

    const payload = {
      ...item,
      job_id: jobId,
    };

    submit(payload);
  };

  useEffect(() => {
    if (response?.success) onRefetchCalculations?.();
  }, [onRefetchCalculations, response]);

  useEffect(() => {
    if (isSpareRefetch) refetch();
  }, [isSpareRefetch, refetch]);

  return (
    <Form form={form} onFinish={handleSubmit}>
      <div className="flex flex-wrap items-center gap-4 justify-between pb-4">
        <div className="inline-flex gap-4">
          <Item name="id" noStyle required>
            <Select
              showSearch
              className="sm:min-w-80"
              loading={usedSparePartsLoading}
              placeholder={t("Select Used Spare Parts")}
              options={usedSpareParts?.data?.map((item) => ({
                label: item.item_name,
                value: item.id,
              }))}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
        </div>
        <div className="inline-flex gap-2">
          {permissions.includes("customers-used-spare-parts-add") && (
            <Button type="primary" htmlType="submit">
              {t("Add")}
            </Button>
          )}

          <Button type="primary" htmlType="button" onClick={onClickAddNew}>
            <PlusIcon />
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default function UsedSpareParts({
  onRefetchCalculations,
  isSpareRefetch,
  onClickAddNew,
  jobId,
}) {
  const t = useTranslations("modals");
  const queryClient = useQueryClient();

  const { data, isLoading } = useSyncDbQuery("CustomersUsedSpareParts");
  const { mutate, data: response } = useCommonDelete("CustomersUsedSpareParts");

  const [deleteId, setDeleteId] = useState(null);
  const [modalData, setModalData] = useState(null);

  const filteredData = (data?.data || []).filter(
    (item) => item.job_id === jobId,
  );

  const total = filteredData.reduce(
    (acc, { quantity, price }) => acc + Number(quantity) * Number(price),
    0,
  );

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) setDeleteId(null);
  }, [deleteId, jobId, queryClient, response]);

  useEffect(() => {
    if (response?.success) onRefetchCalculations?.();
  }, [onRefetchCalculations, response]);

  return (
    <FiledSet label={t("Used Spare Parts")}>
      <div className="py-1">
        <SparePartsForm
          jobId={jobId}
          onClickAddNew={onClickAddNew}
          isSpareRefetch={isSpareRefetch}
          onRefetchCalculations={onRefetchCalculations}
        />
        <div className="max-w-full overflow-x-auto">
          <Table
            rowId="id"
            columns={[
              {
                key: "item_name",
                title: "Item Name",
                dataIndex: "item_name",
                sorter: (a, b) =>
                  String(a.item_name).localeCompare(b.item_name),
              },
              {
                width: 100,
                key: "quantity",
                title: "Quantity",
                dataIndex: "quantity",
                sorter: (a, b) => Number(a.quantity) - Number(b.quantity),
              },
              {
                width: 100,
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
                      onClick={() => setModalData(item)}
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

        <div className="flex justify-end pt-5">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap font-semibold">{t("Total:")}</div>
            <Input disabled value={total} />
          </div>
        </div>
      </div>

      <UpdateUsedSparePartsModal
        data={modalData}
        open={!!modalData}
        onClose={() => setModalData(null)}
        onRefetchCalculations={onRefetchCalculations}
      />
    </FiledSet>
  );
}
