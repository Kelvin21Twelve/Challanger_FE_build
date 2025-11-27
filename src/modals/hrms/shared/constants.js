import { Form } from "antd";
import Swal from "sweetalert2";
import { useMemo, useCallback, useEffect, useState } from "react";

import { handle422Errors } from "@/utils";

export const typeOptions = [
  { value: 1, label: "Bonus" },
  { value: 2, label: "Temporary Bonus" },
  { value: 3, label: "Perminant Bonus" },
  { value: 4, label: "Allowance" },
];

export function useCommonModalOperations({
  data,
  onClose,
  refetch,
  response,
  employeeId,
  filterCallback,
}) {
  const [form] = Form.useForm();
  const [filterData, setFilterData] = useState();
  const [isFormLock, setIsFormLock] = useState(false);

  const hasFilter = !!filterData && filterCallback;

  const tableData = useMemo(
    () => (data?.data || []).filter((item) => item.user_id == employeeId),
    [data?.data, employeeId],
  );

  const filteredData = useMemo(
    () =>
      hasFilter
        ? tableData.filter((item) => filterCallback(item, filterData))
        : tableData,
    [hasFilter, tableData, filterCallback, filterData],
  );

  const resetForm = useCallback(() => {
    form.resetFields();
    setIsFormLock(false);
  }, [form]);

  const handleActions = useCallback(
    (action) => {
      switch (action) {
        case "add":
        case "cancel":
          return resetForm();

        case "edit":
          setIsFormLock(false);
          setIsFormLock(false);
          return;

        case "save":
          return form.submit();
      }
    },
    [form, resetForm],
  );

  const handleClose = useCallback(() => {
    form.resetFields();
    setIsFormLock(false);
    onClose();
  }, [form, onClose]);

  useEffect(() => {
    if (response?.success) {
      refetch();
      Swal.fire({ text: response?.msg });
      resetForm();
      return;
    }

    handle422Errors(form, response);
  }, [form, refetch, resetForm, response]);

  return {
    form,
    isFormLock,
    handleClose,
    setIsFormLock,
    handleActions,
    setFilterData,
    tableData: filteredData,
  };
}
