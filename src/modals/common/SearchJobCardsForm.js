"use client";

import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState, useMemo } from "react";
import {
  Form,
  Spin,
  Modal,
  Input,
  Table,
  Select,
  Button,
  Checkbox,
  DatePicker,
} from "antd";

import ActiveJobCard from "../jobs/JobCardDetails";
import CompletedJobCard from "../jobs/CompletedJobCardDetails";

import { SearchIcon } from "@/assets/icons";

import { useTableSearch } from "@/utils";
import { useSearchMaster, useSyncDbQuery } from "@/queries";

const { Item, useForm } = Form;

export default function SearchJobCardsFormModal({ open, onClose }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const [enableDate, setEnableDate] = useState(false);
  const [jobCardDetails, setJobCardDetails] = useState(false);

  const { data: customers } = useSyncDbQuery("Customer");
  const { data: agencies } = useSyncDbQuery("Agency");
  const { data: models } = useSyncDbQuery("CarModel");
  const { data: makes } = useSyncDbQuery("CarMake");

  const { mutate, reset, isPending, isSuccess, isError, data } =
    useSearchMaster();
  const isLoading = isPending && !isSuccess && !isError;

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "job_no",
      "cust_name",
      "agency",
      "view",
      "type",
      "model",
      "color",
      "plate_no",
      "phone",
      "entry_date",
      "balance",
      "status",
    ]);

  const handleFinish = ({ to_date, from_date, is_date_btw, ...rest }) => {
    const payload = {
      ...rest,
      ...(is_date_btw == "1"
        ? {
            is_date_btw,
            to_date: dayjs(to_date).format("YYYY-MM-DD"),
            from_date: dayjs(from_date).format("YYYY-MM-DD"),
          }
        : {}),

      master_search_tbl_length: "10",
    };

    const formData = new FormData();
    let count = 0;
    Object.keys(payload).forEach((key) => {
      if (payload[key]) {
        count++;
        formData.append(key, payload[key]);
      }
    });

    if (count === 1) {
      Swal.fire({ text: t("Please select at least one field") });
      return;
    }

    mutate(formData);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const getOptionsWithAll = (options) => {
    return [{ label: t("All"), value: "" }, ...options];
  };

  useEffect(() => {
    setRecords(data?.data || []);
  }, [data, setRecords]);

  useEffect(() => {
    form.setFieldValue("is_date_btw", enableDate ? "1" : "0");
  }, [enableDate, form]);

  const customerOptions = useMemo(
    () =>
      customers?.data?.map((item) => ({
        label: item.cust_name || "",
        value: item.id,
      })) || [],
    [customers],
  );

  const agencyOptions = useMemo(
    () =>
      agencies?.data?.map((item) => ({
        label: item.agency || "",
        value: item.id,
      })) || [],
    [agencies],
  );

  const makeOptions = useMemo(
    () =>
      makes?.data?.map(({ id, make }) => ({
        label: make,
        value: id,
      })) || [],
    [makes],
  );

  const modelOptions = useMemo(
    () =>
      models?.data?.map(({ id, model }) => ({
        label: model,
        value: id,
      })) || [],
    [models],
  );

  const isCompletedJobCardOpen =
    !!jobCardDetails && jobCardDetails?.status === "delivery";

  const isActiveJobCardOpen =
    !!jobCardDetails && jobCardDetails?.status !== "delivery";

  return (
    <Modal
      title={t("Search Job Cards Form")}
      onCancel={handleClose}
      width={{ lg: "70%" }}
      footer={null}
      open={open}
    >
      <Form
        form={form}
        initialValues={{
          car_make: "",
          car_view: "",
          car_type: "",
          plate_no: "",
          job_card_no: "",
        }}
        onFinish={handleFinish}
        labelCol={{ sm: 24, md: 4, lg: 6 }}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-4 items-start">
          <div>
            <Item name="is_date_btw" hidden />
            <Item name="cust_name" label={t("Customer Name")}>
              <Select
                showSearch
                allowClear
                options={customerOptions}
                placeholder={t("Customer Name")}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item name="job_card_no" label={t("Job Card No")}>
              <Input placeholder={t("Job Card No")} />
            </Item>

            <Item name="plate_no" label={t("Plate No")}>
              <Input placeholder={t("Plate No")} />
            </Item>

            <Item name="status" label={t("Cab Status")}>
              <Select
                showSearch
                placeholder={t("Cab Status")}
                options={[
                  {
                    label: "Under Test",
                    value: "under_test",
                  },
                  {
                    label: "Working",
                    value: "working",
                  },
                  {
                    label: "Delay",
                    value: "delay",
                  },
                  {
                    label: "Paint",
                    value: "paint",
                  },
                  {
                    label: "Print Request",
                    value: "print_req",
                  },
                  {
                    label: "Paid Wait",
                    value: "paid_wait",
                  },
                  {
                    label: "Clean Polish",
                    value: "clean_polish",
                  },
                  {
                    label: "On Change",
                    value: "on_change",
                  },
                  {
                    label: "Cancel Request",
                    value: "cancel_req",
                  },
                ]}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>
          </div>

          <div>
            <Item name="car_make" label={t("Car Agency")}>
              <Select
                showSearch
                placeholder={t("Car Agency")}
                options={getOptionsWithAll(agencyOptions)}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item name="car_view" label={t("Car Make")}>
              <Select
                showSearch
                placeholder={t("Car Make")}
                options={getOptionsWithAll(makeOptions)}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item name="car_type" label={t("Car Type")}>
              <Select
                showSearch
                placeholder={t("Car Type")}
                options={getOptionsWithAll(modelOptions)}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>
          </div>

          <Item
            name="from_date"
            required={false}
            label={
              <div className="flex gap-2">
                <Checkbox onClick={() => setEnableDate((prev) => !prev)} />
                <div>{t("From Date")}</div>
              </div>
            }
            rules={
              enableDate
                ? [
                    {
                      required: true,
                      message: t("This field is required"),
                    },
                  ]
                : []
            }
          >
            <DatePicker
              className="w-full"
              disabled={!enableDate}
              placeholder={t("From Date")}
            />
          </Item>

          <Item
            name="to_date"
            required={false}
            label={t("To Date")}
            rules={
              enableDate
                ? [
                    {
                      required: true,
                      message: t("This field is required"),
                    },
                  ]
                : []
            }
          >
            <DatePicker
              className="w-full"
              disabled={!enableDate}
              placeholder={t("To Date")}
            />
          </Item>
        </div>

        <div className="flex justify-end">
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            loading={isLoading}
            disabled={isLoading}
            icon={
              <span className="[&_svg]:w-5 [&_svg]:h-5">
                <SearchIcon />
              </span>
            }
          >
            <span>{t("Search")}</span>
          </Button>
        </div>
      </Form>

      <hr />

      <div className="flex justify-end">
        <div className="flex justify-end gap-2 items-center">
          <div className="font-medium">{t("Search:")}</div>
          <Input
            onChange={(e) => setQueryValue(e.target.value)}
            placeholder={t("Search")}
            suffix={
              <div className="w-6 flex items-center justify-end">
                {isSearchLoading && <Spin size="small" />}
              </div>
            }
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table
          bordered
          rowId="id"
          loading={isLoading}
          dataSource={filteredData}
          className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
          pagination={{
            pageSize: 10,
            hideOnSinglePage: true,
            pageSizeOptions: [10, 25, 50, 100],
            showTotal: (total, range) =>
              `Showing ${range[0]}-${range[1]} of ${total} data`,
          }}
          columns={[
            {
              title: t("Action"),
              dataIndex: "action",
              render: (_, item) => (
                <Button
                  size="small"
                  type="primary"
                  icon={<SearchIcon />}
                  onClick={() => setJobCardDetails(item)}
                />
              ),
            },
            {
              title: t("Job Card"),
              dataIndex: "job_no",
              sorter: (a, b) => Number(a.job_no) - Number(b.job_no),
            },
            {
              title: t("Customer Name"),
              dataIndex: "cust_name",
              sorter: (a, b) => a.cust_name.localeCompare(b.cust_name),
            },
            {
              title: t("Agency"),
              dataIndex: "agency",
              sorter: (a, b) => a.agency.localeCompare(b.agency),
            },
            {
              title: t("View"),
              dataIndex: "view",
              sorter: (a, b) => a.view.localeCompare(b.view),
            },
            {
              title: t("Type"),
              dataIndex: "type",
              sorter: (a, b) => a.type.localeCompare(b.type),
            },
            {
              title: t("Model"),
              dataIndex: "model",
              sorter: (a, b) => a.model.localeCompare(b.model),
            },
            {
              title: t("Color"),
              dataIndex: "color",
              sorter: (a, b) => a.color.localeCompare(b.color),
            },
            {
              title: t("Plate No"),
              dataIndex: "plate_no",
              sorter: (a, b) => a.plate_no.localeCompare(b.plate_no),
            },
            {
              title: t("Phone"),
              dataIndex: "phone",
              sorter: (a, b) => a.phone.localeCompare(b.phone),
            },
            {
              title: t("Entry"),
              dataIndex: "entry_date",
              sorter: (a, b) => a.entry_date.localeCompare(b.entry_date),
            },
            {
              title: t("Remaining Balance"),
              dataIndex: "balance",
              sorter: (a, b) => Number(a.balance) - Number(b.balance),
            },
            {
              title: t("Status"),
              dataIndex: "status",
              sorter: (a, b) => a.status.localeCompare(b.status),
              render: (status) => (
                <div className="capitalize">
                  {String(status).split("_").join(" ")}
                </div>
              ),
            },
          ]}
        />
      </div>

      {isCompletedJobCardOpen && (
        <CompletedJobCard
          onClose={() => setJobCardDetails(null)}
          jobId={jobCardDetails?.id}
          open
        />
      )}

      {isActiveJobCardOpen && (
        <ActiveJobCard
          onClose={() => setJobCardDetails(null)}
          data={jobCardDetails}
          open
        />
      )}
    </Modal>
  );
}
