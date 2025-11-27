import { Table, Input } from "antd";
import { useTranslations } from "next-intl";

import FiledSet from "@/components/FiledSet";

export default function Labours({ data, total }) {
  const t = useTranslations("modals");

  return (
    <FiledSet label={t("Labours")}>
      <div className="py-1">
        <Table
          bordered
          rowId="id"
          className="border-[#dfe0e1] max-w-full overflow-x-auto"
          columns={[
            {
              dataIndex: "labour_name",
              key: "labour_name",
              title: "Item Name",
              sorter: (a, b) =>
                String(a.labour_name).localeCompare(b.labour_name),
            },
            {
              dataIndex: "quantity",
              title: "Quantity",
              key: "quantity",
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
          pagination={{
            hideOnSinglePage: true,
          }}
        />

        <div className="flex justify-end pt-6">
          <div className="flex items-center gap-2">
            <div className="whitespace-nowrap font-semibold">{t("Total:")}</div>
            <Input disabled size="large" value={total} />
          </div>
        </div>
      </div>
    </FiledSet>
  );
}
