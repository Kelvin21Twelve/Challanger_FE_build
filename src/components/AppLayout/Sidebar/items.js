import {
  HomeIcon,
  FileIcon,
  UserIcon,
  CarsIcon,
  PrintIcon,
  RightArrowIcon,
} from "@/assets/icons/sidebar";

import { ACTIONS } from "@/contexts/ModelContexts";

export const pageIds = [
  "dashboard",
  "jobs",
  "memo",
  "cars",
  "inventory",
  "accounts",
  "hrms",
  "customers",
  "reports",
  "settings",
];

const menuItems = [
  {
    pageId: "dashboard",
    items: [
      {
        href: "/dashboard",
        label: "Dashboard",
        icon: <HomeIcon />,
        slug: "dash-view",
      },
      {
        href: "/dashboard/complete-jobs",
        label: "Complete Jobs",
        icon: <FileIcon />,
      },
      {
        href: "/dashboard/cab-history",
        label: "Cab History",
        icon: <FileIcon />,
      },
    ],
  },
  {
    pageId: "jobs",
    items: [
      {
        href: "/jobs",
        icon: <HomeIcon />,
        label: "Manage Jobs",
        slug: "job-card-view",
      },
      {
        href: "/jobs/complete-jobs",
        label: "Complete Jobs",
        icon: <FileIcon />,
      },
    ],
  },
  {
    pageId: "memo",
    items: [
      {
        href: "/memo",
        label: "Manage Memo",
        slug: "memo-view",
        icon: <UserIcon />,
      },
    ],
  },
  {
    pageId: "cars",
    items: [
      {
        href: "/cars",
        slug: "car-view",
        icon: <CarsIcon />,
        label: "Manage Cars",
      },
    ],
  },
  {
    pageId: "inventory",
    items: [
      {
        label: "Used Spare Parts",
        slug: "used-spare-parts-view",
        href: "/inventory/used-spare-parts",
      },
      {
        label: "New Spare Parts",
        href: "/inventory/new-spare-parts",
        slug: "new-spare-parts-view",
      },
      { label: "Spare Parts", isLabel: true },
      { label: "Spare Parts Return", href: "/inventory/spare-parts-return" },
      { label: "Spare Parts Purchase", isLabel: true },
      {
        label: "Spare Parts Purchase",
        href: "/inventory/spare-parts-purchase",
      },
      { label: "Purchase Return", isLabel: true },
      { label: "Purchase Return", href: "/inventory/purchase-return" },
    ].map((item) => ({
      ...item,
      icon: !item.isLabel ? <RightArrowIcon /> : null,
    })),
  },
  {
    pageId: "accounting",
    items: [
      {
        label: "Accounts",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
      },
      { label: "Tree of Accounts", href: "/accounting/tree-of-accounts" },
      { label: "Account Statement", isLabel: true },
      {
        label: "Print Account Statement",
        href: "/accounting/print-account-statement",
      },
      { label: "General Ledger", isLabel: true },
      { label: "General Ledger", href: "/accounting/general-ledger" },
      { label: "Supplier Payment", isLabel: true },
      { label: "Supplier Payment", href: "/accounting/supplier-payment" },
      { label: "Post Invoices", isLabel: true },
      { label: "Posting Invoices", href: "/accounting/posting-invoices" },
      { label: "Expense", isLabel: true },
      { label: "User Expense", href: "/accounting/user-expense" },
    ].map((item) => ({
      ...item,
      icon: !item.isLabel ? <RightArrowIcon /> : null,
    })),
  },
  {
    pageId: "hrms",
    items: [
      {
        label: "Manage Employee",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
      },
      { label: "Add Employee", href: "/hrms/add-employee" },
      {
        label: "Manage Payroll",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
      },
      {
        href: "/hrms/generate-payroll",
        label: "Generate Payroll",
      },

      {
        label: "Manage HRMS",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
      },
      {
        label: "Announcement",
        href: "/hrms/announcement",
        slug: "announcement-view",
      },
      { label: "Holidays", href: "/hrms/holidays", slug: "holidays-view" },
    ].map((item) => ({
      ...item,
      icon: !item.isLabel ? <RightArrowIcon /> : null,
    })),
  },
  {
    pageId: "customers",
    items: [
      {
        href: "/customers",
        label: "Manage Customers",
        slug: "customer-view",
        icon: <UserIcon />,
      },
    ],
  },
  {
    pageId: "reports",
    items: [
      {
        href: "/reports",
        label: "Reports",
        icon: <PrintIcon />,
      },
    ],
  },
  {
    pageId: "settings",
    items: [
      {
        label: "General Settings",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
      },
      {
        label: "Manage Make",
        href: "/settings/make",
        slug: "make-view",
      },
      { label: "Manage Model", href: "/settings/model", slug: "model-view" },
      {
        label: "Manage Engine Type",
        href: "/settings/engine-type",
        slug: "engine-menu-visible",
      },
      {
        label: "Manage Color",
        href: "/settings/color",
        slug: "color-view",
      },
      {
        label: "Manage Nationality",
        href: "/settings/nationality",
        slug: "nationality-view",
      },
      {
        label: "Manage Visa Type",
        href: "/settings/visa-type",
        slug: "visa-type-view",
      },
      {
        label: "Manage Vacation Type",
        href: "/settings/vacation-type",
        slug: "vacation-type-view",
      },
      {
        label: "Manage Service Type",
        href: "/settings/service-type",
        slug: "service-menu-visible",
      },
      {
        label: "Manage Labours",
        href: "/settings/labour",
        slug: "labour-view",
      },
      {
        label: "Manage Supplier",
        href: "/settings/supplier",
        slug: "supplier-view",
      },
      {
        label: "Manage Agencies",
        href: "/settings/agencies",
        slug: "agency-view",
      },
      {
        label: "Manage Job Title",
        href: "/settings/job-title",
        slug: "job-title-view",
      },
      {
        label: "Manage Brand",
        href: "/settings/brand",
      },
      {
        label: "Manage Invoice Type",
        href: "/settings/invoice-type",
      },
      {
        label: "Manage Expense Type",
        href: "/settings/expense-type",
      },
      {
        label: "Administration",
        isLabel: true,
        hasBorder: true,
        hasPadding: true,
        withSpaceAbove: true,
      },
      {
        label: "System User",
        slug: "system-user-view",
        href: "/settings/system-users",
      },
      {
        label: "Department",
        slug: "department-view",
        href: "/settings/department",
      },
      {
        href: "#",
        label: "Clear Inventory",
        slug: "clear-inventory-view",
        action: ACTIONS.clearInventoryAction,
      },
      {
        href: "#",
        slug: "system-rest-view",
        label: "Reset system to default",
        action: ACTIONS.resetSystemToDefaultAction,
      },
    ].map((item) => ({
      ...item,
      icon: !item.isLabel ? <RightArrowIcon /> : null,
    })),
  },
];

export default menuItems;
