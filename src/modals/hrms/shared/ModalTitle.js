import { Actions } from "./Actions";

export function ModalTitle({ title, recordId, isFormLock, onAction }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      <div className="text-3xl">{title}</div>
      <Actions
        isFormLock={isFormLock}
        recordId={recordId}
        onAction={onAction}
      />
    </div>
  );
}
