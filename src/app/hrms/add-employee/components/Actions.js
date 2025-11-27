import { Button } from "antd";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faX,
  faPlus,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export function Actions({ hasEmployee, isFormLock, onAction }) {
  return (
    <div className="flex items-center gap-0.5 rounded overflow-hidden">
      <Button
        type="primary"
        onClick={() => onAction("add")}
        className="!rounded-none"
      >
        <FontAwesomeIcon icon={faPlus} className="!h-4.5" />
      </Button>

      {hasEmployee && (
        <Button
          type="primary"
          onClick={() => onAction("edit")}
          className="!bg-[#28a745] !rounded-none"
        >
          <FontAwesomeIcon icon={faEdit} className="!h-4" />
        </Button>
      )}

      {!isFormLock && (
        <Button
          type="primary"
          onClick={() => onAction("save")}
          className="!bg-[#ffc107] !rounded-none"
        >
          <FontAwesomeIcon icon={faSave} className="!h-4.5" />
        </Button>
      )}

      {hasEmployee && (
        <Button
          type="primary"
          onClick={() => onAction("delete")}
          className="!bg-[#dc3545] !rounded-none"
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      )}

      <Button
        type="primary"
        onClick={() => onAction("cancel")}
        className="!bg-[#6c757d] !rounded-none"
      >
        <FontAwesomeIcon icon={faX} />
      </Button>
    </div>
  );
}
