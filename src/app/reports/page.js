"use client";

import { useMemo, useState } from "react";
import { Typography, Button } from "antd";
import { useTranslations } from "next-intl";

import { PrintIcon } from "@/assets/icons/actions";

import ViewEmailModal from "@/modals/reports/ViewEmailModal";
import ReportsFromModal from "@/modals/reports/ReportsFromModal";
import ReportOptionModal from "@/modals/reports/ReportOptionModal";

const { Title } = Typography;

function Card({ item }) {
  return (
    <div className="shadow-lg bg-white p-5 rounded-lg border border-[#00000020]">
      <div className="text-xl font-medium">{item.label}</div>
      <div className="text-sm pt-2">{item.description}</div>
      <div className="pt-5">{item.actions}</div>
    </div>
  );
}

function OptionAndEmailAction(props) {
  const { options, onClick, defaultOption } = props || {};

  const [selected, setSelected] = useState(defaultOption);

  return (
    <div className="inline-flex bg-[#007bff] text-white p-2.5 text-xs gap-2 rounded hover:shadow">
      <select
        defaultValue={defaultOption}
        className="bg-inherit outline-none"
        onChange={(e) => setSelected(e.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        type="button"
        className="cursor-pointer"
        onClick={() => onClick({ ...props, selected })}
      >
        <PrintIcon />
      </button>
    </div>
  );
}

export default function Page() {
  const t = useTranslations("reports");
  const [reportData, setReportData] = useState(null);

  const [viewAndSendEmailModal, setViewAndSendEmailModal] = useState(null);
  const [supplierReportOpen, setSupplierReportOpen] = useState(false);
  const [expenseReportOpen, setExpenseReportOpen] = useState(false);
  const [reportsFromModal, setReportsFromModal] = useState("");

  const items = useMemo(
    () => [
      {
        id: 1,
        label: t("Customer Details"),

        viewEmailModule: "customer_details",
        viewFileEndpoint: "print_customer_details",

        sendEmailModule: "customer_detailsMail",
        sendEmailEndpoint: "mail_customer_details",

        description: t("description1"),
        actions: (
          <Button type="primary" onClick={() => setViewAndSendEmailModal(1)}>
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 2,
        label: t("Job Cards"),
        description: t("description2"),
        actions: (
          <OptionAndEmailAction
            id={2}
            defaultOption="all"
            label={t("Job Cards")}
            onClick={(data) => {
              setReportData(data);
              setReportsFromModal(2);
            }}
            options={[
              {
                label: t("All"),
                value: "all",

                viewModule: "all",
                viewEmailEndpoint: "print_all_job_card",

                sendEmailModule: "allJobCardMail",
                sendEmailEndpoint: "mail_all_job_card_details",
              },
              {
                label: t("Posted"),
                value: "posted",

                viewModule: "posted",
                viewEmailEndpoint: "print_posted_card",

                sendEmailModule: "postedMail",
                sendEmailEndpoint: "mail_posted_card",
              },
              {
                label: t("Unposted"),
                value: "unposted",

                viewModule: "unposted",
                viewEmailEndpoint: "print_unposted_card",

                sendEmailModule: "unpostedMail",
                sendEmailEndpoint: "mail_unposted_card",
              },
              {
                label: t("Cancelled"),
                value: "cancelled",

                viewModule: "canceled",
                viewEmailEndpoint: "print_canceled_card",

                sendEmailModule: "canceledMail",
                sendEmailEndpoint: "mail_canceled_card",
              },
              {
                label: t("Labours"),
                value: "labours",

                viewModule: "labours",
                viewEmailEndpoint: "print_labours_card",

                sendEmailModule: "laboursMail",
                sendEmailEndpoint: "mail_labours_card",
              },
            ]}
          />
        ),
      },
      {
        id: 3,
        label: t("Spare Parts Sales"),
        description: t("description3"),
        actions: (
          <OptionAndEmailAction
            id={3}
            defaultOption="All"
            onClick={(data) => {
              setReportData(data);
              setReportsFromModal(3);
            }}
            options={[
              {
                label: t("All"),
                value: "all",

                viewEmailEndpoint: "print_all_spare_parts_sale",
                sendEmailEndpoint: "mail_all_spare_parts_sale",

                viewModule: "allspsales",
                sendEmailModule: "allspsalesMail",
              },
              {
                label: t("With Job Card"),
                value: "with_job_card",

                viewEmailEndpoint: "print_with_job_card",
                sendEmailEndpoint: "mail_with_job_card",

                viewModule: "with_job_card",
                sendEmailModule: "with_job_cardMail",
              },
              {
                label: t("Without Job Card"),
                value: "without_job_card",

                viewEmailEndpoint: "print_without_job_card",
                sendEmailEndpoint: "mail_without_job_card",

                viewModule: "without_job_card",
                sendEmailModule: "without_job_cardMail",
              },
            ]}
          />
        ),
      },
      {
        id: 4,
        label: t("Payment Report"),
        description: t("description4"),
        actions: (
          <OptionAndEmailAction
            id={4}
            defaultOption={t("Daily Details")}
            onClick={(data) => {
              setReportData(data);
              setReportsFromModal(4);
            }}
            options={[
              {
                label: t("Daily Details"),
                value: "daily_details",

                sendEmailEndpoint: "mail_daily_details",
                viewEmailEndpoint: "print_daily_details",

                viewModule: "daily_details",
                sendEmailModule: "daily_detailsMail",
              },
              {
                label: t("Daily Summary"),
                value: "daily_summary",

                viewEmailEndpoint: "print_daily_summery",
                sendEmailEndpoint: "mail_daily_summery",

                viewModule: "daily_summery",
                sendEmailModule: "daily_summeryMail",
              },
            ]}
          />
        ),
      },
      {
        id: 5,
        label: t("Spare Parts Purchase"),
        description: t("description5"),
        actions: (
          <OptionAndEmailAction
            id={5}
            onClick={(data) => {
              setReportData(data);
              setReportsFromModal(5);
            }}
            defaultOption={t("Daily Details")}
            options={[
              {
                label: t("All"),
                value: "all",

                sendEmailEndpoint: "mail_all_sp_part_purchase",
                viewEmailEndpoint: "mail_all_sp_part_purchase",

                sendEmailModule: "all_sp_part_purchaseMail",
                viewModule: "all_sp_part_purchase",
              },
              {
                label: t("Posted"),
                value: "posted",

                sendEmailEndpoint: "print_post_sp_part_purchase",
                viewEmailEndpoint: "print_post_sp_part_purchase",

                sendEmailModule: "post_sp_part_purchaseMail",
                viewModule: "post_sp_part_purchase",
              },
              {
                label: t("Unposted"),
                value: "unposted",

                sendEmailEndpoint: "mail_unpost_sp_part_purchase",
                viewEmailEndpoint: "print_unpost_sp_part_purchase",

                sendEmailModule: "unpost_sp_part_purchaseMail",
                viewModule: "unpost_sp_part_purchase",
              },
            ]}
          />
        ),
      },
      {
        id: 6,
        label: t("Employees Target Report"),

        viewEmailModule: "users_target_report",
        viewFileEndpoint: "print_users_target_report",

        sendEmailModule: "users_target_reportMail",
        sendEmailEndpoint: "mail_users_target_report",

        description: t("description6"),
        actions: (
          <Button type="primary" onClick={() => setViewAndSendEmailModal(6)}>
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 7,
        label: t("End Of Day"),

        viewEmailModule: "end_of_day",
        viewFileEndpoint: "print_end_of_day",

        sendEmailModule: "mail_end_of_day",
        sendEmailEndpoint: "end_of_dayMail",

        description: t("description7"),
        actions: (
          <Button type="primary" onClick={() => setViewAndSendEmailModal(7)}>
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 8,
        label: t("Spare Parts Net Profit"),
        description: t("description8"),
        actions: (
          <Button
            type="primary"
            onClick={() => {
              setReportData({
                selected: "all",
                options: [
                  {
                    label: "all",
                    value: "all",
                    viewModule: "net_profit",
                    sendEmailModule: "spare_parts_net_profitMail",
                    sendEmailEndpoint: "mail_spare_parts_net_profit",
                    viewEmailEndpoint: "print_spare_parts_net_profit",
                  },
                ],
              });
              setReportsFromModal(8);
            }}
          >
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 9,
        label: t("Inventory"),

        viewEmailModule: "inventory",
        viewFileEndpoint: "print_inventory",

        sendEmailModule: "inventoryMail",
        sendEmailEndpoint: "mail_inventory",

        description: t("description9"),
        actions: (
          <Button type="primary" onClick={() => setViewAndSendEmailModal(9)}>
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 10,
        label: t("Supplier"),
        description: t("description10"),
        actions: (
          <Button type="primary" onClick={() => setSupplierReportOpen(true)}>
            <PrintIcon />
          </Button>
        ),
      },
      {
        id: 11,
        label: t("Expense Report"),
        description: t("description11"),
        actions: (
          <Button type="primary" onClick={() => setExpenseReportOpen(true)}>
            <PrintIcon />
          </Button>
        ),
      },
    ],
    [t],
  );

  return (
    <div>
      <Title level={2}>{t("Reports")}</Title>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 flex-wrap pt-2">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </div>

      <ReportsFromModal
        open={!!reportsFromModal}
        onClose={() => {
          setReportData(null);
          setReportsFromModal(null);
        }}
        data={{
          ...(items.find((item) => item.id === reportsFromModal) || {}),
          ...reportData,
        }}
      />

      <ViewEmailModal
        open={!!viewAndSendEmailModal}
        onClose={() => setViewAndSendEmailModal(null)}
        data={items.find((item) => item.id === viewAndSendEmailModal)}
      />

      <ReportOptionModal
        isSupplierReport
        open={supplierReportOpen}
        sendModule="mail_supplier_report"
        viewModule="mail_supplier_report"
        viewEndpoint="mail_supplier_report"
        onClose={() => setSupplierReportOpen(false)}
      />

      <ReportOptionModal
        isExpenseReport
        open={expenseReportOpen}
        sendModule="mail_expense_report"
        viewModule="print_expense_report"
        viewEndpoint="print_expense_report"
        onClose={() => setExpenseReportOpen(false)}
      />
    </div>
  );
}
