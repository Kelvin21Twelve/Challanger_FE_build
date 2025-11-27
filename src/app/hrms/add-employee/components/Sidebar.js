import { Button } from "antd";

export function Sidebar({ t, onAction }) {
  return (
    <div className="flex flex-col gap-1 w-48">
      <div className="border rounded h-28 mb-4 border-[#e5e5e5]" />

      <Button
        className="!bg-[#6c757d] !rounded-bl-none !rounded-br-none"
        onClick={() => onAction("additions")}
        type="primary"
        block
      >
        {t("Additions")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("deductions")}
        type="primary"
        block
      >
        {t("Deductions")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("vacations")}
        type="primary"
        block
      >
        {t("Vacations")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("excuses")}
        type="primary"
        block
      >
        {t("Excuses")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("absences")}
        type="primary"
        block
      >
        {t("Absences")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("warnings")}
        type="primary"
        block
      >
        {t("Warnings")}
      </Button>

      <Button
        className="!bg-[#6c757d] !rounded-none"
        onClick={() => onAction("salaryRel")}
        type="primary"
        block
      >
        {t("Salary Rel")}
      </Button>
    </div>
  );
}
