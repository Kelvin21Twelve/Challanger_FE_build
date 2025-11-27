"use client";

import { useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import { Button, Input, Modal, Checkbox, ConfigProvider } from "antd";

import { useUpdatePermissions } from "@/queries";

import { permissions } from "@/utils";

export default function UpdatePermissionModal({
  open,
  data,
  onClose,
  onRefetch,
}) {
  const t = useTranslations("modals");
  const [selections, setSelections] = useState([]);

  const {
    reset,
    mutate,
    isError,
    isPending,
    data: response,
  } = useUpdatePermissions();
  const isSuccess = !!response?.success;
  const isLoading = isPending && !isSuccess && !isError;

  const handlePermissionChange = (checked, value) => {
    setSelections((prevData) => {
      return checked
        ? [...prevData, value]
        : prevData.filter((item) => item !== value);
    });
  };

  const handleClose = useCallback(() => {
    setSelections([]);
    reset();
    onClose();
  }, [onClose, reset]);

  const handleFinish = () => {
    const form = new FormData();
    form.set("role_id", data?.id || "");

    selections.forEach((item) => form.append(`permission[${item}]`, item));

    mutate(form);
  };

  useEffect(() => {
    if (data) {
      const { permission_slug } = data || {};
      if (permission_slug) {
        const array = JSON.parse(permission_slug);
        setSelections(array);
      }
    }
  }, [data]);

  useEffect(() => {
    if (response?.success) {
      onRefetch();
      handleClose();
    }
  }, [handleClose, onRefetch, response]);

  return (
    <Modal
      title={t("Update Permission")}
      onCancel={handleClose}
      width={{ lg: "60%" }}
      open={open}
      footer={[
        <Button
          key="submit"
          type="primary"
          htmlType="button"
          disabled={isLoading}
          onClick={handleFinish}
        >
          {t("Submit")}
        </Button>,
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
    >
      <div className="grid sm:grid-cols-2">
        <div>
          <div className="font-semibold text-base pb-1">{t("Role")}</div>
          <Input
            disabled
            size="large"
            value={data?.name}
            className="w-full"
            placeholder={t("Select Role")}
          />
        </div>
      </div>

      <div className="font-semibold text-base pt-4 pb-1">
        {t("Permissions")}
      </div>
      <ConfigProvider
        theme={{
          components: {
            Checkbox: {
              colorBorder: "#8f8f8f",
            },
          },
        }}
      >
        <div className="max-w-full overflow-x-auto">
          <table className="w-full [&_td]:border [&_th]:border [&_th]:p-2.5 [&_td]:p-2.5 [&_th]:border-[#ddd] [&_td]:border-[#ddd]">
            <thead>
              <tr className="text-left">
                <th>{t("Module")}</th>
                <th className="w-28">{t("Add")}</th>
                <th className="w-28">{t("Edit")}</th>
                <th className="w-28">{t("Delete")}</th>
                <th className="w-28">{t("View")}</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map(({ label, actions, baseValue }) => {
                const isAdd = actions.includes("add");
                const isEdit = actions.includes("edit");
                const isView = actions.includes("view");
                const isDelete = actions.includes("delete");
                const isVisible = actions.includes("visible");

                return (
                  <tr key={label} className="text-left odd:bg-[#f2f2f2]">
                    <td className="text-sm">{label}</td>
                    <td>
                      {isAdd ? (
                        <Checkbox
                          checked={selections.includes(baseValue + "-add")}
                          onChange={(e) =>
                            handlePermissionChange(
                              e.target.checked,
                              baseValue + "-add",
                            )
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {isEdit ? (
                        <Checkbox
                          checked={selections.includes(baseValue + "-edit")}
                          onChange={(e) =>
                            handlePermissionChange(
                              e.target.checked,
                              baseValue + "-edit",
                            )
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {isDelete ? (
                        <Checkbox
                          checked={selections.includes(baseValue + "-delete")}
                          onChange={(e) =>
                            handlePermissionChange(
                              e.target.checked,
                              baseValue + "-delete",
                            )
                          }
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td>
                      {isView && (
                        <Checkbox
                          checked={selections.includes(baseValue + "-view")}
                          onChange={(e) =>
                            handlePermissionChange(
                              e.target.checked,
                              baseValue + "-view",
                            )
                          }
                        />
                      )}

                      {isVisible && (
                        <Checkbox
                          checked={selections.includes(baseValue + "-visible")}
                          onChange={(e) =>
                            handlePermissionChange(
                              e.target.checked,
                              baseValue + "-visible",
                            )
                          }
                        />
                      )}

                      {!isView && !isVisible && "-"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </ConfigProvider>
    </Modal>
  );
}
