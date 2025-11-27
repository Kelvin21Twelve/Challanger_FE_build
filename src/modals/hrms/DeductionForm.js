"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useMemo, useCallback } from "react";
import { Input, Modal, Form, DatePicker, Select } from "antd";

import { useSyncDbQuery, useCreateEditHrms } from "@/queries";

import {
  ModalTable,
  ModalTitle,
  SearchForm,
  typeOptions,
  useCommonModalOperations,
} from "./shared";

const { TextArea } = Input;
const { Item, useWatch } = Form;

const modelFormId = "UsersDeductions";

function ActionForm({ t, form, onSubmit, isFormLock }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      disabled={isFormLock}
      className="grid sm:grid-cols-2 gap-x-8"
    >
      <Item name="deductions_id" hidden />
      <Item
        label={t("Type")}
        name="deductions_type"
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
        name="deductions_amount"
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
        name="deductions_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("Date")} className="w-full" />
      </Item>

      <Item
        label={t("Description")}
        name="deductions_description"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <TextArea placeholder={t("Description")} />
      </Item>
    </Form>
  );
}

export default function DeductionFormModal({ employeeId, open, onClose }) {
  const t = useTranslations("modals");
  const { data, isLoading, refetch } = useSyncDbQuery(modelFormId);
  const { mutate, data: response } = useCreateEditHrms("edeductions");

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

  const recordId = useWatch("deductions_id", form);

  const handleSubmit = () => {
    const payload = form.getFieldsValue();
    const { deductions_date, ...rest } = payload || {};

    const newPayload = {
      ...rest,
      edeductions_id: employeeId,
      deductions_end_date: "1970-01-01",
      deductions_date: deductions_date
        ? dayjs(deductions_date).format("YYYY-MM-DD")
        : null,
    };

    mutate(newPayload);
  };

  const handleClickView = useCallback(
    (item) => {
      const payload = {
        ...item,
        date: dayjs(item.start_date),
      };

      const newPayload = {};
      Object.keys(payload).forEach(
        (key) => (newPayload["deductions_" + key] = payload[key]),
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
          title={t("Deductions Form")}
          isFormLock={isFormLock}
          onAction={handleActions}
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
                title: "Id",
                dataIndex: "id",
                key: "customer_name",
              },
              {
                key: "description",
                title: "Description",
                dataIndex: "description",
              },
              {
                key: "date",
                title: "Date",
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
