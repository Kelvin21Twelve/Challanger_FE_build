"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useMemo, useCallback } from "react";
import { Input, Modal, Form, DatePicker } from "antd";

import { useSyncDbQuery, useCreateEditHrms } from "@/queries";

import {
  SearchForm,
  ModalTable,
  ModalTitle,
  useCommonModalOperations,
} from "./shared";

const { TextArea } = Input;
const { Item, useWatch } = Form;

const modelFormId = "UsersAbsences";

function ActionForm({ t, form, onSubmit, isFormLock }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      disabled={isFormLock}
      className="grid sm:grid-cols-2 gap-x-8"
    >
      <Item name="absences_id" hidden />
      <Item
        label={t("Date")}
        name="absences_on_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker className="w-full" placeholder={t("Date")} />
      </Item>

      <Item
        label={t("Description")}
        name="absences_description"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <TextArea placeholder={t("Description")} />
      </Item>
    </Form>
  );
}

export default function VacationFormModal({ employeeId, open, onClose }) {
  const t = useTranslations("modals");
  const { data, isLoading, refetch } = useSyncDbQuery(modelFormId);
  const { mutate, data: response } = useCreateEditHrms("eabsences");

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
      const iTime = new Date(item.on_date).getTime();

      const condition = iTime >= vsTime && iTime <= veTime;
      return condition;
    },
  });

  const recordId = useWatch("absences_id", form);

  const handleSubmit = () => {
    const { absences_on_date, ...rest } = form.getFieldsValue();

    const newPayload = {
      ...rest,
      eabsences_id: employeeId,
      absences_on_date: dayjs(absences_on_date).format("YYYY-MM-DD"),
    };

    mutate(newPayload);
  };

  const handleClickView = useCallback(
    (item) => {
      const payload = {
        ...item,
        on_date: dayjs(item.on_date),
      };
      const newPayload = {};
      Object.keys(payload).forEach(
        (key) => (newPayload["absences_" + key] = payload[key]),
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
          title={t("Absences Form")}
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
                title: "Date",
                key: "on_date",
                dataIndex: "on_date",
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
