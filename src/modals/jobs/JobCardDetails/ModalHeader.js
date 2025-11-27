import { Button, Spin } from "antd";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { CarsIcon } from "@/assets/icons/sidebar";
import { DollarIcon, PrintIcon } from "@/assets/icons/other";

import { useJobCardPrint } from "@/queries";

function Actions({ jobId, onClickCar, onClickCustomer, onClickPayments }) {
  const { mutate, data } = useJobCardPrint(jobId);

  useEffect(() => {
    if (data?.view) window.open(data?.view || "");
  }, [data]);

  return (
    <div className="inline-flex">
      <div className="inline-flex items-center gap-0.5 !rounded overflow-hidden">
        <Button
          type="primary"
          className="[&_svg]:w-5 !rounded-none"
          onClick={onClickCar}
        >
          <CarsIcon />
        </Button>

        <Button
          type="primary"
          onClick={onClickCustomer}
          className="[&_svg]:w-5 !bg-[#17a2b8] !rounded-none"
        >
          <FontAwesomeIcon icon={faUser} className="!h-5" />
        </Button>

        <Button
          type="primary"
          className="!rounded-none"
          onClick={onClickPayments}
        >
          <DollarIcon />
        </Button>

        <Button type="primary" onClick={mutate} className="!rounded-none">
          <PrintIcon />
        </Button>
      </div>
    </div>
  );
}

function Information({ calculations, isLoading }) {
  const t = useTranslations("modals");
  const { balance, grand_total, paid_amount } = calculations || {};

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-lg font-bold relative">
      <div>
        <span>{t("Paid:")}</span>
        <span className="font-medium pl-4">{paid_amount || 0}</span>
      </div>
      <div>
        <span>{t("Total:")}</span>
        <span className="font-medium pl-4">{grand_total || 0}</span>
      </div>
      <div className="text-[#ff283c]">
        <span>{t("Balance:")}</span>
        <span className="font-medium pl-4">{balance || 0}</span>
      </div>

      {isLoading && (
        <div className="absolute top-0 right-0 bottom-0 left-0 z-10 bg-white/40">
          <div className="flex items-center justify-center h-full">
            <Spin />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ModalHeader({
  jobId,
  isCalculationLoading,
  onClickPayments,
  onClickCustomer,
  calculations,
  onClickCar,
}) {
  const t = useTranslations("modals");

  return (
    <div className="grid md:grid-cols-3 items-start gap-4 md:gap-0">
      <div className="text-3xl">{t("Job Card Details")}</div>
      <Actions
        jobId={jobId}
        onClickCar={onClickCar}
        onClickCustomer={onClickCustomer}
        onClickPayments={onClickPayments}
      />

      <Information
        isLoading={isCalculationLoading}
        calculations={calculations}
      />
    </div>
  );
}
