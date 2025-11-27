import { Button } from "antd";
import { faSave } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faPlus, faEdit } from "@fortawesome/free-solid-svg-icons";

export function Actions({ recordId, onAction, isFormLock }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-0.5 overflow-hidden rounded">
        <Button
          type="primary"
          onClick={() => onAction("add")}
          className="!rounded-none !shadow-none"
        >
          <FontAwesomeIcon icon={faPlus} className="!h-4.5" />
        </Button>

        {recordId && (
          <Button
            type="primary"
            onClick={() => onAction("edit")}
            className="!rounded-none !bg-[#28a745] !shadow-none"
          >
            <FontAwesomeIcon icon={faEdit} className="!h-4" />
          </Button>
        )}

        {!isFormLock && (
          <Button
            type="primary"
            onClick={() => onAction("save")}
            className="!rounded-none !bg-[#ffc107] !shadow-none"
          >
            <FontAwesomeIcon icon={faSave} className="!h-4.5" />
          </Button>
        )}

        <Button
          type="primary"
          onClick={() => onAction("cancel")}
          className="!rounded-none !bg-[#6c757d] !shadow-none"
        >
          <FontAwesomeIcon icon={faX} />
        </Button>
      </div>
    </div>
  );
}
