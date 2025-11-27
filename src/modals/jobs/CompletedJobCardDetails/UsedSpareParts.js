import { Table, Input } from "antd";
import { useTranslations } from "next-intl";

import FiledSet from "@/components/FiledSet";

export default function UsedSpareParts({ data, total }) {
  const t = useTranslations("modals");

  return (
    <FiledSet label={t("Used Spare Parts")}>
      <div className="py-1">
        <Table
          bordered
          rowId="id"
          className="border-[#dfe0e1] max-w-full overflow-x-auto"
          columns={[
            {
              dataIndex: "item_name",
              title: "Item Name",
              key: "item_name",
              sorter: (a, b) => String(a.item_name).localeCompare(b.item_name),
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
          ].map((item) => ({
            ...item,
            title: t(item.title),
          }))}
          dataSource={data}
          pagination={{ hideOnSinglePage: true }}
        />

        <div className="flex justify-end pt-5">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap font-semibold">{t("Total:")}</div>
            <Input size="large" disabled value={total} />
          </div>
        </div>
      </div>
    </FiledSet>
  );
}
