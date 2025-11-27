import { clsx } from "clsx";
import { Select, Button } from "antd";
import { useTranslations } from "next-intl";
import { Fragment, useEffect, useContext, useMemo } from "react";

import { UserContext } from "@/contexts/UserContext";
import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import { SearchIcon } from "@/assets/icons";
import { PlusIcon, RefreshIcon, SwapIcon } from "@/assets/icons/actions";

function Actions() {
  const t = useTranslations("sidebar");
  const { permissions } = useContext(UserContext);
  const [state, dispatch] = useContext(ModelContext);
  const { jobCardListStatus } = state || {};

  useEffect(() => {
    dispatch({ type: ACTIONS.setJobCardListFetchStatus, payload: "all" });
  }, [dispatch]);

  return (
    <Fragment>
      <div>
        <Select
          showSearch
          className="w-full"
          defaultValue="all"
          filterOption={(input = "", { label = "" } = {}) =>
            String(label).toLowerCase().includes(String(input).toLowerCase())
          }
          value={jobCardListStatus}
          options={[
            {
              label: "All",
              value: "all",
            },
            {
              label: "Mine",
              value: "mine",
            },
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
              label: "Cancel Request",
              value: "cancel_req",
            },
            {
              label: "Print Request",
              value: "print_req",
            },
            {
              label: "Paint",
              value: "paint",
            },
            {
              label: "Paid/Wait",
              value: "paid_wait",
            },
            {
              label: "On Change",
              value: "on_change",
            },
            {
              label: "Clean/Polish",
              value: "clean_polish",
            },
            {
              label: "Pending",
              value: "pending",
            },
          ].map((item) => ({
            ...item,
            label: t(item.label),
          }))}
          onChange={(value) =>
            dispatch({
              payload: value,
              type: ACTIONS.setJobCardListFetchStatus,
            })
          }
        />
      </div>

      <div className="flex gap-2 justify-between flex-wrap pt-3">
        {permissions.includes("job-card-add") && (
          <Button
            type="primary"
            size="small"
            className="[&_svg]:w-5"
            onClick={() => {
              dispatch({ type: ACTIONS.jobCardAddCustomer, payload: true });
              setTimeout(
                () =>
                  dispatch({
                    type: ACTIONS.jobCardAddCustomer,
                    payload: false,
                  }),
                0,
              );
            }}
          >
            <PlusIcon />
          </Button>
        )}

        <Button
          size="small"
          type="primary"
          className="[&_svg]:w-5"
          onClick={() => {
            dispatch({ type: ACTIONS.jobSwapCard, payload: true });
            setTimeout(
              () => dispatch({ type: ACTIONS.jobSwapCard, payload: false }),
              0,
            );
          }}
        >
          <SwapIcon />
        </Button>

        <Button
          size="small"
          type="primary"
          className="[&_svg]:w-5"
          onClick={() => {
            dispatch({ type: ACTIONS.jobCardSearch, payload: true });
            setTimeout(
              () => dispatch({ type: ACTIONS.jobCardSearch, payload: false }),
              0,
            );
          }}
        >
          <SearchIcon />
        </Button>

        <Button
          size="small"
          type="primary"
          className="[&_svg]:w-5"
          onClick={() => {
            dispatch({ type: ACTIONS.refetchJobCardList, payload: true });
            setTimeout(
              () =>
                dispatch({ type: ACTIONS.refetchJobCardList, payload: false }),
              0,
            );
          }}
        >
          <RefreshIcon />
        </Button>
      </div>
    </Fragment>
  );
}

function StatisticsItem({ label, color, value = 0 }) {
  return (
    <div className="flex gap-2 items-center text-sm">
      <div
        className={clsx(
          "w-9 h-9 flex items-center justify-center font-semibold border",
          "border-[#dfdfdf]",
          color,
        )}
      >
        {value}
      </div>
      <div>{label}</div>
    </div>
  );
}

function Statistics() {
  const t = useTranslations("sidebar");
  const [state] = useContext(ModelContext);
  const { statusCounts } = state || {};
  const {
    clean_polish,
    under_test,
    cancel_req,
    on_change,
    paid_wait,
    print_req,
    delivery,
    working,
    pending,
    delay,
    paint,
  } = statusCounts || {};

  const items = useMemo(
    () =>
      [
        {
          value: working,
          label: "Working",
          color: "bg-[#69ed87]",
        },
        {
          value: delay,
          label: "Delay",
          color: "bg-[#ff6766]",
        },
        {
          value: under_test,
          label: "Under Test",
          color: "bg-[#76baff]",
        },
        {
          value: delivery,
          label: "Delivery",
          color: "bg-[#ffffff]",
        },
        {
          value: cancel_req,
          label: "Cancel Req",
          color: "bg-[#ffdd1e]",
        },
        {
          value: print_req,
          label: "Print Req",
          color: "bg-[#ff85ff]",
        },
        {
          value: on_change,
          label: "On Change",
          color: "bg-[#b2ef1a]",
        },
        {
          value: paint,
          label: "Paint",
          color: "bg-[#fca003]",
        },
        {
          value: paid_wait,
          label: "Paid/Wait",
          color: "bg-[#8082ff]",
        },
        {
          value: clean_polish,
          label: "Clean/Polish",
          color: "bg-[#0edecd]",
        },
        {
          value: pending,
          label: "Pending",
          color: "bg-[#078ad5]",
        },
      ].map((item) => ({ ...item, label: t(item.label) })),
    [
      t,
      paint,
      delay,
      pending,
      working,
      delivery,
      on_change,
      paid_wait,
      print_req,
      cancel_req,
      under_test,
      clean_polish,
    ],
  );

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item) => (
        <StatisticsItem key={item.label} {...item} />
      ))}
    </div>
  );
}

export default function JobActions() {
  return (
    <div className="px-6 flex flex-col gap-4 py-4">
      <Actions />
      <Statistics />
    </div>
  );
}
