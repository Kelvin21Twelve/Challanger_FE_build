import Swal from "sweetalert2";
import { version } from "../../package.json";

export const showConfirmBox = async () =>
  Swal.fire({
    showCancelButton: true,
    showConfirmButton: true,
    title: modalsT("Are you sure?"),
    cancelButtonText: modalsT("Cancel"),
    cancelButtonColor: "rgb(221, 51, 51)",
    confirmButtonText: modalsT("Yes, delete it!"),
    confirmButtonColor: "rgb(48, 133, 214)",
    text: modalsT("You won't be able to revert this!"),
  });

export const permissions = [
  {
    label: "Make",
    baseValue: "make",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Model",
    baseValue: "model",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Color",
    baseValue: "color",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Nationality",
    baseValue: "nationality",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Visa Type",
    baseValue: "visa-type",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Vacation Type",
    baseValue: "vacation-type",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Labour",
    baseValue: "labour",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Supplier",
    baseValue: "supplier",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Agency",
    baseValue: "agency",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Job Title",
    baseValue: "job-title",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "System User",
    baseValue: "system-user",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Department",
    baseValue: "department",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Customer",
    baseValue: "customer",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Used Spare Parts",
    baseValue: "used-spare-parts",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "New Spare Parts",
    baseValue: "new-spare-parts",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Car",
    baseValue: "car",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Spare Parts Sales Form",
    baseValue: "spare-parts-sales-form",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Job Card",
    baseValue: "job-card",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Customers Used Spare Parts",
    baseValue: "customers-used-spare-parts",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Job Card Payment",
    baseValue: "customers-new-spare-parts",
    actions: ["add", "-", "delete", "view"],
  },
  {
    label: "Customers Labour",
    baseValue: "customers-labour",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Memo",
    baseValue: "memo",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Holydays",
    baseValue: "holidays",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Announcements",
    baseValue: "announcement",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Import Attendance",
    baseValue: "import-attendance",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Generate Salary Slip",
    baseValue: "generate-salaryslip",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Visa Notification",
    baseValue: "visa-notification",
    actions: ["-", "-", "-", "visible"],
  },
  {
    label: "HRMS",
    baseValue: "hrms-menu",
    actions: ["add", "edit", "delete", "visible"],
  },
  {
    label: "Engine Type",
    baseValue: "engine-menu",
    actions: ["add", "edit", "delete", "visible"],
  },
  {
    label: "Service Type",
    baseValue: "service-menu",
    actions: ["add", "edit", "delete", "visible"],
  },
  {
    label: "Add Attendance",
    baseValue: "attendance",
    actions: ["add", "-", "-", "-"],
  },
  {
    label: "User Expenses",
    baseValue: "expense",
    actions: ["add", "edit", "delete", "view"],
  },
  {
    label: "Dashboard",
    baseValue: "dash",
    actions: ["-", "-", "-", "view"],
  },
  {
    label: "Clear Inventory",
    baseValue: "clear-inventory",
    actions: ["-", "-", "-", "view"],
  },
  {
    label: "System Reset",
    baseValue: "system-rest",
    actions: ["-", "-", "-", "view"],
  },
].map((item) => ({
  ...item,
  slugs: item.actions
    .map((action) => (action != "-" ? `${item.baseValue}-${action}` : ""))
    .filter((slug) => !!slug),
}));

export const paymentMethodOptions = [
  {
    label: "Cash",
    value: "1",
  },
  {
    label: "K-NET",
    value: "2",
  },
  {
    label: "Visa",
    value: "3",
  },
  {
    label: "Master",
    value: "4",
  },
  {
    label: "Labour Discount",
    value: "5",
  },
];

export const getPaymentMethod = (payBy) =>
  paymentMethodOptions.find((item) => item.value == payBy)?.label;

export const getColorByStatus = (status) => {
  switch (status) {
    case "paid_wait":
      return "rgb(128, 130, 255)";

    case "print_req":
      return "rgb(255, 133, 255)";

    case "delivery":
      return "rgb(255, 255, 255)";

    case "under_test":
      return "rgb(118, 186, 255)";

    case "on_change":
      return "rgb(178, 239, 26)";

    case "cancel_req":
      return "rgb(255, 221, 30)";

    case "clean_polish":
      return "rgb(14, 222, 205)";

    case "pending":
      return "rgb(7, 138, 213)";

    case "paint":
      return "rgb(252, 160, 3)";

    case "working":
      return "#69ed87";

    case "delay":
      return "#ff6766";

    default:
      return "#eee";
  }
};

export const handle422Errors = (form, response) => {
  const { server_errors, errors, success, msg, error } = response || {};

  if (!success && !!msg && !server_errors) {
    Swal.fire({ text: msg });
    return true;
  }

  if (!server_errors && !errors && !error) return false;

  const mainErrors = server_errors || errors || error;

  const keys = Object.keys(mainErrors);
  if (keys.length === 0) return false;

  keys.forEach((key) => {
    form.setFields([
      {
        name: key,
        errors: mainErrors[key],
      },
    ]);
  });

  return true;
};

export const showTotal = (total, range) =>
  `${modalsT("Showing")} ${range[0]}-${range[1]} ${modalsT("of")} ${total} ${modalsT("data")}`;

export const getBuildVersionText = () => `Version ${version}: October-2025`;
