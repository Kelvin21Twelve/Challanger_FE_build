import dayjs from "dayjs";
import { Form, Select, Input, DatePicker } from "antd";

import { useSyncDbQuery } from "@/queries";

const { Item } = Form;

export function EmployeeForm({
  t,
  form,
  onSubmit,
  isFormLock,
  hasSelectedEmployee,
}) {
  const { data: visaTypes, isLoading: visaTypesLoading } =
    useSyncDbQuery("VisaType");

  const { data: nationality, isLoading: nationalityLoading } =
    useSyncDbQuery("Nationality");

  const { data: jobTitles, isLoading: jobTitleLoading } =
    useSyncDbQuery("JobTitle");

  return (
    <div className="grow">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        disabled={isFormLock}
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-0">
          <Item name="id" hidden />
          <Item
            label={t("ID")}
            name="unique_code"
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("ID")} />
          </Item>
          <Item
            name="name"
            label={t("Name")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Name")} />
          </Item>
          <Item
            name="name_in_arabic"
            label={t("Name in Arabic")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Name in Arabic")} />
          </Item>
          <Item
            name="civil_id"
            label={t("Civil ID")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Civil ID")} />
          </Item>
          <Item
            name="dob"
            label={t("DOB")}
            dependencies={["join_date"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("DOB cannot be greater or equal to join date"),
                validator: (_, dob) => {
                  let joinDate = form.getFieldValue("join_date");

                  if (!!dob && !!joinDate) {
                    dob = dayjs(dob).format("YYYY-MM-DD");
                    const joinDate2 = dayjs(joinDate).format("YYYY-MM-DD");

                    const isSame = dayjs(joinDate2).isSame(dob);
                    const isAfter = dayjs(dob).isAfter(joinDate2);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker
              className="w-full"
              placeholder={t("DOB")}
              disabledDate={(current) =>
                current && current.valueOf() > Date.now()
              }
            />
          </Item>
          <Item
            name="job_title"
            label={t("Job Title")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              loading={jobTitleLoading}
              placeholder={t("Job Title")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              options={jobTitles?.data?.map((item) => ({
                value: String(item.id),
                label: item.job_title,
              }))}
            />
          </Item>
          <Item
            name="join_date"
            label={t("Join Date")}
            dependencies={["dob"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("DOB cannot be greater or equal to join date"),
                validator: (_, joinDate) => {
                  let dob = form.getFieldValue("dob");

                  if (!!dob && !!joinDate) {
                    const dob2 = dayjs(dob).format("YYYY-MM-DD");
                    joinDate = dayjs(joinDate).format("YYYY-MM-DD");

                    const isSame = dayjs(joinDate).isSame(dob2);
                    const isAfter = dayjs(dob2).isAfter(joinDate);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker className="w-full" placeholder={t("Join Date")} />
          </Item>
          <Item
            name="nationality"
            label={t("Nationality")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              loading={nationalityLoading}
              placeholder={t("Nationality")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              options={
                nationality?.data?.map((item) => ({
                  label: item.nationality,
                  value: String(item.id),
                })) || []
              }
            />
          </Item>
          <Item
            name="salary"
            label={t("Salary")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input
              placeholder={t("Salary")}
              type="number"
              step={0.01}
              min={0}
              onKeyDown={(e) =>
                ["+", "-", "e"].includes(e.key) && e.preventDefault()
              }
            />
          </Item>
          <Item
            name="email"
            label={t("Email")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Email")} />
          </Item>

          {!hasSelectedEmployee && (
            <Item
              name="password"
              label={t("Password")}
              rules={[{ required: true, message: t("This field is required") }]}
            >
              <Input
                type="password"
                autoComplete="off"
                placeholder={t("Password")}
              />
            </Item>
          )}

          <Item
            name="visa_type"
            label={t("Visa Type")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Select
              showSearch
              placeholder={t("Visa Type")}
              filterOption={(input = "", { label = "" } = {}) =>
                String(label)
                  .toLowerCase()
                  .includes(String(input).toLowerCase())
              }
              options={visaTypes?.data?.map((item) => ({
                label: item.visa_type,
                value: String(item.id),
              }))}
              loading={visaTypesLoading}
            />
          </Item>

          <Item
            name="visa_start"
            label={t("Visa Start")}
            dependencies={["visa_end"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Date cannot be greater or equal then end date"),
                validator: (_, startDate) => {
                  let endDate = form.getFieldValue("visa_end");

                  if (!!startDate && !!endDate) {
                    endDate = endDate.format("YYYY-MM-DD");
                    const startDate2 = startDate.format("YYYY-MM-DD");
                    const isAfter = dayjs(startDate2).isAfter(endDate);
                    const isSame = dayjs(startDate2).isSame(endDate);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker className="w-full" placeholder={t("Visa Start")} />
          </Item>
          <Item
            name="visa_end"
            label={t("Visa End")}
            dependencies={["visa_start"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Date can not be less or equal then start date"),
                validator: (_, endDate) => {
                  let startDate = form.getFieldValue("visa_start");

                  if (!!startDate && !!endDate) {
                    startDate = startDate.format("YYYY-MM-DD");
                    const endDate2 = endDate.format("YYYY-MM-DD");
                    const isAfter = dayjs(startDate).isAfter(endDate2);
                    const isSame = dayjs(startDate).isSame(endDate2);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker className="w-full" placeholder={t("Visa End")} />
          </Item>
          <Item
            name="pass_no"
            label={t("Pass No")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <Input placeholder={t("Pass No")} />
          </Item>
          <Item
            name="pass_start"
            label={t("Pass Start")}
            dependencies={["pass_end"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Date cannot be greater or equal then end date"),
                validator: (_, startDate) => {
                  let endDate = form.getFieldValue("pass_end");

                  if (!!startDate && !!endDate) {
                    endDate = endDate.format("YYYY-MM-DD");
                    const startDate2 = startDate.format("YYYY-MM-DD");
                    const isAfter = dayjs(startDate2).isAfter(endDate);
                    const isSame = dayjs(startDate2).isSame(endDate);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker className="w-full" placeholder={t("Pass Start")} />
          </Item>
          <Item
            name="pass_end"
            label={t("Pass End")}
            dependencies={["pass_start"]}
            rules={[
              { required: true, message: t("This field is required") },
              {
                message: t("Date can not be less or equal then start date"),
                validator: (_, endDate) => {
                  let startDate = form.getFieldValue("pass_start");

                  if (!!startDate && !!endDate) {
                    startDate = startDate.format("YYYY-MM-DD");
                    const endDate2 = endDate.format("YYYY-MM-DD");
                    const isAfter = dayjs(startDate).isAfter(endDate2);
                    const isSame = dayjs(startDate).isSame(endDate2);

                    if (isAfter || isSame) return Promise.reject(new Error(""));
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <DatePicker className="w-full" placeholder={t("Pass End")} />
          </Item>
        </div>
      </Form>
    </div>
  );
}
