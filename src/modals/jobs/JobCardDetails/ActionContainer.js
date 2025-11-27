import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { useEffect, useState, useContext } from "react";
import { Checkbox, Input, Form, Select, Spin, Button } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";

import { UserContext } from "@/contexts/UserContext";

import FiledSet from "@/components/FiledSet";

import {
  useJobCardUpdate,
  useJobCardLockUnlock,
  useJobCardDiscountApply,
} from "@/queries";

const { TextArea } = Input;
const { Item, useForm } = Form;

export default function ActionContainer({
  jobId,
  data,
  onChange,
  grandTotal,
  maxDiscount,
  appliedDiscount,
  isDiscountLoading,
  refetchCalculations,
}) {
  const t = useTranslations("modals");
  const { lock_card } = data || {};

  const [form] = useForm();
  const { permissions } = useContext(UserContext);

  const { mutate: lockMutate, data: responseCardLockUnlock } =
    useJobCardLockUnlock();

  const {
    error,
    mutate,
    isError,
    isPending,
    isSuccess,
    data: response,
  } = useJobCardUpdate(jobId);
  const { mutate: mutateDiscountApply, isSuccess: isSuccessDiscountApply } =
    useJobCardDiscountApply(jobId);

  const isLoading = isPending && !isSuccess && !isError;

  const [locked, setLocked] = useState(lock_card == 1);
  const [hasChanges, setHasChanges] = useState(false);
  const [initialFormValues, setInitialFormValues] = useState({
    ...data,
    notes: data?.notes || "",
    applied_discount: appliedDiscount,
    approved: data.approved === "yes",
    returned: data.returned === "yes",
    warranty: data.warranty === "yes",
  });

  const onFormValuesChange = (changedValues, allValues) => {
    const changed = Object.keys(allValues).some(
      (key) =>
        key != "applied_discount" && allValues[key] !== initialFormValues[key],
    );

    setHasChanges(changed);
  };

  const toggleLocked = () => {
    lockMutate({ job_id: jobId, status: !locked ? 1 : 0 });
    setLocked((prev) => !prev);
  };

  const handleApplyDiscount = () => {
    const discount = form.getFieldValue("applied_discount");

    if (Number(discount || 0) > Number(grandTotal || 0)) {
      Swal.fire({ text: t("Discount cannot be greater than total") });
      return;
    }

    const formData = new FormData();
    formData.set("discount", discount);
    mutateDiscountApply(formData);
  };

  useEffect(() => {
    if (error) Swal.fire({ text: error.message });
  }, [error]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (hasChanges) {
        const data = form.getFieldsValue();
        setInitialFormValues(data);
        setHasChanges(false);

        mutate({
          ...data,
          applied_discount: undefined,
          notes: String(data?.notes || "").trim(),
          approved: data?.approved ? "yes" : "",
          returned: data?.returned ? "yes" : "",
          warranty: data?.warranty ? "yes" : "",
        });
      }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [form, hasChanges, mutate, permissions]);

  useEffect(() => {
    const { success, lock_card } = responseCardLockUnlock || {};
    if (success) {
      Swal.fire({
        text:
          lock_card == "1"
            ? t("This job card is blocked")
            : t("This job card is unblocked"),
      });
      onChange?.();
      setLocked(lock_card == 1);
    }
  }, [onChange, responseCardLockUnlock, t]);

  useEffect(() => {
    if (hasChanges) onChange?.();
  }, [hasChanges, onChange]);

  useEffect(() => {
    if (response) onChange?.();
  }, [response, onChange]);

  useEffect(() => {
    if (isSuccessDiscountApply) {
      Swal.fire({ text: "Discount is applied successfully" });
      refetchCalculations();
    }
  }, [isSuccessDiscountApply, refetchCalculations]);

  useEffect(() => {
    form.setFieldValue("applied_discount", appliedDiscount);
  }, [appliedDiscount, form]);

  const hasEditPermission = permissions.includes("job-card-edit") && !locked;

  return (
    <FiledSet>
      <Form
        form={form}
        layout="vertical"
        disabled={!hasEditPermission}
        initialValues={initialFormValues}
        onValuesChange={onFormValuesChange}
      >
        <div className="relative">
          <div className="absolute -top-4 -right-2 rtl:-left-2 rtl:right-auto p-1">
            <button
              type="button"
              onClick={toggleLocked}
              disabled={!permissions.includes("job-card-edit")}
              className={
                permissions.includes("job-card-edit")
                  ? "hover:animate-pulse cursor-pointer"
                  : "cursor-not-allowed"
              }
            >
              {!locked ? (
                <FontAwesomeIcon
                  icon={faUnlockAlt}
                  className="!text-[#ff283c]"
                  style={{ width: 26, height: 26 }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faLock}
                  className="!text-[#5fadbf]"
                  style={{ width: 26, height: 26 }}
                />
              )}
            </button>
          </div>
          <div className="flex flex-wrap gap-6 mb-2">
            {/* <Item name="approved" noStyle valuePropName="checked">
              <Checkbox className="font-semibold">{t("Approved")}</Checkbox>
            </Item> */}

            <Item name="returned" noStyle valuePropName="checked">
              <Checkbox className="font-semibold">{t("Returned")}</Checkbox>
            </Item>
          </div>

          <div className="grid sm:grid-cols-2 gap-y-2 gap-x-6">
            <div>
              <Item name="warranty" noStyle valuePropName="checked">
                <Checkbox className="font-semibold">{t("Warranty")}</Checkbox>
              </Item>
              <div className="mt-2">
                <Item name="warranty_days">
                  <Input />
                </Item>
              </div>
            </div>

            <div>
              <Item
                className="!mb-0"
                name="delivery_date"
                label={t("Delivery Date")}
              >
                <Input disabled className="w-full" />
              </Item>
            </div>

            <div>
              <Item name="notes" label={t("Notes")} className="!mb-0">
                <TextArea rows={8} />
              </Item>
            </div>

            <div>
              <Item
                className="!mb-0"
                name="requested_parts"
                label={t("Requested Parts")}
              >
                <TextArea rows={8} />
              </Item>
            </div>

            <div>
              <Item label={t("Status")} className="!mb-0">
                <Select
                  className={isLoading ? "pointer-events-none" : ""}
                  value={response?.status || data?.status}
                  showSearch
                  options={[
                    {
                      label: "Working",
                      value: "working",
                    },
                    {
                      label: "Delay",
                      value: "delay",
                    },
                    {
                      label: "Under Testing",
                      value: "under_test",
                    },
                    {
                      label: "Delivery",
                      value: "delivery",
                    },
                    {
                      label: "Paint",
                      value: "paint",
                    },
                    {
                      label: "Cancel Request",
                      value: "cancel_req",
                    },
                    {
                      label: "Print Request",
                      value: "print_req",
                    },
                    {
                      label: "Paid Wait",
                      value: "paid_wait",
                    },
                    {
                      label: "Clean Polish",
                      value: "clean_polish",
                    },
                    {
                      label: "On Change",
                      value: "on_change",
                    },
                    {
                      label: "Pending",
                      value: "pending",
                    },
                  ].map((item) => ({
                    ...item,
                    label: t(item.label),
                  }))}
                  onChange={(value) => mutate({ status: value })}
                  filterOption={(input = "", { label = "" } = {}) =>
                    String(label)
                      .toLowerCase()
                      .includes(String(input).toLowerCase())
                  }
                />
              </Item>
            </div>

            <div className="flex items-end gap-2">
              <Item
                name="applied_discount"
                label={t("Discount")}
                className="!mb-0 grow"
              >
                <Input
                  min={0}
                  step={0.1}
                  type="number"
                  max={maxDiscount}
                  disabled={isDiscountLoading}
                  onKeyDown={(e) =>
                    ["+", "-", "e"].includes(e.key) && e.preventDefault()
                  }
                />
              </Item>
              <Button
                size="small"
                type="primary"
                htmlType="button"
                onClick={handleApplyDiscount}
                disabled={isDiscountLoading || grandTotal > 0}
              >
                Apply
              </Button>
            </div>

            {isLoading && (
              <div className="flex gap-2 justify-end items-end text-xs font-medium text-gray-500">
                <span>{t("Saving Changes")}...</span>
                <Spin size="small" />
              </div>
            )}
          </div>
        </div>
      </Form>
    </FiledSet>
  );
}
