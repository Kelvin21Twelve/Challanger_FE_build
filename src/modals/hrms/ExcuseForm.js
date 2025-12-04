"use client";

import dayjs from "dayjs";
import { useTranslations } from "next-intl";
import { useCallback, useMemo } from "react";
import { Input, Modal, Form, DatePicker, TimePicker } from "antd";

import { useSyncDbQuery, useCreateEditHrms } from "@/queries";

import {
  ModalTitle,
  ModalTable,
  SearchForm,
  useCommonModalOperations,
} from "./shared";

const { TextArea } = Input;
const { Item, useWatch } = Form;

const modelFormId = "UsersExcuses";

function ActionForm({ t, form, onSubmit, isFormLock }) {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onSubmit}
      disabled={isFormLock}
      className="grid sm:grid-cols-2 gap-x-8"
    >
      <Item name="excuses_id" hidden />
      <Item
        label={t("Date")}
        name="excuses_on_date"
        rules={[{ required: true, message: t("This field is required") }]}
      >
        <DatePicker placeholder={t("Date")} className="w-full" />
      </Item>

      <Item
        label={t("Start Time")}
        name="excuses_start_time"
        dependencies={["excuses_end_time"]}
        rules={[
          { required: true, message: t("This field is required") },
          {
            message: t("Invalid Time Range"),
            validator: (_, startTime) => {
              const endTime = form.getFieldValue("excuses_end_time");

              if (!!startTime && !!endTime) {
                const diff = dayjs(endTime).diff(startTime);
                if (diff <= 0) return Promise.reject(new Error(""));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <TimePicker
          placeholder={t("Start Time")}
          className="w-full"
          format="h:mm:ss A"
        />
      </Item>

      <Item
        label={t("End Time")}
        name="excuses_end_time"
        dependencies={["excuses_start_time"]}
        rules={[
          { required: true, message: t("This field is required") },
          {
            message: t("Invalid Time Range"),
            validator: (_, endTime) => {
              const startTime = form.getFieldValue("excuses_start_time");

              if (!!startTime && !!endTime) {
                const diff = dayjs(endTime).diff(startTime);
                if (diff <= 0) return Promise.reject(new Error(""));
              }

              return Promise.resolve();
            },
          },
        ]}
      >
        <TimePicker
          placeholder={t("End Time")}
          className="w-full"
          format="h:mm:ss A"
        />
      </Item>

      <Item
        label={t("Description")}
        name="excuses_description"
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
  const { mutate, data: response } = useCreateEditHrms("eexcuses");

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
      const onDateTime = new Date(item.on_date).getTime();
      const startDateTime = new Date(start_date).getTime();
      const endDateTime = new Date(end_date).getTime();

      const condition =
        onDateTime >= startDateTime && onDateTime <= endDateTime;

      return condition;
    },
  });

  const recordId = useWatch("excuses_id", form);

  const handleSubmit = () => {
    const payload = form.getFieldsValue();

    const { excuses_on_date, excuses_end_time, excuses_start_time, ...rest } =
      payload || {};

    const newPayload = {
      ...rest,
      eexcuses_id: employeeId,
      excuses_on_date: dayjs(excuses_on_date).format("YYYY-MM-DD"),
      excuses_end_time: dayjs(excuses_end_time, "hh:mm:ssA").format(
        "hh:mm:ssA",
      ),
      excuses_start_time: dayjs(excuses_start_time, "hh:mm:ssA").format(
        "hh:mm:ssA",
      ),
    };

    mutate(newPayload);
  };

  const handleClickView = useCallback(
    (item) => {
      const payload = {
        ...item,
        on_date: dayjs(item.on_date),
        end_time: dayjs(item.end_time, "hh:mm:ssA"),
        start_time: dayjs(item.start_time, "hh:mm:ssA"),
      };

      const newPayload = {};
      Object.keys(payload).forEach(
        (key) => (newPayload["excuses_" + key] = payload[key]),
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
          title={t("Excuses Form")}
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
                key: "id",
                title: "Id",
                dataIndex: "id",
              },
              {
                title: "Date",
                key: "on_date",
                dataIndex: "on_date",
              },
              {
                key: "start_time",
                title: "Start Time",
                dataIndex: "start_time",
              },
              {
                key: "end_time",
                title: "End Time",
                dataIndex: "end_time",
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
