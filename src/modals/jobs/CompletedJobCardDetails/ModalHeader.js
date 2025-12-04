import { Button } from "antd";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

import { PrintIcon } from "@/assets/icons/other";

import { usePrintCompleteJobDetails } from "@/queries";

function Actions({ jobId }) {
  const { mutate, data, reset } = usePrintCompleteJobDetails();

  useEffect(() => {
    if (data?.success) {
      window.open(data?.view);
      reset();
    }
  }, [jobId, data, reset]);

  return (
    <div className="flex items-center gap-0.5">
      <Button type="primary" onClick={() => mutate(jobId)}>
        <PrintIcon />
      </Button>
    </div>
  );
}

function Information({ calculation, paidAmount }) {
  const t = useTranslations("modals");
  const { grand_total, balance } = calculation || {};

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg font-bold">
      <div>
        <span>{t("Paid:")}</span>
        <span className="font-medium pl-4">{paidAmount}</span>
      </div>

      <div>
        <span>{t("Total:")}</span>
        <span className="font-medium pl-4">{grand_total}</span>
      </div>

      <div className="text-[#ff283c]">
        <span>{t("Balance:")}</span>
        <span className="font-medium pl-4">{balance}</span>
      </div>
    </div>
  );
}

export default function ModalHeader({ calculation, paidAmount, jobId }) {
  const t = useTranslations("modals");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-0 items-start">
      <div className="text-3xl">{t("Completed Job Card Details")}</div>
      <Actions jobId={jobId} />
      <Information calculation={calculation} paidAmount={paidAmount} />
    </div>
  );
}
