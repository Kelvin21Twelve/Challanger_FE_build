"use client";

import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { Button, Input, Modal, Form, Select } from "antd";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";

import { SearchIcon } from "@/assets/icons";

import CreateCarModal from "@/modals/cars/CreateCar";
import CreateCustomerModal from "@/modals/customers/CreateCustomer";

import {
  useGetCab,
  useSyncDbQuery,
  useCreateJobCard,
  useSearchCabMutation,
} from "@/queries";

const { Item, useForm, useWatch } = Form;

function SearchForm({ searchCabMutate }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const customerSearchValue = useWatch("customer_search", form);

  const [customerOpen, setCustomerOpen] = useState(false);

  const { data, isLoading: customerLoading } = useSyncDbQuery("Customer");
  const customers = data?.data || [];

  useEffect(() => {
    if (customerSearchValue)
      searchCabMutate({ customer_search: customerSearchValue });
  }, [customerSearchValue, searchCabMutate]);

  const handleFinish = (values) => {
    const { customer_search, phone_search, plate_no_search } = values || {};
    const condition = customer_search || phone_search || plate_no_search;

    if (condition) {
      searchCabMutate(values);
      return;
    }

    Swal.fire({ text: t("Please fill in at least one field") });
  };

  return (
    <div>
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <div className="flex flex-wrap items-start gap-2 sm:gap-x-8">
          <div className="flex items-start gap-2.5">
            <div className="grow">
              <Item
                name="customer_search"
                label={t("Customer")}
                className="w-52 sm:w-72"
              >
                <Select
                  showSearch
                  size="large"
                  loading={customerLoading}
                  placeholder={t("Customer")}
                  options={customers.map(({ cust_name, id }) => ({
                    label: cust_name,
                    value: id,
                  }))}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                />
              </Item>
            </div>

            <Button
              size="small"
              type="primary"
              className="mt-8 w-9"
              disabled={customerLoading}
              onClick={() => setCustomerOpen(true)}
            >
              <FontAwesomeIcon icon={faPlus} />
            </Button>
          </div>

          <Item name="phone_search" label={t("Phone")}>
            <Input placeholder={t("Phone")} size="large" />
          </Item>

          <Item name="plate_no_search" label={t("Plate No")}>
            <Input placeholder={t("Plate No")} size="large" />
          </Item>

          <div className="pt-8">
            <Button type="primary" size="small" htmlType="submit">
              <SearchIcon />
            </Button>
          </div>
        </div>
      </Form>

      <CreateCustomerModal
        open={customerOpen}
        onClose={() => setCustomerOpen(false)}
        setResponse={(data) =>
          setTimeout(() => {
            form.setFieldValue("customer_search", data?.id);
            form.submit();
          }, 500)
        }
      />
    </div>
  );
}

function CreateForm({ form, handleFinish, data, onOpenVehicle }) {
  const t = useTranslations("modals");
  const vehicleId = useWatch("vehicle", form);
  const { id: customerId } = data?.customer || {};

  const { data: carMake } = useSyncDbQuery("CarMake");
  const { data: carAgency } = useSyncDbQuery("Agency");
  const { data: vehicles, isLoading: vehicleLoading } =
    useSyncDbQuery("Vehicle");
  const { data: carColor } = useSyncDbQuery("CarColor");
  const { data: carModel } = useSyncDbQuery("CarModel");
  const { data: carEngine } = useSyncDbQuery("CarEngine");

  const customerVehicles = useMemo(
    () => vehicles?.data?.filter((item) => item.customer == customerId),
    [customerId, vehicles?.data],
  );

  const customerVehicleWithNames = useMemo(
    () =>
      customerVehicles?.map((item) => ({
        ...item,
        car_agency_name: carAgency?.data?.find(
          (agency) => agency.id == item.car_make,
        )?.agency,
        car_engine_type_name: carEngine?.data?.find(
          (engine) => engine.id == item.car_engine,
        )?.engine_type,
        car_make_name: carMake?.data?.find((make) => make.id == item.car_view)
          ?.make,
        car_model_name: carModel?.data?.find(
          (model) => model.id == item.car_type,
        )?.model,
        car_color_name: carColor?.data?.find(
          (color) => color.id == item.car_color,
        )?.color,
      })) || [],
    [carAgency, carColor, carEngine, carMake, carModel, customerVehicles],
  );

  const vehicleOptions = useMemo(
    () =>
      customerVehicleWithNames?.map((item) => ({
        label: `${item.car_make_name} - ${item.car_model_name} - ${item.car_engine_type_name}`,
        value: item.id,
      })) || [],
    [customerVehicleWithNames],
  );

  const { data: availableCabList, isLoading: cabsLoading } = useGetCab("");

  useEffect(() => {
    if (data) {
      const { customer } = data || {};
      const { cust_name, phone, mobile, id } = customer || {};

      form.setFieldValue("customer_id", id);
      form.setFieldValue("customer", cust_name);
      form.setFieldValue("phone", mobile || phone);

      form.setFieldValue("vehicle");
      form.setFieldValue("view", "");
      form.setFieldValue("color", "");
      form.setFieldValue("model", "");
      form.setFieldValue("engine", "");
      form.setFieldValue("agency", "");
      form.setFieldValue("plate_no", "");
      form.setFieldValue("model_year", "");
    }
  }, [data, form]);

  useEffect(() => {
    if (vehicleId) {
      const item = customerVehicleWithNames?.find(
        (item) => item.id == vehicleId,
      );

      if (item) {
        const {
          model,
          plate_no,
          car_make_name,
          car_model_name,
          car_color_name,
          car_agency_name,
          car_engine_type_name,
        } = item || {};

        form.setFieldValue("model_year", model);
        form.setFieldValue("plate_no", plate_no);
        form.setFieldValue("view", car_make_name);
        form.setFieldValue("model", car_model_name);
        form.setFieldValue("color", car_color_name);
        form.setFieldValue("agency", car_agency_name);
        form.setFieldValue("engine", car_engine_type_name);
      }
    }
  }, [customerVehicleWithNames, data, form, vehicleId]);

  useEffect(() => {
    if (Array.isArray(availableCabList) && availableCabList.length > 0) {
      const { cab_no } = availableCabList[0] || {};
      form.setFieldValue("cab_no", cab_no);
    }
  }, [availableCabList, form]);

  return (
    <Form form={form} layout="vertical" onFinish={handleFinish}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 gap-x-8">
        <Item name="view" hidden />
        <Item name="engine" hidden />
        <Item name="customer_id" hidden />

        <Item
          name="cab_no"
          label={t("Cab No")}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Select
            size="large"
            loading={cabsLoading}
            placeholder={t("Cab No")}
            options={
              availableCabList?.map(({ cab_no }) => ({
                label: cab_no,
                value: cab_no,
              })) || []
            }
            filterOption={(input = "", { label = "" } = {}) =>
              String(label).toLowerCase().includes(String(input).toLowerCase())
            }
          />
        </Item>

        <Item name="model" label={t("Modal")}>
          <Input placeholder={t("Modal")} size="large" disabled />
        </Item>

        <Item name="customer" label={t("Customer")}>
          <Input placeholder={t("Customer")} size="large" disabled />
        </Item>

        <Item name="model_year" label={t("Model Year")}>
          <Input placeholder={t("Model Year")} size="large" disabled />
        </Item>

        <Item name="phone" label={t("Phone")}>
          <Input placeholder={t("Phone")} size="large" disabled />
        </Item>

        <Item name="color" label={t("Color")}>
          <Input placeholder={t("Color")} size="large" disabled />
        </Item>

        <div className="flex items-start gap-4">
          <Item
            name="vehicle"
            className="grow"
            label={t("Vehicle")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              size="large"
              loading={vehicleLoading}
              options={vehicleOptions}
              placeholder={t("Vehicle")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>
          <Button
            type="primary"
            className="mt-8"
            onClick={onOpenVehicle}
            disabled={vehicleLoading || !customerId}
          >
            <FontAwesomeIcon icon={faPlus} />
          </Button>
        </div>

        <Item name="plate_no" label={t("Plate No")}>
          <Input placeholder={t("Plate No")} size="large" disabled />
        </Item>

        <Item name="agency" label={t("Agency")}>
          <Input placeholder={t("Agency")} size="large" disabled />
        </Item>

        <Item
          name="kilo_meters"
          label={t("Odometer") + " KM"}
          rules={[{ required: true, message: t("This field is required") }]}
        >
          <Input placeholder={t("Odometer") + " KM"} size="large" />
        </Item>
      </div>
    </Form>
  );
}

export default function CreateJobCard({ open, onClose, onRefetch }) {
  const t = useTranslations("modals");
  const [createCarModal, setCreateCarModal] = useState(false);
  const [form] = useForm();

  const { data: searchResponse, mutate: searchCabMutate } =
    useSearchCabMutation();

  const {
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useCreateJobCard();

  const isLoading = isPending && !isSuccess && !isError;

  const handleFinish = () => {
    const { model, engine, model_year } = form.getFieldsValue() || {};

    mutate({
      ...form.getFieldsValue(),
      type: model,
      model: model_year,
      car_engine: engine,
      status: "under_test",
    });
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (response) {
      const { success, msg } = response || {};

      if (success) {
        onRefetch();
        handleClose();
      } else {
        Swal.fire({ text: msg });
      }
    }
  }, [handleClose, onRefetch, response]);

  const customerData = !!searchResponse?.success ? searchResponse : null;

  return (
    <Modal
      title={t("Create Job Card")}
      onCancel={handleClose}
      open={open}
      width={1024}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          disabled={isLoading}
          onClick={() => form.submit()}
        >
          {t("Submit")}
        </Button>,
        <Button key="search" type="primary" danger onClick={onClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <SearchForm searchCabMutate={searchCabMutate} />

      <hr />

      <CreateForm
        form={form}
        data={customerData}
        handleFinish={handleFinish}
        onOpenVehicle={() => setCreateCarModal(true)}
      />

      <CreateCarModal
        open={createCarModal}
        onClose={() => setCreateCarModal(false)}
        parentData={{ customer: String(customerData?.customer?.id || "") }}
        setResponse={(data) =>
          setTimeout(() => form.setFieldValue("vehicle", data?.id), 500)
        }
      />
    </Modal>
  );
}
