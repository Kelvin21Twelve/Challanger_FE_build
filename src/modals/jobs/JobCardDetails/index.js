"use client";

import { Modal } from "antd";
import { useState, useContext, useCallback, useEffect } from "react";

import CreateCarModal from "@/modals/cars/CreateCar";
import CreateEditLabour from "@/modals/settings/CreateEditLabour";
import CreateCustomerModal from "@/modals/customers/CreateCustomer";
import CreateUsedSparePartsModal from "@/modals/inventory/CreateUsedSpareParts";

import { UserContext } from "@/contexts/UserContext";
import {
  useSyncDbQuery,
  useGetJobCardPaymentList,
  useGetJobCardCreatedDetails,
} from "@/queries";

import Labours from "./Labours";
import ModalHeader from "./ModalHeader";
import UsedSpareParts from "./UsedSpareParts";
import ActionContainer from "./ActionContainer";
import SparePartsInvoice from "./SparePartsInvoice";
import JobCardPaymentsModal from "./JobCardPayments";
import JobCardInfoContainer from "./JobCardInfoContainer";

export default function JobCardDetails({
  open,
  onClose,
  onRefetch,
  data = {},
}) {
  const { permissions } = useContext(UserContext);

  const { data: vehicleList } = useSyncDbQuery("Vehicle");
  const { data: jobCreatedDetails } = useGetJobCardCreatedDetails(data.job_no);

  const [isCustLabourUpdated, setIsCustLabourUpdated] = useState(false);

  const [hasChange, setHasChange] = useState(false);

  const [isCreatePaymentModalOpen, setIsCreatePaymentModalOpen] =
    useState(false);
  const [isCreateCarModalOpen, setIsCreateCarModalOpen] = useState(false);
  const [isCreateCustomerModalOpen, setIsCreateCustomerModalOpen] =
    useState(false);
  const [isCreateLabourModalOpen, setIsCreateLabourModalOpen] = useState(false);
  const [isCreateUsedSparePartsOpen, setIsCreateUsedSparePartsOpen] =
    useState(false);

  const [isSparePartsRefetch, setIsSparePartsRefetch] = useState(false);

  const { id: jobId, type: carType } = data || {};

  const combinedInfo = {
    ...data,
    ...jobCreatedDetails,
  };

  const {
    data: paymentListData,
    refetch: paymentListRefetch,
    isLoading: paymentListIsLoading,
    isFetched: paymentListIsFetched,
    isRefetching: paymentListIsRefetching,
  } = useGetJobCardPaymentList(combinedInfo?.job_no || "");

  const isCalculationInProgress =
    paymentListIsLoading || paymentListIsRefetching;

  const paidAmount =
    paymentListData?.data?.reduce(
      (acc, { amount }) => acc + Number(amount || 0),
      0,
    ) || 0;

  const selectedVehicle = vehicleList?.data?.find(
    (item) => item.id == data?.vehicle_id,
  );

  const handleRefetchCalculations = useCallback(() => {
    paymentListRefetch();
  }, [paymentListRefetch]);

  const handleClose = useCallback(() => {
    if (hasChange) onRefetch();
    onClose();
  }, [hasChange, onClose, onRefetch]);

  useEffect(() => {
    if (open && paymentListIsFetched) handleRefetchCalculations();
  }, [open, paymentListIsFetched, handleRefetchCalculations]);

  return (
    <Modal
      title={
        <ModalHeader
          jobId={jobId}
          calculations={{
            ...(paymentListData || {}),
            paid_amount: paidAmount,
          }}
          isCalculationLoading={isCalculationInProgress}
          onClickCar={() => setIsCreateCarModalOpen(true)}
          onClickPayments={() => setIsCreatePaymentModalOpen(true)}
          onClickCustomer={() => setIsCreateCustomerModalOpen(true)}
        />
      }
      onCancel={handleClose}
      width={{ xl: "98%" }}
      footer={null}
      open={open}
    >
      <div className="p-3 max-w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-full">
          <div className="flex flex-col gap-8">
            <JobCardInfoContainer data={combinedInfo} />

            {permissions.includes("customers-new-spare-parts-view") && (
              <SparePartsInvoice
                jobId={jobId}
                calculations={paymentListData}
                onDelete={handleRefetchCalculations}
              />
            )}

            {permissions.includes("customers-labour-view") && (
              <Labours
                jobId={jobId}
                carType={carType}
                refetchFlag={isCustLabourUpdated}
                discount={Number(combinedInfo?.labour_desc || 0)}
                onRefetchCalculations={handleRefetchCalculations}
                onClickAddNew={() => setIsCreateLabourModalOpen(true)}
              />
            )}
          </div>

          <div className="flex flex-col gap-8">
            <ActionContainer
              jobId={jobId}
              data={combinedInfo}
              refetchCalculations={paymentListRefetch}
              isDiscountLoading={isCalculationInProgress}
              maxDiscount={jobCreatedDetails?.max_desc || ""}
              appliedDiscount={paymentListData?.applied_desc || 0}
              onChange={useCallback(() => setHasChange(true), [])}
              grandTotal={Number(paymentListData?.grand_total || 0)}
            />

            {permissions.includes("customers-used-spare-parts-view") && (
              <UsedSpareParts
                jobId={jobId}
                calculations={paymentListData}
                isSpareRefetch={isSparePartsRefetch}
                onRefetchCalculations={handleRefetchCalculations}
                onClickAddNew={() => setIsCreateUsedSparePartsOpen(true)}
              />
            )}
          </div>
        </div>
      </div>

      <CreateCarModal
        isReadOnly
        open={isCreateCarModalOpen}
        dataId={data?.vehicle_id || ""}
        onClose={() => setIsCreateCarModalOpen(false)}
      />

      <CreateCustomerModal
        isReadOnly
        dataId={data?.cust_name_id || ""}
        open={isCreateCustomerModalOpen}
        onClose={() => setIsCreateCustomerModalOpen(false)}
      />

      <CreateEditLabour
        open={isCreateLabourModalOpen}
        data={
          !!selectedVehicle && {
            car_view: Number(selectedVehicle?.car_view),
            car_type: Number(selectedVehicle?.car_type),
          }
        }
        onRefetch={() => {
          setTimeout(() => {
            setIsCustLabourUpdated(true);
            setTimeout(() => setIsCustLabourUpdated(false), 500);
          }, 200);
        }}
        onClose={() => setIsCreateLabourModalOpen(false)}
      />

      <CreateUsedSparePartsModal
        open={isCreateUsedSparePartsOpen}
        partialData={
          !!selectedVehicle && {
            car_view: String(selectedVehicle?.car_view),
            car_type: String(selectedVehicle?.car_type),
          }
        }
        onRefetch={() => {
          setIsSparePartsRefetch(true);
          setTimeout(() => {
            setIsSparePartsRefetch(false);
          }, 100);
        }}
        onClose={() => setIsCreateUsedSparePartsOpen(false)}
      />

      <JobCardPaymentsModal
        data={paymentListData}
        refetch={paymentListRefetch}
        jobId={combinedInfo?.id || ""}
        open={isCreatePaymentModalOpen}
        isLoading={paymentListIsLoading}
        jobNo={combinedInfo?.job_no || ""}
        onClose={() => setIsCreatePaymentModalOpen(false)}
      />
    </Modal>
  );
}
