"use client";

import { Modal } from "antd";
import { useTranslations } from "next-intl";

import { useGetJobCardPaymentList, useGetCompleteJobDetails } from "@/queries";

import Labours from "./Labours";
import ModalHeader from "./ModalHeader";
import UsedSpareParts from "./UsedSpareParts";
import ActionContainer from "./ActionContainer";
import SparePartsInvoice from "./SparePartsInvoice";
import JobCardInfoContainer from "./JobCardInfoContainer";

export default function JobCardDetails({ jobId, open, onClose, isAccounting }) {
  const t = useTranslations("modals");
  const { data, isLoading, error, isError } = useGetCompleteJobDetails(jobId);

  const {
    job_card_details,
    customer_labours,
    job_card_calculation,
    customer_new_spare_parts,
    customer_used_spare_parts,
  } = data || {};

  const { data: paymentListData } = useGetJobCardPaymentList(
    job_card_details?.job_no,
  );

  const paidAmount =
    paymentListData?.data?.reduce(
      (acc, { amount }) => acc + Number(amount || 0),
      0,
    ) || 0;

  return (
    <Modal
      title={
        <ModalHeader
          jobId={jobId}
          paidAmount={paidAmount}
          calculation={paymentListData || {}}
          onClickCar={() => setIsCreateCarModalOpen(true)}
          onClickCustomer={() => setIsCreateCustomerModalOpen(true)}
        />
      }
      width={{ xl: "98%" }}
      onCancel={onClose}
      footer={null}
      open={open}
    >
      <div className="p-3 relative">
        {(isLoading || isError) && (
          <div className="absolute top-0 right-0 bottom-0 left-0 flex items-center justify-center z-10 bg-white text-2xl font-semibold">
            {isLoading ? t("Loading") : ""}
            {error?.message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col gap-8">
            <SparePartsInvoice
              total={job_card_calculation?.new_spare_parts_total || 0}
              data={customer_new_spare_parts || []}
            />
            <Labours
              total={job_card_calculation?.labours_total || 0}
              data={customer_labours || []}
            />
          </div>
          <div className="flex flex-col gap-8">
            <JobCardInfoContainer data={job_card_details || {}} />
            <ActionContainer
              isAccounting={isAccounting}
              data={job_card_details || {}}
            />
            <UsedSpareParts
              data={customer_used_spare_parts || []}
              total={job_card_calculation?.used_spare_parts_total || 0}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
