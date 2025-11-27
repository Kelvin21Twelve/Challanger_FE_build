"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { Input, Modal, Form, Select, DatePicker } from "antd";

import { useSyncDbQuery, useCreateEditHrms } from "@/queries";

import {
  ModalTitle,
  SearchForm,
  ModalTable,
  typeOptions,
  useCommonModalOperations,
} from "./shared";

const { TextArea } = Input;
const { Item, useWatch } = Form;

const modelFormId = "UsersAdditions";

function ActionForm({ t, form, isFormLock, onSubmit }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      disabled={isFormLock}
      className="grid grid-cols-1 sm:grid-cols-2 gap-x-8"
    >
      <Item name="additions_id" hidden />
      <Item name="additions_end_date" hidden />
      <Item
        label={t("Type")}
        name="additions_type"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <Select
          options={typeOptions}
          placeholder={t("Type")}
          filterOption={(input = "", { label = "" } = {}) =>
            String(label).toLowerCase().includes(String(input).toLowerCase())
          }
        />
      </Item>

      <Item
        label={t("Amount")}
        name="additions_amount"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <Input
          placeholder={t("Amount")}
          type="number"
          step={0.01}
          min={0}
          onKeyDown={(e) =>
            ["+", "-", "e"].includes(e.key) && e.preventDefault()
          }
        />
      </Item>

      <Item
        label={t("Date")}
        name="additions_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("Date")} className="w-full" />
      </Item>

      <Item
        label={t("Description")}
        name="additions_description"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <TextArea placeholder={t("Description")} />
      </Item>
    </Form>
  );
}

export default function AdditionFormModal({ employeeId, open, onClose }) {
  const t = useTranslations("modals");
  const { data, isLoading, refetch } = useSyncDbQuery(modelFormId);
  const { mutate, data: response } = useCreateEditHrms("eadditions");

  const {
    form,
    tableData,
    isFormLock,
    handleClose,
    setIsFormLock,
    handleActions,
    setFilterData,
  } = useCommonModalOperations({
    data,
    onClose,
    refetch,
    response,
    employeeId,
    filterCallback: (item, values) => {
      const { start_date, end_date } = values || {};
      const veTime = new Date(end_date).getTime();
      const vsTime = new Date(start_date).getTime();
      const iTime = new Date(item.start_date).getTime();

      const condition = iTime >= vsTime && iTime <= veTime;
      return condition;
    },
  });

  const recordId = useWatch("additions_id", form);

  const handleSubmit = () => {
    const payload = form.getFieldsValue();
    const { additions_date, additions_end_date, ...rest } = payload || {};

    const newPayload = {
      ...rest,
      eadditions_id: employeeId,
      additions_date: additions_date
        ? dayjs(additions_date).format("YYYY-MM-DD")
        : null,
      additions_end_date: dayjs(additions_end_date).format("YYYY-MM-DD"),
    };

    mutate(newPayload);
  };

  const handleClickView = useCallback(
    (item) => {
      const payload = {
        ...item,
        date: dayjs(item.start_date),
        end_date: item.end_date ? dayjs(item.end_date) : dayjs("1970-01-01"),
      };

      const newPayload = {};
      Object.keys(payload).forEach(
        (key) => (newPayload["additions_" + key] = payload[key]),
      );

      form.setFieldsValue(newPayload);
      setIsFormLock(true);
      setIsFormLock(true);
      setIsFormLock(true);
      setIsFormLock(true);
    },
    [form, setIsFormLock],
  );

  return (
    <Modal
      title={
        <ModalTitle
          recordId={recordId}
          isFormLock={isFormLock}
          onAction={handleActions}
          title={t("Additions Form")}
        />
      }
      open={open}
      footer={null}
      width={{ lg: "80%" }}
      onCancel={handleClose}
    >
      <ActionForm
        t={t}
        form={form}
        onSubmit={handleSubmit}
        isFormLock={isFormLock}
      />

      <hr />

      <SearchForm
        onReset={() => setFilterData()}
        onSubmit={(data) =>
          setFilterData({
            end_date: dayjs(data.end_date).format("YYYY-MM-DD"),
            start_date: dayjs(data.start_date).format("YYYY-MM-DD"),
          })
        }
      />

      <hr />

      <ModalTable
        columns={useMemo(
          () =>
            [
              {
                key: "id",
                title: "Id",
                dataIndex: "id",
              },
              {
                key: "description",
                title: "Description",
                dataIndex: "description",
              },
              {
                title: "Date",
                key: "start_date",
                dataIndex: "start_date",
              },
              {
                key: "amount",
                title: "Amount",
                dataIndex: "amount",
              },
            ].map((item) => ({
              ...item,
              title: t(item.title),
            })),
          [t],
        )}
        loading={isLoading}
        dataSource={tableData}
        deleteModal={modelFormId}
        onClickView={handleClickView}
      />
    </Modal>
  );
}
