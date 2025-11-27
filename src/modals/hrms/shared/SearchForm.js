import { useTranslations } from "next-intl";
import { Form, DatePicker, Button } from "antd";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { SearchIcon } from "@/assets/icons";

const { Item, useForm } = Form;

export function SearchForm({ onSubmit, onReset }) {
  const t = useTranslations("modals");
  const [form] = useForm();

  return (
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-3 items-start sm:gap-6">
        <div className="grow">
          <Item
            name="start_date"
            label={t("From Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("From Date")}
            />
          </Item>
        </div>

        <div className="grow">
          <Item
            name="end_date"
            label={t("To Date")}
            rules={[{ required: true, message: t("This field is required") }]}
          >
            <DatePicker
              size="large"
              className="w-full"
              placeholder={t("To Date")}
            />
          </Item>
        </div>

        <div className="inline-flex gap-2 pt-8">
          <Button
            size="small"
            type="primary"
            htmlType="submit"
            className="[&_svg]:w-[20px]"
          >
            <SearchIcon />
          </Button>
          <Button
            danger
            size="small"
            type="primary"
            htmlType="button"
            onClick={() => {
              form.resetFields();
              onReset();
            }}
            className="[&_svg]:w-[20px]"
          >
            <FontAwesomeIcon icon={faX} />
          </Button>
        </div>
      </div>
    </Form>
  );
}
