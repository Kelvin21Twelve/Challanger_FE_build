"use client";

import axios from "axios";
import Swal from "sweetalert2";
import { useTranslations } from "next-intl";
import { createContext, useReducer } from "react";

export const ModelContext = createContext();

export const ACTIONS = {
  setNotificationsCount: "setNotificationsCount",
  setJobCardListFetchStatus: "setJobCardListFetchStatus",
  setJobCardStatusCounts: "setJobCardStatusCounts",
  refetchJobCardList: "refetchJobCardList",
  jobCardAddCustomer: "jobCardAddCustomer",
  jobCardSearch: "jobCardSearch",
  jobSwapCard: "jobSwapCard",

  toggleIsChangePasswordModalOpen: "TICPMO",
  toggleSparePartsSalesFormModal: "TSPSFM",
  resetSystemToDefaultAction: "RSTDA",
  toggleNotificationModalOpen: "TNMO",
  toggleIsSearchModalOpen: "TISMO",
  clearInventoryAction: "CIA",
};

const handleResetSystemToDefaultAction = async () => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#007bff",
    title: modalsT("Are you sure?"),
    cancelButtonText: modalsT("Cancel"),
    cancelButtonColor: "rgb(221, 51, 51)",
    confirmButtonText: modalsT("Yes, delete it!"),
    text: modalsT("You won't be able to revert this!"),
  });

  if (isConfirmed) axios.post("/clear_all_tables");
};

const handleClearInventoryAction = async () => {
  const { isConfirmed } = await Swal.fire({
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#007bff",
    title: modalsT("Are you sure?"),
    cancelButtonText: modalsT("Cancel"),
    cancelButtonColor: "rgb(221, 51, 51)",
    confirmButtonText: modalsT("Yes, delete it!"),
    text: modalsT("You won't be able to revert this!"),
  });

  if (isConfirmed) axios.post("/clear_inventory");
};

function reducer(state, { type, payload }) {
  if (type === ACTIONS.toggleSparePartsSalesFormModal) {
    return {
      ...state,
      isSparePartsSalesFormModalOpen: !state.isSparePartsSalesFormModalOpen,
    };
  }

  if (type === ACTIONS.toggleIsChangePasswordModalOpen) {
    return {
      ...state,
      isChangePasswordModalOpen: !state.isChangePasswordModalOpen,
    };
  }

  if (type === ACTIONS.toggleIsSearchModalOpen) {
    return {
      ...state,
      isSearchModalOpen: !state.isSearchModalOpen,
    };
  }

  if (type === ACTIONS.resetSystemToDefaultAction)
    handleResetSystemToDefaultAction();

  if (type === ACTIONS.clearInventoryAction) handleClearInventoryAction();

  if (type === ACTIONS.setJobCardListFetchStatus) {
    return {
      ...state,
      jobCardListStatus: payload,
    };
  }

  if (type === ACTIONS.refetchJobCardList) {
    return {
      ...state,
      jobCardListStatus: "all",
      isRefetchJobCardList: payload,
    };
  }

  if (type === ACTIONS.jobCardSearch) {
    return {
      ...state,
      jobCardSearch: payload,
    };
  }

  if (type === ACTIONS.jobCardAddCustomer) {
    return {
      ...state,
      jobCardAddCustomer: payload,
    };
  }

  if (type === ACTIONS.jobSwapCard) {
    return {
      ...state,
      jobSwapCard: payload,
    };
  }

  if (type === ACTIONS.setJobCardStatusCounts) {
    return {
      ...state,
      statusCounts: payload,
    };
  }

  if (type === ACTIONS.setNotificationsCount) {
    return {
      ...state,
      notificationCount: payload,
    };
  }

  if (type === ACTIONS.toggleNotificationModalOpen) {
    return {
      ...state,
      isNotificationModalOpen: !state.isNotificationModalOpen,
    };
  }

  return state;
}

export default function ModelProvider({ children }) {
  const t = useTranslations("modals");
  const [state, dispatch] = useReducer(reducer, {
    isSparePartsSalesFormModalOpen: false,
    isGeneratePayrollModalOpen: false,
    isChangePasswordModalOpen: false,
    isNotificationModalOpen: false,
    isRefetchJobCardList: false,
    jobCardAddCustomer: false,
    isSearchModalOpen: false,
    jobCardListStatus: "all",
    jobCardSearch: false,
    notificationCount: 0,
    jobSwapCard: false,
    statusCounts: {
      clean_polish: 0,
      cancel_req: 0,
      under_test: 0,
      print_req: 0,
      on_change: 0,
      delivery: 0,
      paid_wait: 0,
      working: 0,
      pending: 0,
      delay: 0,
      paint: 0,
    },
  });

  if (typeof window !== "undefined") window.modalsT = t;

  return (
    <ModelContext.Provider value={[state, dispatch]}>
      {children}
    </ModelContext.Provider>
  );
}
