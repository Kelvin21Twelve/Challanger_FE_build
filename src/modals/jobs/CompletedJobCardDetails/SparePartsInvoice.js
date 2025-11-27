import { Table, Input } from "antd";
import { useTranslations } from "next-intl";

import FiledSet from "@/components/FiledSet";

export default function SparePartsInvoice({ data, total }) {
  const t = useTranslations("modals");

  return (
    <FiledSet label={t("Spare Parts Invoice")}>
      <div className="py-3">
        <Table
          bordered
          rowId="id"
          className="border-[#dfe0e1] max-w-full overflow-x-auto"
          columns={[
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
              sorter: (a, b) => String(a.item).localeCompare(b.item),
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
              sorter: (a, b) => String(a.price).localeCompare(b.price),
            },
            {
              key: "total",
              title: "Total",
              dataIndex: "total",
              sorter: (a, b) => String(a.total).localeCompare(b.total),
            },
          ].map((item) => ({
            ...item,
            title: t(item.title),
          }))}
          dataSource={data}
          pagination={{ hideOnSinglePage: true }}
        />

        <div className="flex justify-end pt-5">
          <div className="flex items-center gap-2">
            <div className="font-bold">{t("Total:")}</div>
            <Input size="large" disabled value={total} />
          </div>
        </div>
      </div>
    </FiledSet>
  );
}
