import { Input, Form, Button } from "antd";
import { useTranslations } from "next-intl";

import { useJobCardUpdate } from "@/queries/useJobCardUpdate";

import FiledSet from "@/components/FiledSet";

const { Item, useForm } = Form;

export default function ActionContainer({ data, isAccounting }) {
  const [form] = useForm();
  const t = useTranslations("modals");
  const {
    notes: previousNotes,
    delivery_date,
    applied_desc,
    returned,
    warranty,
  } = data;

  const { mutate, isError, isSuccess, isPending } = useJobCardUpdate(data?.id);
  const isLoading = isPending && !isSuccess && !isError;

  const handleSubmit = ({ notes }) => {
    let modifiedNotes = `\nAccounting Notes (${new Date().toDateString()}):\n`;
    modifiedNotes += notes || "";
    modifiedNotes += "\n------------------\n";
    modifiedNotes += previousNotes || "";

    const payload = {
      notes: modifiedNotes,
      status: "on_change",
    };

    mutate(payload);
  };

  return (
    <FiledSet>
      <div>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-0 gap-x-6">
            <Item label={t("Discount")}>
              <Input disabled value={applied_desc} />
            </Item>

            <Item label={t("Warranty")}>
              <Input disabled value={warranty} />
            </Item>

            <Item label={t("Returned")}>
              <Input disabled value={returned} />
            </Item>

            <Item label={t("Delivery Date")}>
              <Input disabled value={delivery_date} />
            </Item>

            <Item label={t("Notes")}>
              <Input.TextArea
                rows={5}
                readOnly
                disabled
                value={previousNotes}
              />
            </Item>

            {isAccounting && (
              <div>
                <Item
                  label={t("Add Note")}
                  name="notes"
                  required={false}
                  rules={[
                    { required: true, message: t("This field is required") },
                  ]}
                >
                  <Input.TextArea
                    rows={5}
                    placeholder={t("completed_job_card_details_add_notes")}
                  />
                </Item>
                <div className="flex justify-end -mt-2">
                  <Button
                    size="small"
                    type="primary"
                    htmlType="submit"
                    loading={isLoading}
                    disabled={isLoading || isSuccess}
                  >
                    {t("Save Note")}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Form>
      </div>
    </FiledSet>
  );
}
