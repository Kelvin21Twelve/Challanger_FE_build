"use client";

import { useContext, useCallback } from "react";

import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import NotificationsModal from "@/modals/common/Notifications";
import ChangePasswordModal from "@/modals/common/ChangePassword";
import SearchJobCardsForm from "@/modals/common/SearchJobCardsForm";
import SparePartsSalesFormModal from "@/modals/jobs/SparePartsSalesForm";

export default function CommonModalWrapper() {
  const [state, dispatch] = useContext(ModelContext);

  const handleUpdateRefetchJobCard = useCallback(() => {
    dispatch({ type: ACTIONS.refetchJobCardList, payload: true });
    setTimeout(
      () => dispatch({ type: ACTIONS.refetchJobCardList, payload: false }),
      0,
    );
  }, [dispatch]);

  return (
    <div>
      <SparePartsSalesFormModal
        onClose={() =>
          dispatch({ type: ACTIONS.toggleSparePartsSalesFormModal })
        }
        open={state.isSparePartsSalesFormModalOpen}
        onRefetchJobCards={handleUpdateRefetchJobCard}
      />

      <ChangePasswordModal
        open={state.isChangePasswordModalOpen}
        onClose={() =>
          dispatch({ type: ACTIONS.toggleIsChangePasswordModalOpen })
        }
      />

      <SearchJobCardsForm
        open={state.isSearchModalOpen}
        onClose={() => dispatch({ type: ACTIONS.toggleIsSearchModalOpen })}
      />

      <NotificationsModal
        open={state.isNotificationModalOpen}
        onClose={() => dispatch({ type: ACTIONS.toggleNotificationModalOpen })}
      />
    </div>
  );
}
