import { Table, Button } from "antd";
import { useMemo, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ViewIcon } from "@/assets/icons/actions";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { useCommonDelete } from "@/queries";
import { showConfirmBox, useTableSearch } from "@/utils";

import { SearchBar } from ".";

export function ModalTable({
  loading,
  columns,
  dataSource,
  deleteModal,
  onClickView,
  rowId = "id",
}) {
  const t = useTranslations("modals");
  const { mutate: handleDelete } = useCommonDelete(deleteModal);

  const { setRecords, filteredData, isSearchLoading, setQueryValue } =
    useTableSearch(columns?.map((item) => item.dataIndex) || []);

  useEffect(() => {
    setRecords(dataSource || []);
  }, [dataSource, setRecords]);

  const savedColumns = useMemo(
    () => [
      ...columns,
      {
        key: "action",
        title: t("Action"),
        dataIndex: "action",
        render: (_, item) => (
          <div className="flex gap-2">
            <Button
              size="small"
              type="primary"
              className="[&_svg]:w-[20px]"
              onClick={() => onClickView(item)}
            >
              <ViewIcon />
            </Button>
            <Button
              danger
              size="small"
              type="primary"
              icon={<FontAwesomeIcon icon={faTrash} />}
              onClick={() =>
                showConfirmBox().then(
                  ({ isConfirmed }) => isConfirmed && handleDelete(item.id),
                )
              }
            />
          </div>
        ),
      },
    ],
    [columns, handleDelete, onClickView, t],
  );

  return (
    <div>
      <div className="pb-3">
        <SearchBar
          setQueryValue={setQueryValue}
          isSearchLoading={isSearchLoading}
        />
      </div>

      <Table
        className="border-[#dfe0e1] min-h-60 max-w-full overflow-x-auto"
        dataSource={filteredData}
        columns={savedColumns}
        pagination={false}
        loading={loading}
        rowId={rowId}
        size="small"
        bordered
      />
    </div>
  );
}
