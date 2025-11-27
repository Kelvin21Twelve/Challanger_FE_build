"use client";

import { useTranslations } from "next-intl";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Select, Modal, Form, Input, Spin } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

import CreateEditMake from "@/modals/settings/CreateEditMake";
import CreateEditModel from "@/modals/settings/CreateEditModal";
import CreateEditColor from "@/modals/settings/CreateEditColor";
import CreateEditAgency from "@/modals/settings/CreateEditAgency";
import CreateEditEngineType from "@/modals/settings/CreateEditEngineType";

const { TextArea } = Input;
const { Item, useForm, useWatch } = Form;

export default function CreateCar({
  open,
  dataId,
  onClose,
  parentData,
  refetchCars,
  setResponse,
  isReadOnly = false,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const selectedYear = useWatch("model", form);
  const selectedMake = useWatch("car_view", form);
  const selectedModel = useWatch("car_type", form);

  const isEdit = !!dataId;

  const { data: agencies, isLoading: agencyLoading } = useSyncDbQuery("Agency");
  const { data: vehicles, isLoading: vehicleLoading } =
    useSyncDbQuery("Vehicle");
  const { data: carMakes, isLoading: makeLoading } = useSyncDbQuery("CarMake");
  const { data: carModels, isLoading: modelsLoading } =
    useSyncDbQuery("CarModel");
  const { data: customers, isLoading: customerLoading } =
    useSyncDbQuery("Customer");
  const { data: carColors, isLoading: colorsLoading } =
    useSyncDbQuery("CarColor");
  const { data: carEngines, isLoading: engineLoading } =
    useSyncDbQuery("CarEngine");

  const isCommonLoading =
    agencyLoading ||
    vehicleLoading ||
    makeLoading ||
    modelsLoading ||
    customerLoading ||
    colorsLoading ||
    engineLoading;

  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: insertUpdateResponse,
  } = useCommonInsertUpdate("car", "Vehicle");
  const isLoading = isPending && !isSuccess && !isError;

  const [years, setYears] = useState([]);
  const [makeDialogOpen, setMakeDialogOpen] = useState(false);
  const [colorDialogOpen, setColorDialogOpen] = useState(false);
  const [modelDialogOpen, setModelDialogOpen] = useState(false);
  const [agencyDialogOpen, setAgencyDialogOpen] = useState(false);
  const [engineTypeDialogOpen, setEngineTypeDialogOpen] = useState(false);

  const handleFinish = (values) => {
    const payload = {
      ...values,
      car_model_year: values.model,
    };

    mutate(payload);
  };

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const handleSetResponse = useCallback(
    (item, formKey, itemKey) =>
      setTimeout(
        () => form.setFieldValue(formKey, String(item[itemKey] || "")),
        500,
      ),
    [form],
  );

  const getTitle = () => {
    if (isEdit) return isReadOnly ? t("View Car") : t("Edit Car");
    return t("Create Car");
  };

  const filteredCarModels = useMemo(
    () => carModels?.data?.filter((item) => item.make == selectedMake) || [],
    [carModels, selectedMake],
  );

  const filteredCarEngine = useMemo(
    () =>
      carEngines?.data?.filter(
        (item) => item.model == selectedModel && item.make == selectedMake,
      ) || [],
    [carEngines, selectedMake, selectedModel],
  );

  useEffect(() => {
    if (isCommonLoading) return;
    if (!dataId) return;

    const item = vehicles?.data?.find((item) => item.id == dataId);
    if (item) form.setFieldsValue(item);
  }, [carModels?.data, dataId, form, isCommonLoading, vehicles]);

  useEffect(() => {
    if (isCommonLoading) return;
    if (!selectedModel) return;

    const item =
      filteredCarModels?.find((item) => item.id == selectedModel) || [];

    if (!item) return;

    const years = [];

    const { from_model_year, to_model_year } = item || {};
    const from_year = Number(from_model_year);
    const to_year = Number(to_model_year);

    if (from_year && to_year) {
      const minValue = Math.min(from_year, to_year);
      const maxValue = Math.max(from_year, to_year);
      for (let i = minValue; i <= maxValue; i++) years.push(i);
    } else {
      if (to_year) years.push(to_year);
      if (from_year) years.push(from_year);
    }

    const finalYearsArray = Array.from(new Set(years));
    setYears(finalYearsArray);

    const hasSelectedYearInDropdown = !!finalYearsArray.find(
      (item) => item == selectedYear,
    );

    if (!hasSelectedYearInDropdown) form.setFieldValue("model");
  }, [filteredCarModels, form, isCommonLoading, selectedModel, selectedYear]);

  useEffect(() => {
    if (isCommonLoading) return;
    if (!selectedModel) return;

    const item = filteredCarModels.find((item) => item.id == selectedModel);
    if (!item) form.setFieldValue("car_type");
  }, [filteredCarModels, form, isCommonLoading, selectedMake, selectedModel]);

  useEffect(() => {
    if (isCommonLoading) return;
    if (!selectedMake || !selectedModel) return;

    const item = filteredCarEngine.find(
      (item) => item.make == selectedMake && item.model == selectedModel,
    );

    if (!item) form.setFieldValue("car_engine");
  }, [filteredCarEngine, form, selectedModel, selectedMake, isCommonLoading]);

  useEffect(() => {
    const { success, data } = insertUpdateResponse || {};

    if (success) {
      setResponse?.(data);
      refetchCars?.();
      handleClose();
    }
  }, [handleClose, insertUpdateResponse, refetchCars, setResponse]);

  useEffect(() => {
    if (parentData) form.setFieldsValue(parentData);
  }, [form, parentData]);

  return (
    <Modal
      onCancel={handleClose}
      width={{ xl: "80%" }}
      title={getTitle()}
      open={open}
      footer={[
        !isReadOnly ? (
          <Button
            key="submit"
            type="primary"
            htmlType="button"
            disabled={isLoading}
            onClick={() => form.submit()}
          >
            {t("Submit")}
          </Button>
        ) : null,
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <div className="relative">
        <Form form={form} layout="vertical" onFinish={handleFinish}>
          <Item name="id" hidden />
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-0">
            <div className="flex flex-col">
              <div className="flex items-start gap-3">
                <Item
                  name="car_view"
                  className="grow"
                  label={t("Vehicle Make")}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Select
                    showSearch
                    allowClear
                    options={
                      carMakes?.data?.map(({ id, make }) => ({
                        label: make,
                        value: String(id),
                      })) || []
                    }
                    filterOption={(input = "", { label = "" } = {}) =>
                      String(label)
                        .toLowerCase()
                        .includes(String(input).toLowerCase())
                    }
                    disabled={isReadOnly}
                    placeholder={t("Vehicle Make")}
                  />
                </Item>
                <Button
                  size="small"
                  type="primary"
                  className="mt-7 w-9"
                  disabled={isReadOnly}
                  onClick={() => setMakeDialogOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <div className="flex items-start gap-3">
                <Item
                  name="car_type"
                  className="grow"
                  label={t("Vehicle Model")}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Select
                    showSearch
                    className="grow"
                    disabled={isReadOnly}
                    placeholder={t("Vehicle Model")}
                    options={
                      filteredCarModels.map(({ id, model }) => ({
                        label: model,
                        value: String(id),
                      })) || []
                    }
                    filterOption={(input = "", { label = "" } = {}) =>
                      String(label)
                        .toLowerCase()
                        .includes(String(input).toLowerCase())
                    }
                  />
                </Item>
                <Button
                  size="small"
                  type="primary"
                  className="mt-7 w-9"
                  disabled={isReadOnly}
                  onClick={() => setModelDialogOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <Item
                name="model"
                label={t("Vehicle Year")}
                rules={[
                  { required: true, message: t("This field is required") },
                ]}
              >
                <Select
                  showSearch
                  options={years.map((item) => ({
                    label: item,
                    value: item,
                  }))}
                  disabled={isReadOnly}
                  placeholder={t("Vehicle Year")}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                />
              </Item>

              <div className="flex items-start gap-3">
                <Item
                  className="grow"
                  name="car_engine"
                  label={t("Vehicle Engine Type")}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Select
                    showSearch
                    options={
                      filteredCarEngine.map(({ id, engine_type }) => ({
                        label: engine_type,
                        value: String(id),
                      })) || []
                    }
                    className="grow"
                    disabled={isReadOnly}
                    placeholder={t("Vehicle Engine Type")}
                    filterOption={(input = "", { label = "" } = {}) =>
                      String(label)
                        .toLowerCase()
                        .includes(String(input).toLowerCase())
                    }
                  />
                </Item>
                <Button
                  size="small"
                  type="primary"
                  className="mt-7 w-9"
                  disabled={isReadOnly}
                  onClick={() => setEngineTypeDialogOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <div className="flex items-start gap-3">
                <Item
                  name="car_make"
                  className="grow"
                  label={t("Vehicle Agency")}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Select
                    showSearch
                    options={
                      agencies?.data?.map(({ id, agency }) => ({
                        label: agency,
                        value: String(id),
                      })) || []
                    }
                    className="grow"
                    disabled={isReadOnly}
                    placeholder={t("Vehicle Agency")}
                    filterOption={(input = "", { label = "" } = {}) =>
                      String(label)
                        .toLowerCase()
                        .includes(String(input).toLowerCase())
                    }
                  />
                </Item>
                <Button
                  size="small"
                  type="primary"
                  className="mt-7 w-9"
                  disabled={isReadOnly}
                  onClick={() => setAgencyDialogOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>
            </div>

            <div className="flex flex-col">
              <div className="flex items-start gap-3">
                <Item
                  name="car_color"
                  className="grow"
                  label={t("Vehicle Color")}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Select
                    showSearch
                    options={
                      carColors?.data?.map(({ id, color }) => ({
                        label: color,
                        value: String(id),
                      })) || []
                    }
                    disabled={isReadOnly}
                    placeholder={t("Color")}
                    filterOption={(input = "", { label = "" } = {}) =>
                      String(label)
                        .toLowerCase()
                        .includes(String(input).toLowerCase())
                    }
                  />
                </Item>
                <Button
                  size="small"
                  type="primary"
                  className="mt-7 w-9"
                  disabled={isReadOnly}
                  onClick={() => setColorDialogOpen(true)}
                >
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </div>

              <Item
                name="plate_no"
                label={t("Plate No")}
                rules={[
                  { required: true, message: t("This field is required") },
                ]}
              >
                <Input
                  placeholder={t("Plate No")}
                  disabled={isReadOnly || isEdit}
                />
              </Item>

              <Item
                name="customer"
                label={t("Customer")}
                rules={[
                  { required: true, message: t("This field is required") },
                ]}
              >
                <Select
                  showSearch
                  options={
                    customers?.data?.map(({ id, cust_name }) => ({
                      label: cust_name,
                      value: String(id),
                    })) || []
                  }
                  disabled={isReadOnly}
                  placeholder={t("Customer")}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                />
              </Item>

              <Item name="chasis_no" label={t("Chasis No")}>
                <Input disabled={isReadOnly} placeholder={t("Chasis No")} />
              </Item>

              <Item name="driver_name" label={t("Driver Name")}>
                <Input disabled={isReadOnly} placeholder={t("Driver Name")} />
              </Item>
            </div>

            <div className="flex flex-col">
              <Item name="driver_mobile" label={t("Driver Mobile")}>
                <Input disabled={isReadOnly} placeholder={t("Driver Mobile")} />
              </Item>

              <Item name="note" label={t("Note")}>
                <TextArea
                  rows={3}
                  disabled={isReadOnly}
                  placeholder={t("Note")}
                />
              </Item>
            </div>
          </div>
        </Form>

        {isCommonLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/50 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
      </div>

      <CreateEditMake
        open={makeDialogOpen}
        onClose={() => setMakeDialogOpen(false)}
        setResponse={(data) => handleSetResponse(data, "car_view", "id")}
      />

      <CreateEditModel
        open={modelDialogOpen}
        onClose={() => setModelDialogOpen(false)}
        data={{ make: form.getFieldValue("car_view") }}
        setResponse={(data) => handleSetResponse(data, "car_type", "id")}
      />

      <CreateEditEngineType
        open={engineTypeDialogOpen}
        data={{
          make: form.getFieldValue("car_view"),
          model: form.getFieldValue("car_type"),
        }}
        onClose={() => setEngineTypeDialogOpen(false)}
        setResponse={(data) => handleSetResponse(data, "car_engine", "id")}
      />

      <CreateEditAgency
        open={agencyDialogOpen}
        onClose={() => setAgencyDialogOpen(false)}
        setResponse={(data) => handleSetResponse(data, "car_make", "id")}
      />

      <CreateEditColor
        open={colorDialogOpen}
        onClose={() => setColorDialogOpen(false)}
        setResponse={(data) => handleSetResponse(data, "car_color", "id")}
      />
    </Modal>
  );
}
