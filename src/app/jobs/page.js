"use client";

import { clsx } from "clsx";
import { Typography, Empty } from "antd";
import { redirect } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useContext, useEffect } from "react";

import { getColorByStatus } from "@/utils";
import { useGetJobsList } from "@/queries";

import { UserContext } from "@/contexts/UserContext";
import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import SearchCabModal from "@/modals/jobs/SearchCab";
import TransferCabModal from "@/modals/jobs/TransferCab";
import CreateJobCardModal from "@/modals/jobs/CreateJobCard";
import JobCardDetailsModal from "@/modals/jobs/JobCardDetails";

const { Title } = Typography;

export default function Page() {
  const t = useTranslations("jobs");
  const [customerIds, setCustomerIds] = useState(null);

  const [state, dispatch] = useContext(ModelContext);
  const { permissions } = useContext(UserContext);
  const {
    isRefetchJobCardList,
    jobCardAddCustomer,
    jobCardListStatus,
    jobCardSearch,
    jobSwapCard,
  } = state || {};

  const { data, isLoading, refetch, isRefetching } = useGetJobsList(
    jobCardListStatus,
    customerIds,
  );

  const array = data?.data || [];

  const [hasSearch, setHasSearch] = useState(false);
  const [addJobCard, setAddJobCard] = useState(null);

  const [selectedData, setSelectedData] = useState(null);
  const [hasJobCardSwap, setHasJobCardSwap] = useState(false);

  useEffect(() => {
    if (data?.status_count) {
      dispatch({
        type: ACTIONS.setJobCardStatusCounts,
        payload: data.status_count || {},
      });
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (isRefetchJobCardList) {
      setCustomerIds(null);
      refetch();
    }
  }, [dispatch, isRefetchJobCardList, refetch]);

  useEffect(() => {
    if (jobCardSearch) setHasSearch(true);
  }, [jobCardSearch]);

  useEffect(() => {
    if (jobSwapCard) setHasJobCardSwap(true);
  }, [jobSwapCard]);

  useEffect(() => {
    if (jobCardAddCustomer) setAddJobCard(true);
  }, [jobCardAddCustomer]);

  useEffect(() => {
    if (!permissions.includes("job-card-view")) redirect("/jobs/complete-jobs");
  }, [permissions]);

  return (
    <div>
      <Title level={2}>{t("Manage Jobs")}</Title>

      {!isLoading && array.length === 0 && (
        <Empty description={t("No Result Found")} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-y-4 gap-x-10 pt-4">
        {(isLoading || isRefetching) &&
          Array.from({ length: 9 }).map((_, index) => (
            <div
              key={index + 1}
              className="h-50 animate-pulse bg-gray-200 rounded-lg"
            />
          ))}

        {!isRefetching &&
          array.map((data) => {
            const {
              id,
              phone,
              cab_no,
              agency,
              status,
              plate_no,
              view_type,
              cust_name,
            } = data;

            return (
              <button
                key={id}
                type="button"
                onClick={() => setSelectedData(data)}
                style={{ backgroundColor: getColorByStatus(status) }}
                className={clsx(
                  "p-6 min-h-[210px] flex",
                  status === "delivery" ? "text-gray-700" : "text-white",
                  "cursor-pointer rounded shadow flex-col hover:shadow-xl",
                )}
              >
                <div>
                  <div
                    className={clsx(
                      "border mx-auto font-bold text-lg",
                      "rounded-full h-10 flex items-center justify-center w-14",
                      status === "delivery"
                        ? "border-gray-700"
                        : "border-white",
                    )}
                  >
                    {cab_no}
                  </div>
                </div>
                <div className="text-center pt-4 text-sm">
                  <div>{cust_name}</div>
                  <div>{phone}</div>
                  <div>{view_type}</div>
                  <div>{agency}</div>
                  <div>PN {plate_no}</div>
                </div>
              </button>
            );
          })}
      </div>

      <TransferCabModal
        open={hasJobCardSwap}
        onClose={() => setHasJobCardSwap(false)}
      />

      {addJobCard && (
        <CreateJobCardModal
          open={true}
          onRefetch={refetch}
          onClose={() => setAddJobCard(false)}
        />
      )}

      <SearchCabModal
        open={hasSearch}
        onSetCustomerIds={setCustomerIds}
        onClose={() => setHasSearch(false)}
      />

      {!!selectedData && (
        <JobCardDetailsModal
          open
          data={selectedData}
          onRefetch={() => refetch()}
          onClose={() => setSelectedData(null)}
        />
      )}
    </div>
  );
}
