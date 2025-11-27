import { Form, Select } from "antd";

const { Item } = Form;

export function SearchForm({ t, employees, employeeLoading, form }) {
  return (
    <div className="pt-4">
      <Form layout="vertical" form={form}>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
          <Item name="selectedEmployee" label={t("ID")}>
            <Select
              showSearch
              loading={employeeLoading}
              placeholder={t("Search ID")}
              options={employees.map((item) => ({
                value: item.id,
                label: item.unique_code,
              }))}
            />
          </Item>

          <Item name="selectedEmployee" label={t("Name")}>
            <Select
              showSearch
              loading={employeeLoading}
              placeholder={t("Search Name")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              options={employees.map((item) => ({
                value: item.id,
                label: item.name,
              }))}
            />
          </Item>
        </div>
      </Form>
    </div>
  );
}
