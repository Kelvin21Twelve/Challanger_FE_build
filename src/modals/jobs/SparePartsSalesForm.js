"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  Row,
  Col,
  Form,
  Modal,
  Input,
  Table,
  Select,
  Button,
  DatePicker,
} from "antd";

import { PlusIcon, TrashIcon } from "@/assets/icons/actions";

import { showConfirmBox, useDebounce } from "@/utils";
import {
  useGetCab,
  useJobCardUpdate,
  useGetCabDetails,
  useSparePartsItemInsert,
} from "@/queries";

import AddSparePartsSalesItemModal from "./AddSparePartsSalesItem";

const { TextArea } = Input;
const { Item, useForm, useWatch } = Form;

export default function SparePartsSalesFormModal({
  open,
  onClose,
  onRefetchJobCards,
}) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const cabNoValue = useWatch("cab_no", form);
  const cabNotesValue = useWatch("notes", form);

  const { setQueryValue, debouncedValue } = useDebounce();

  const [selectedItems, setSelectedItems] = useState([]);
  const [addItemFormOpen, setAddItemFormOpen] = useState(false);

  const {
    mutate: submitSpareParts,
    data: response,
    isSuccess,
    isPending,
    isError,
    reset,
  } = useSparePartsItemInsert();

  const { data, isLoading: cabLoading, refetch } = useGetCab(1);
  const { data: cabDetails, isLoading: cabDetailsLoading } =
    useGetCabDetails(cabNoValue);
  const isLoading = isPending && !isSuccess && !isError;

  const selectedCabJobId =
    cabDetails?.user_details?.find((item) => item.cab_no == cabNoValue)?.id ||
    "";

  const {
    mutate: updateJobCard,
    reset: resetUpdateJobCard,
    isSuccess: isUpdatedJobCardSuccess,
  } = useJobCardUpdate(selectedCabJobId);

  const handleFinish = () => {
    const formData = new FormData();
    const formValues = form.getFieldsValue();

    Object.keys({
      ...formValues,
      date: formValues.date.format("YYYY-MM-DD"),
    }).forEach((key) => formData.set(key, formValues[key]));

    selectedItems.forEach(
      (
        { item_code, item_name, quantity, sale_price, total, discount, id },
        index,
      ) => {
        formData.set(`item_data[${index}][sale_price]`, sale_price);
        formData.set(`item_data[${index}][item_code]`, item_code);
        formData.set(`item_data[${index}][item_name]`, item_name);
        formData.set(`item_data[${index}][quantity]`, quantity);
        formData.set(`item_data[${index}][discount]`, discount);
        formData.set(`item_data[${index}][total]`, total);
        formData.set(`item_data[${index}][item_id]`, id);
      },
    );

    submitSpareParts(formData);
  };

  const handleClose = useCallback(() => {
    reset();
    form.resetFields();
    setSelectedItems([]);
    onClose();
  }, [form, onClose, reset]);

  const handleAddNewTableItem = (item) => {
    setSelectedItems((prev) => [...prev, item]);
    setAddItemFormOpen(false);
  };

  useEffect(() => {
    if (cabDetails) {
      const { user_details } = cabDetails || {};

      if (Array.isArray(user_details)) {
        user_details.forEach((item) => form.setFieldsValue(item));
      }
    }
  }, [cabDetails, form]);

  const total = selectedItems.reduce(
    (acc, { total }) => acc + Number(total),
    0,
  );

  const handleSubmit = () => {
    if (selectedItems.length === 0) {
      Swal.fire({ text: t("Please add at least one item") });
      return;
    }

    form.submit();
  };

  useEffect(() => {
    const { success } = response || {};
    if (success) handleClose();
  }, [handleClose, response]);

  useEffect(() => {
    setQueryValue(cabNotesValue);
  }, [cabNotesValue, setQueryValue]);

  useEffect(() => {
    if (selectedCabJobId && debouncedValue) {
      resetUpdateJobCard();
      updateJobCard({ notes: debouncedValue });
    }
  }, [debouncedValue, resetUpdateJobCard, selectedCabJobId, updateJobCard]);

  useEffect(() => {
    if (isUpdatedJobCardSuccess) onRefetchJobCards?.();
  }, [isUpdatedJobCardSuccess, onRefetchJobCards]);

  useEffect(() => {
    if (open) refetch();
  }, [open, refetch]);

  return (
    <Modal
      title={t("Spare Parts Sales Form")}
      onCancel={handleClose}
      open={open}
      width={{
        lg: "70%",
      }}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          disabled={isLoading}
          onClick={() => handleSubmit()}
        >
          {t("Submit")}
        </Button>,
        <Button key="search" type="primary" danger onClick={onClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ date: dayjs(), notes: "" }}
      >
        <Row gutter={[24, 8]}>
          <Col xs={24} sm={12} md={6}>
            <Item name="id" hidden />

            <Item
              name="date"
              label={t("Date")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <DatePicker className="w-full" />
            </Item>

            <Item
              name="cab_no"
              label={t("Cab No")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Select
                showSearch
                allowClear
                placeholder={t("Cab No")}
                loading={cabLoading || cabDetailsLoading}
                options={data?.map((item) => ({
                  value: item.cab_no,
                  label: item.cab_no,
                }))}
                filterOption={(input = "", { label = "" } = {}) =>
                  String(label)
                    .toLowerCase()
                    .includes(String(input).toLowerCase())
                }
              />
            </Item>

            <Item
              name="view"
              label={t("Car View")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Car View")} disabled />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Item
              name="type"
              label={t("Car Type")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Car Type")} disabled />
            </Item>

            <Item
              name="customer"
              label={t("Customer")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Customer")} disabled />
            </Item>

            <Item
              name="color"
              label={t("Car Color")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Car Color")} disabled />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Item
              name="model"
              label={t("Car Model")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Car Model")} disabled />
            </Item>

            <Item
              name="plate_no"
              label={t("Plate No")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Plate No")} disabled />
            </Item>

            <Item
              name="type"
              label={t("Type")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input placeholder={t("Type")} disabled />
            </Item>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Item name="notes" label={t("Note")}>
              <TextArea rows={4} placeholder={t("Note")} />
            </Item>

            <Item name="requested_parts" label={t("Requested Parts")}>
              <TextArea placeholder={t("Requested Parts")} disabled />
            </Item>
          </Col>
        </Row>
      </Form>

      <hr />

      <div className="flex justify-end">
        <Button
          size="small"
          type="primary"
          icon={
            <div className="pt-0.5">
              <PlusIcon />
            </div>
          }
          onClick={() => setAddItemFormOpen(true)}
        >
          {t("Add New Item")}
        </Button>
      </div>

      <Table
        bordered
        rowKey="uid"
        pagination={false}
        dataSource={selectedItems}
        className="mt-3 border-[#dfe0e1] max-w-full overflow-x-auto"
        columns={[
          {
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            title: "Item",
            dataIndex: "item_name",
            sorter: (a, b) => String(a.item_name).localeCompare(b.item_name),
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
            sorter: (a, b) => String(a.quantity).localeCompare(b.quantity),
          },
          {
            title: "Price",
            dataIndex: "sale_price",
            sorter: (a, b) => String(a.sale_price).localeCompare(b.sale_price),
          },
          {
            title: "Discount",
            dataIndex: "discount",
            sorter: (a, b) => String(a.discount).localeCompare(b.discount),
          },
          {
            title: "Total",
            dataIndex: "total",
            sorter: (a, b) => String(a.total).localeCompare(b.total),
          },
          {
            width: 100,
            title: "Action",
            dataIndex: "engine_type",
            render: (_, record) => (
              <Button
                danger
                size="small"
                type="primary"
                icon={<TrashIcon />}
                onClick={() =>
                  showConfirmBox().then(
                    ({ isConfirmed }) =>
                      isConfirmed &&
                      setSelectedItems((prev) =>
                        prev.filter((item) => item.uid != record.uid),
                      ),
                  )
                }
              />
            ),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
      />

      <div className="flex justify-end pt-4">
        <div className="inline-flex items-center gap-2">
          <div className="font-bold">{t("Total:")}</div>
          <Input size="large" disabled value={total} />
        </div>
      </div>

      <AddSparePartsSalesItemModal
        open={addItemFormOpen}
        onAddNew={handleAddNewTableItem}
        onClose={() => setAddItemFormOpen(false)}
      />
    </Modal>
  );
}
