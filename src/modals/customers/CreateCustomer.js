"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect } from "react";
import { Button, Select, Modal, Form, Input, Radio, Spin } from "antd";

import { handle422Errors } from "@/utils";
import { useCommonInsertUpdate, useSyncDbQuery } from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function CreateCustomer({
  open,
  dataId,
  onClose,
  setResponse,
  isReadOnly = false,
}) {
  const t = useTranslations("modals");
  const [form] = useForm();

  const { data, isLoading: isCustomerLoading } = useSyncDbQuery("Customer");
  const { data: nations, loading: loadingNations } =
    useSyncDbQuery("Nationality");
  const {
    reset,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useCommonInsertUpdate("customer", "Customer");

  const isLoading = isPending && !isSuccess && !isError;
  const nationsArray = nations?.data || [];
  const isEdit = !!dataId;

  const handleFinish = () => mutate(form.getFieldsValue());

  const handleClose = useCallback(() => {
    form.resetFields();
    reset();
    onClose();
  }, [form, onClose, reset]);

  const getTitle = () => {
    if (isEdit) return isReadOnly ? "View Customer" : "Edit Customer";
    return "Create Customer";
  };

  useEffect(() => {
    if (dataId && open) {
      const array = data?.data || [];
      const item = array.find((item) => item.id == dataId);
      if (item) {
        form.setFieldsValue(item);
        form.setFieldValue("nationality", item.nationality);
      }
    }
  }, [data?.data, dataId, form, open]);

  useEffect(() => {
    handle422Errors(form, response);
  }, [form, response]);

  useEffect(() => {
    const { success, data } = response || {};
    if (success) {
      setResponse?.(data);
      handleClose();
    }
  }, [handleClose, response, setResponse]);

  return (
    <Modal
      open={open}
      title={t(getTitle())}
      width={{ xl: "80%" }}
      onCancel={handleClose}
      footer={[
        !isReadOnly ? (
          <Button
            key="submit"
            type="primary"
            htmlType="button"
            disabled={isLoading}
            onClick={() => form.submit()}
          >
            {t("Submit")}
          </Button>
        ) : null,
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <div className="relative">
        <Form
          form={form}
          layout="vertical"
          disabled={isReadOnly}
          onFinish={handleFinish}
          initialValues={{
            is_company: "0",
          }}
        >
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-0">
            <div className="flex flex-col">
              <Item name="id" hidden />
              <Item
                name="cust_name"
                label={t("Customer Name")}
                required
                rules={[
                  { required: true, message: t("This field is required") },
                  {
                    message: t("Customer name is already exists"),
                    validator: (_, value) => {
                      const fieldValue = String(value).trim().toLowerCase();
                      const isExist = data?.data?.some(
                        (item) =>
                          String(item?.cust_name)
                            .toLowerCase()
                            .localeCompare?.(fieldValue) === 0,
                      );

                      const array = data?.data || [];
                      const currentData = array.find(
                        (item) => item.id == dataId,
                      );

                      let flag = true;
                      if (isEdit && currentData?.cust_name) {
                        const condition =
                          String(currentData?.cust_name)
                            .toLowerCase()
                            .localeCompare(fieldValue) === 0;

                        if (condition) flag = false;
                      }

                      return isExist && flag
                        ? Promise.reject(new Error())
                        : Promise.resolve();
                    },
                  },
                  {
                    message: t("This field is required"),
                    validator: (_, value) => {
                      if (String(value || "").length === 0)
                        return Promise.resolve();

                      const hasName = String(value || "").trim().length > 0;
                      return !hasName
                        ? Promise.reject(new Error())
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder={t("Customer Name")} disabled={isReadOnly} />
              </Item>

              <Item
                required
                name="civil_id"
                label={t("Civil ID")}
                rules={[
                  { required: true, message: t("This field is required") },
                  {
                    message: t("This field is required"),
                    validator: (_, value) => {
                      if (String(value || "").length === 0)
                        return Promise.resolve();

                      const hasName = String(value || "").trim().length > 0;
                      return !hasName
                        ? Promise.reject(new Error())
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder={t("Civil ID")} disabled={isReadOnly} />
              </Item>

              <Item
                required
                name="nationality"
                label={t("Nationality")}
                rules={[
                  { required: true, message: t("This field is required") },
                ]}
              >
                <Select
                  showSearch
                  disabled={isReadOnly}
                  loading={loadingNations}
                  placeholder={t("Nationality")}
                  options={nationsArray.map(({ nationality, id }) => ({
                    label: nationality,
                    value: String(id),
                  }))}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                />
              </Item>

              <Item
                required
                name="phone"
                label={t("Mobile 1")}
                rules={[
                  { required: true, message: t("This field is required") },
                  {
                    message: t("This field is required"),
                    validator: (_, value) => {
                      if (String(value || "").length === 0)
                        return Promise.resolve();

                      const hasName = String(value || "").trim().length > 0;
                      return !hasName
                        ? Promise.reject(new Error())
                        : Promise.resolve();
                    },
                  },
                ]}
              >
                <Input placeholder={t("Mobile 1")} disabled={isReadOnly} />
              </Item>

              <Item name="mobile" label={t("Mobile 2")}>
                <Input placeholder={t("Mobile 2")} disabled={isReadOnly} />
              </Item>

              <Item name="mobile_three" label={t("Mobile 3")}>
                <Input placeholder={t("Mobile 3")} disabled={isReadOnly} />
              </Item>
            </div>

            <div className="flex flex-col">
              <Item
                required
                name="is_company"
                label={t("Is Company")}
                rules={[
                  { required: true, message: t("This field is required") },
                ]}
              >
                <Radio.Group disabled={isReadOnly}>
                  <Radio value="1">{t("Yes")}</Radio>
                  <Radio value="0">{t("No")}</Radio>
                </Radio.Group>
              </Item>

              <Item name="fax" label={t("Fax")}>
                <Input placeholder={t("Fax")} disabled={isReadOnly} />
              </Item>

              <Item name="notes" label={t("Notes")}>
                <TextArea placeholder={t("Notes")} disabled={isReadOnly} />
              </Item>

              <Item name="address" label={t("Address")}>
                <TextArea placeholder={t("Address")} disabled={isReadOnly} />
              </Item>
            </div>
          </div>
        </Form>

        {isCustomerLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-white/50 flex items-center justify-center">
            <Spin size="large" />
          </div>
        )}
      </div>
    </Modal>
  );
}
