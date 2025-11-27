"use client";

import { useState } from "react";
import { Typography, Button } from "antd";
import { useTranslations } from "next-intl";

import { PrintIcon } from "@/assets/icons/actions";

import SearchAccountModal from "@/modals/accounts/SearchAccount";

const { Title } = Typography;

function Card({ item: { label, description } = {}, onClick }) {
  return (
    <div className="shadow-lg bg-white p-5 rounded-lg">
      <div className="text-xl font-medium">{label}</div>
      <div className="text-sm pt-2">{description}</div>
      <div className="pt-4">
        <div className="flex justify-end pt-2">
          <Button type="primary" onClick={onClick}>
            <PrintIcon />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  const t = useTranslations("print-account-statement");
  const [isModelOpen, setIsModelOpen] = useState(false);

  return (
    <div>
      <Title level={2}>{t("Account Statement")}</Title>
      <div className="lg:grid grid-cols-4 gap-6 flex-wrap pt-2">
        <Card
          item={{
            description: t("description"),
            label: t("Print Account Statement"),
          }}
          onClick={() => setIsModelOpen(true)}
        />
      </div>

      <SearchAccountModal
        open={isModelOpen}
        onClose={() => setIsModelOpen(false)}
      />
    </div>
  );
}
