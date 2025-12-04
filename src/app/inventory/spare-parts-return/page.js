"use client";

import dayjs from "dayjs";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Typography, Table, Input, Form, DatePicker } from "antd";

import { useTableSearch, showTotal } from "@/utils";
import { useSoldSparePartsToReturn, useSparePartsToReturn } from "@/queries";

import { SearchBar } from "@/components/SearchBar";

import SparePartsReturnForm from "@/modals/inventory/SparePartsReturnForm";
import SparePartsSalesSearchFormModal from "@/modals/inventory/SparePartsSalesSearchForm";

const { Title } = Typography;
const { Item, useForm } = Form;

function DetailsForm({ form }) {
  const t = useTranslations("spare-parts-return");

  return (
    <div className="py-5">
      <Form form={form} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div>
            <Item label={t("Date")} name="created_at">
              <DatePicker className="!w-full" placeholder={t("Date")} />
            </Item>
          </div>
          <div>
            <Item label={t("Customer")} name="customer">
              <Input placeholder={t("Customer")} />
            </Item>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div>
            <Item label={t("Inv No")} name="id">
              <Input placeholder={t("Inv No")} />
            </Item>
          </div>
          <div>
            <Item label={t("Car Color")} name="color">
              <Input placeholder={t("Car Color")} />
            </Item>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div>
            <Item label={t("Car View")} name="view">
              <Input placeholder={t("Car View")} />
            </Item>
          </div>
          <div>
            <Item label={t("Car Modal")} name="model">
              <Input placeholder={t("Car Modal")} />
            </Item>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <div>
            <Item label={t("Car Type")} name="type">
              <Input placeholder={t("Car Type")} />
            </Item>
          </div>
          <div>
            <Item label={t("Plate No")} name="plate_no">
              <Input placeholder={t("Plate No")} />
            </Item>
          </div>
        </div>
      </Form>
    </div>
  );
}

export default function Page() {
  const t = useTranslations("spare-parts-return");
  const [form] = useForm();

  const { mutate, data, reset } = useSparePartsToReturn();
  const { details, data: array } = data || {};
  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch([
      "job_id",
      "item_code",
      "item",
      "quantity",
      "price",
      "discount",
      "total",
    ]);

  const { mutate: mutateReport, data: response } = useSoldSparePartsToReturn();
  const { success } = response || {};

  const [isSparePartsSalesSearchFormOpen, setIsSparePartsSalesSearchFormOpen] =
    useState(false);
  const [isSparePartsReturnFormOpen, setIsSparePartsReturnFormOpen] =
    useState(false);

  const handleSave = () => {
    if (!details && !(array?.length > 0)) {
      Swal.fire({ text: t("Please select items to return") });
      return;
    }

    mutateReport(array);
  };

  useEffect(() => {
    if (details)
      form.setFieldsValue({
        ...details,
        created_at: dayjs(details?.created_at),
      });
    else form.setFieldsValue();
  }, [details, form]);

  useEffect(() => {
    if (success) reset();
  }, [reset, success]);

  useEffect(() => {
    setRecords(array || []);
  }, [array, setRecords]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Spare Parts Return Form")}</Title>

        <div className="flex flex-wrap items-center gap-0.5">
          <Button
            type="primary"
            onClick={handleSave}
            className="!bg-[#ffc107] !rounded-tr-none !rounded-br-none !shadow-none"
          >
            <FontAwesomeIcon icon={faSave} className="!h-5" />
          </Button>

          <Button
            type="primary"
            className="!bg-[#6c757d] !rounded-none"
            onClick={() => setIsSparePartsSalesSearchFormOpen(true)}
          >
            {t("Spare Parts Sales Search Form")}
          </Button>

          <Button
            type="primary"
            className="!bg-[#6c757d] !rounded-none"
            onClick={() => setIsSparePartsReturnFormOpen(true)}
          >
            {t("Spare Parts Return Form")}
          </Button>
        </div>
      </div>

      <DetailsForm form={form} />

      <div className="border-b mb-10 border-[#0000001a]" />

      <SearchBar
        setQueryValue={setQueryValue}
        isSearchLoading={isSearchLoading}
      />

      <Table
        bordered
        rowId="id"
        className="mt-3 border-[#dfe0e1] overflow-x-auto w-full"
        columns={[
          {
            key: "job_id",
            title: "Invoice No",
            dataIndex: "job_id",
            sorter: (a, b) => String(a.job_id).localeCompare(b.job_id),
          },
          {
            key: "item_code",
            title: "Item Code",
            dataIndex: "item_code",
            sorter: (a, b) => String(a.item_code).localeCompare(b.item_code),
          },
          {
            key: "item",
            title: "Item",
            dataIndex: "item",
            sorter: (a, b) =>
              String(a?.item_name || a.item || "-").localeCompare(
                b?.item_name || b.item || "-",
              ),
            render: (_, item) => item?.item_name || item.item || "-",
          },
          {
            key: "quantity",
            title: "Quantity",
            dataIndex: "quantity",
            sorter: (a, b) => String(a.quantity).localeCompare(b.quantity),
          },
          {
            key: "price",
            title: "Price",
            dataIndex: "price",
            sorter: (a, b) => Number(a.price) - Number(b.price),
          },
          {
            key: "discount",
            title: "Discount",
            dataIndex: "discount",
            sorter: (a, b) => String(a.discount).localeCompare(b.discount),
          },
          {
            key: "total",
            title: "Total",
            dataIndex: "total",
            sorter: (a, b) => Number(a.total).localeCompare(b.total),
          },
        ].map((item) => ({
          ...item,
          title: t(item.title),
        }))}
        dataSource={filteredData || []}
        pagination={{
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
          showTotal,
        }}
      />

      <SparePartsSalesSearchFormModal
        onClose={() => setIsSparePartsSalesSearchFormOpen(false)}
        open={isSparePartsSalesSearchFormOpen}
        onAddItem={(item) => mutate(item)}
      />

      <SparePartsReturnForm
        open={isSparePartsReturnFormOpen}
        onClose={() => setIsSparePartsReturnFormOpen(false)}
      />
    </div>
  );
}
