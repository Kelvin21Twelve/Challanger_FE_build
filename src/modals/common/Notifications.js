"use client";

import { Button, Modal, Alert } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState, useContext } from "react";

import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import { useNotifications } from "@/queries";

export default function Notifications({ open, onClose }) {
  const t = useTranslations("modals");
  const { data } = useNotifications();
  const { notifications = [], isExpired = false } = data || {};

  const [counts, setCounts] = useState(0);
  const [isAllClear, setIsAllClear] = useState(false);

  const [, dispatch] = useContext(ModelContext);

  const handleClose = () => onClose();
  const handleClearAll = () => {
    setIsAllClear((prev) => !prev);
    setCounts(0);
  };

  useEffect(() => {
    if (notifications) {
      const length1 = notifications?.length || 0;
      setCounts(length1 + (isExpired ? 1 : 0));
    }
  }, [data, isExpired, notifications]);

  useEffect(() => {
    if (counts) {
      dispatch({
        type: ACTIONS.setNotificationsCount,
        payload: counts,
      });
    }
  }, [counts, dispatch]);

  return (
    <Modal
      title={
        <div className="inline-flex gap-4">
          <div>{t("Notifications")}</div>
          {!isAllClear && (
            <Button
              size="small"
              type="primary"
              onClick={handleClearAll}
              className="!h-auto !leading-none !text-sm"
            >
              {t("Clear All")}
            </Button>
          )}
        </div>
      }
      footer={[
        <Button key="search" type="primary" danger onClick={handleClose}>
          {t("Close")}
        </Button>,
      ]}
      open={open}
      onCancel={handleClose}
    >
      <div className="flex flex-col gap-3">
        {isExpired && !isAllClear && (
          <Alert
            type="info"
            message={
              <div>
                {t("Info!")} <span className="font-semibold">{t("Renew")}</span>{" "}
                {t("Your Visa, Its about to Expire")}
              </div>
            }
          />
        )}

        {!isAllClear &&
          notifications.map(({ item_code, item_name }) => (
            <Alert
              key={item_code}
              type="info"
              message={
                <div>
                  {t("Info!") + " "}
                  <span className="font-semibold">{t("Add") + " "}</span>
                  {t("Your Spare parts")} {item_name}
                  {t(", HUB min limit is reached")}
                </div>
              }
            />
          ))}

        {isAllClear && t("No notifications available at the moment")}
      </div>
    </Modal>
  );
}
