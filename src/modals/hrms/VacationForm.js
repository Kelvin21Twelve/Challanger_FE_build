"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useMemo, useCallback, useEffect } from "react";
import { Input, Modal, Form, DatePicker, Select } from "antd";

import { useSyncDbQuery, useCreateEditHrms } from "@/queries";

import {
  SearchForm,
  ModalTable,
  ModalTitle,
  useCommonModalOperations,
} from "./shared";

const { TextArea } = Input;
const { Item, useWatch } = Form;

const modelFormId = "UsersVacations";

function ActionForm({ t, form, onSubmit, isFormLock }) {
  const { data, isLoading } = useSyncDbQuery("VacType");

  const typeValue = useWatch("vacations_type", form);

  const options = useMemo(
    () =>
      data?.data?.map((item) => ({
        value: item.id,
        label: item.name,
        balance: item.vac_limit,
      })) || [],
    [data?.data],
  );

  useEffect(() => {
    if (typeValue && options?.length > 0) {
      const balance = options.find((item) => item.value == typeValue)?.balance;
      form.setFieldValue("vacations_balance", balance);
    }
  }, [form, options, typeValue]);

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      disabled={isFormLock}
      className="grid sm:grid-cols-2 gap-x-8"
    >
      <Item name="vacations_id" hidden />
      <Item
        label={t("Type")}
        name="vacations_type"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <Select
          placeholder={t("Type")}
          loading={isLoading}
          options={options}
          filterOption={(input = "", { label = "" } = {}) =>
            String(label).toLowerCase().includes(String(input).toLowerCase())
          }
        />
      </Item>

      <Item
        name="vacations_balance"
        label={t("Balance Leaves")}
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <Input placeholder={t("Balance Leaves")} disabled />
      </Item>

      <Item
        label={t("Start Date")}
        name="vacations_start_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("Start Date")} className="w-full" />
      </Item>

      <Item
        label={t("To Date")}
        name="vacations_end_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("To Date")} className="w-full" />
      </Item>

      <Item
        label={t("Resume Date")}
        name="vacations_resume_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("Resume Date")} className="w-full" />
      </Item>

      <Item
        label={t("Description")}
        name="vacations_description"
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
  const { mutate, data: response } = useCreateEditHrms("evacations");

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

      const condition1 =
        new Date(item.start_date).getTime() >= new Date(start_date).getTime();
      const condition2 =
        new Date(item.end_date).getTime() <= new Date(end_date).getTime();

      return condition1 && condition2;
    },
  });

  const recordId = useWatch("vacations_id", form);

  const handleSubmit = () => {
    const payload = form.getFieldsValue();
    const {
      vacations_end_date,
      vacations_start_date,
      vacations_resume_date,
      ...rest
    } = payload || {};

    const newPayload = {
      ...rest,
      evacations_id: employeeId,
      vacations_end_date: dayjs(vacations_end_date).format("YYYY-MM-DD"),
      vacations_start_date: dayjs(vacations_start_date).format("YYYY-MM-DD"),
      vacations_resume_date: dayjs(vacations_resume_date).format("YYYY-MM-DD"),
    };

    mutate(newPayload);
  };

  const handleClickView = useCallback(
    (item) => {
      const payload = {
        ...item,
        end_date: dayjs(item.end_date),
        start_date: dayjs(item.start_date),
        resume_date: dayjs(item.resume_date),
      };

      const newPayload = {};
      Object.keys(payload).forEach(
        (key) => (newPayload["vacations_" + key] = payload[key]),
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
      open={open}
      footer={null}
      width={{ lg: "80%" }}
      onCancel={handleClose}
      title={
        <ModalTitle
          recordId={recordId}
          isFormLock={isFormLock}
          onAction={handleActions}
          title={t("Vacations Form")}
        />
      }
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
                title: "Start",
                key: "start_date",
                dataIndex: "start_date",
              },
              {
                title: "End",
                key: "end_date",
                dataIndex: "end_date",
              },
              {
                title: "Resume",
                key: "resume_date",
                dataIndex: "resume_date",
              },
              {
                key: "description",
                title: "Description",
                dataIndex: "description",
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
