import { useTranslations } from "next-intl";

import FiledSet from "@/components/FiledSet";

export default function JobCardInfoContainer({ data }) {
  const t = useTranslations("modals");

  const {
    data: createdBy,
    kilo_meters,
    car_engine,
    entry_date,
    entry_time,
    cust_name,
    view_type,
    plate_no,
    agency,
    cab_no,
    job_no,
    color,
    model,
    phone,
  } = data;

  return (
    <FiledSet label={t("Job Card Details")}>
      <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-4">
        <table>
          <thead className="hidden">
            <tr>
              <th>Field Name</th>
              <th>Field Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="min-w-24">{t("Job No")} :</td>
              <td>{job_no}</td>
            </tr>
            <tr>
              <td>{t("Customer")} :</td>
              <td>{cust_name}</td>
            </tr>
            <tr>
              <td>{t("Car Agency")} :</td>
              <td>{agency}</td>
            </tr>
            <tr>
              <td>{t("Model Year")} :</td>
              <td>{model}</td>
            </tr>
            <tr>
              <td>{t("Car Type")} :</td>
              <td>{view_type}</td>
            </tr>
            <tr>
              <td>{t("Car Color")} :</td>
              <td>{color}</td>
            </tr>
            <tr>
              <td>{t("Cab No")} :</td>
              <td>{cab_no}</td>
            </tr>
          </tbody>
        </table>

        <table>
          <thead className="hidden">
            <tr>
              <th>Field Name</th>
              <th>Field Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="min-w-28">{t("Phone")} :</td>
              <td>{phone}</td>
            </tr>
            <tr>
              <td>{t("Plate No")} :</td>
              <td>{plate_no}</td>
            </tr>
            <tr>
              <td>{t("Entry Date")} :</td>
              <td>{entry_date}</td>
            </tr>
            <tr>
              <td>{t("Entry Time")} :</td>
              <td>{entry_time}</td>
            </tr>
            <tr>
              <td>{t("Kilometers")} :</td>
              <td>{kilo_meters}</td>
            </tr>
            <tr>
              <td>{t("Created By")} :</td>
              <td>{createdBy}</td>
            </tr>
            <tr>
              <td>{t("Engine")} :</td>
              <td>{car_engine}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </FiledSet>
  );
}
