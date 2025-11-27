"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button, Typography, Form, Select } from "antd";

import { useSearchPayroll } from "@/queries";

const { Title } = Typography;
const { Item } = Form;

export default function Page() {
  const t = useTranslations("generate-payroll");
  const { mutate, isPending, isSuccess, isError } = useSearchPayroll();
  const isLoading = isPending && !isSuccess && !isError;

  const [yearOptions, setYearOptions] = useState([]);

  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const startYear = currentYear - 8;
    const endYear = currentYear + 8;

    const options = [];
    for (let i = startYear; i <= endYear; i++)
      options.push({ label: i, value: i });

    setYearOptions(options);
  }, []);

  return (
    <div>
      <Title level={2}>{t("Manage Payroll")}</Title>
      <hr />
      <Form layout="vertical" onFinish={mutate}>
        <div className="flex flex-wrap gap-2 md:gap-4">
          <Item
            name="year"
            label={t("Year")}
            rules={[{ required: true, message: t("This field is required!") }]}
          >
            <Select
              showSearch
              className="min-w-40"
              options={yearOptions}
              placeholder={t("Select Year")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
            />
          </Item>

          <Item
            name="month"
            label={t("Month")}
            rules={[{ required: true, message: t("This field is required!") }]}
          >
            <Select
              showSearch
              className="min-w-40"
              options={Array.from({ length: 12 }, (_, i) => ({
                label: i + 1,
                value: i + 1,
              }))}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              placeholder={t("Select Year")}
            />
          </Item>

          <div className="pt-7">
            <Button
              size="small"
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {t("Generate")}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}
