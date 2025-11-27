"use client";

import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Typography, Form } from "antd";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

import { showConfirmBox, handle422Errors } from "@/utils";
import {
  useSyncDbQuery,
  useCommonDelete,
  useGetSalaryPrint,
  useCreateEditEmployee,
} from "@/queries";

import DeductionFormModal from "@/modals/hrms/DeductionForm";
import AdditionFormModal from "@/modals/hrms/AdditionForm";
import VacationFormModal from "@/modals/hrms/VacationForm";
import AbsenceFormModal from "@/modals/hrms/AbsenceForm";
import WarningFormModal from "@/modals/hrms/WarningForm";
import ExcuseFormModal from "@/modals/hrms/ExcuseForm";

import { Actions, EmployeeForm, SearchForm, Sidebar } from "./components";

const { Title } = Typography;
const { useForm, useWatch } = Form;

export default function Page() {
  const t = useTranslations("add-employee");
  const { mutate: printSalary } = useGetSalaryPrint();
  const { mutate, data: deleteResponse, reset } = useCommonDelete("User");
  const {
    refetch,
    data: userData,
    isLoading: employeeLoading,
  } = useSyncDbQuery("User");
  const {
    reset: insertUpdateReset,
    data: insertUpdateResponse,
    mutate: handleInsertUpdateSubmit,
  } = useCreateEditEmployee();

  const [modelId, setModelId] = useState(false);
  const [isFormLock, setIsFormLock] = useState(false);

  const [form] = useForm();
  const selectedEmployee = useWatch("selectedEmployee", form);
  const employees = useMemo(
    () => userData?.data?.filter((item) => item.department == "7") || [],
    [userData],
  );

  const resetForm = useCallback(() => {
    setIsFormLock(false);
    setIsFormLock(false);
    setIsFormLock(false);
    setIsFormLock(false);
    form.resetFields();
  }, [form]);

  const handleSubmit = useCallback(() => {
    const {
      selectedEmployee,
      name_in_arabic,
      unique_code,
      nationality,
      join_date,
      job_title,
      civil_id,
      name,
      dob,
      email,
      salary,
      pass_no,
      visa_end,
      password,
      pass_end,
      visa_type,
      visa_start,
      pass_start,
    } = form.getFieldsValue() || {};

    const payload = {
      employee_id: selectedEmployee,
      ara_name: name_in_arabic,
      user_type: "hrms",
      department: 7,
      unique_code,
      nationality,
      job_title,
      join_date,
      civil_id,
      password,
      salary,
      email,
      dob,
      name,
      pass_no,
      pass_end,
      visa_end,
      visa_type,
      visa_start,
      pass_start,
    };

    handleInsertUpdateSubmit(payload);
  }, [form, handleInsertUpdateSubmit]);

  const handleButtonActions = async (action) => {
    switch (action) {
      case "add":
      case "cancel":
        return resetForm();

      case "edit":
        setIsFormLock(false);
        setIsFormLock(false);
        setIsFormLock(false);
        setIsFormLock(false);
        return;

      case "save":
        return form.submit();

      case "delete":
        return showConfirmBox().then(
          ({ isConfirmed }) => isConfirmed && mutate(selectedEmployee),
        );
    }
  };

  const handleSidebarAction = (action) => {
    if (selectedEmployee) {
      setModelId(action);
      return;
    }

    Swal.fire({ text: t("Please select an employee first!") });
  };

  const handleSalaryPrint = useCallback(() => {
    if (modelId === "salaryRel") {
      Swal.fire({
        text: t(
          "Print generation will take few minutes, Don't close the page!",
        ),
      });
      setModelId();

      const employee = employees.find((item) => item.id == selectedEmployee);
      if (employee) {
        const { name } = employee || {};
        printSalary(name);
      }
    }
  }, [employees, modelId, printSalary, selectedEmployee, t]);

  useEffect(() => {
    if (insertUpdateResponse?.success) {
      Swal.fire({ text: insertUpdateResponse.msg });
      refetch();
      insertUpdateReset();
      resetForm();
    }

    handle422Errors(form, insertUpdateResponse);
  }, [
    form,
    refetch,
    resetForm,
    selectedEmployee,
    insertUpdateReset,
    insertUpdateResponse,
  ]);

  useEffect(() => {
    if (deleteResponse?.success) {
      Swal.fire({ text: t("Employee is deleted successfully!") });
      reset();
      resetForm();
    }
  }, [deleteResponse, form, reset, resetForm, t]);

  useEffect(() => {
    if (selectedEmployee) {
      const {
        visa_start,
        pass_start,
        join_date,
        pass_end,
        visa_end,
        dob,
        ...rest
      } = employees.find((item) => item.id == selectedEmployee) || {};

      setIsFormLock(true);

      form.setFieldsValue({
        ...rest,
        dob: !!dob ? dayjs(dob) : "",
        visa_end: !!visa_end ? dayjs(visa_end) : "",
        pass_end: !!pass_end ? dayjs(pass_end) : "",
        join_date: !!join_date ? dayjs(join_date) : "",
        visa_start: !!visa_start ? dayjs(visa_start) : "",
        pass_start: !!pass_start ? dayjs(pass_start) : "",
      });
    }
  }, [employees, form, selectedEmployee]);

  useEffect(() => {
    handleSalaryPrint();
  }, [handleSalaryPrint, modelId]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center">
        <Title level={2}>{t("Employee Form")}</Title>
        <Actions
          hasEmployee={!!selectedEmployee}
          onAction={handleButtonActions}
          isFormLock={isFormLock}
        />
      </div>

      <div className="border-b pb-3 border-[#e5e5e5]" />

      <SearchForm
        t={t}
        form={form}
        employees={employees}
        employeeLoading={employeeLoading}
      />

      <div className="border-b pb-2.5 border-[#e5e5e5]" />

      <div className="pt-6 flex flex-wrap gap-8">
        <EmployeeForm
          t={t}
          form={form}
          isFormLock={isFormLock}
          onSubmit={handleSubmit}
          hasSelectedEmployee={!!selectedEmployee}
        />

        <Sidebar t={t} onAction={handleSidebarAction} />

        <AdditionFormModal
          employeeId={selectedEmployee}
          open={modelId == "additions"}
          onClose={() => setModelId()}
        />

        <DeductionFormModal
          employeeId={selectedEmployee}
          open={modelId == "deductions"}
          onClose={() => setModelId()}
        />

        <VacationFormModal
          employeeId={selectedEmployee}
          open={modelId == "vacations"}
          onClose={() => setModelId()}
        />

        <AbsenceFormModal
          employeeId={selectedEmployee}
          open={modelId == "absences"}
          onClose={() => setModelId()}
        />

        <WarningFormModal
          employeeId={selectedEmployee}
          open={modelId == "warnings"}
          onClose={() => setModelId()}
        />

        <ExcuseFormModal
          employeeId={selectedEmployee}
          open={modelId == "excuses"}
          onClose={() => setModelId()}
        />
      </div>
    </div>
  );
}
