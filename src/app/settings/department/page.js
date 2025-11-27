"use client";

import { Button, Typography } from "antd";
import { useTranslations } from "next-intl";
import { useEffect, useState, useContext } from "react";

import { showConfirmBox } from "@/utils";
import { useDeleteRole, useSyncDbQuery } from "@/queries";

import { UserContext } from "@/contexts/UserContext";

import { TrashIcon, EditIcon } from "@/assets/icons/actions";

import UpdatePermissionModal from "@/modals/settings/UpdatePermission";
import CreateEditDepartment from "@/modals/settings/CreateEditDepartment";

const { Title } = Typography;

function Card({ item, onEdit, onDelete }) {
  const { name, description } = item || {};

  return (
    <div className="shadow-lg bg-white p-4 rounded-md flex flex-col gap-2 border border-[#dfe0e1] min-h-[240px]">
      <div className="text-xl font-medium">{name}</div>
      <div className="text-sm grow">{description}</div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="primary" onClick={onEdit}>
          <EditIcon />
        </Button>
        <Button type="primary" danger onClick={onDelete}>
          <TrashIcon />
        </Button>
      </div>
    </div>
  );
}

export default function Page() {
  const t = useTranslations("settings");
  const { data, refetch } = useSyncDbQuery("Role");
  const { mutate, data: response } = useDeleteRole();

  const { permissions } = useContext(UserContext);

  const [deleteId, setDeleteId] = useState(null);
  const [roleData, setRoleData] = useState(null);
  const [isCreateRoleOpen, setIsCreateRoleOpen] = useState(false);
  const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

  useEffect(() => {
    if (deleteId) mutate(deleteId);
  }, [deleteId, mutate]);

  useEffect(() => {
    if (response?.success) {
      setDeleteId(null);
      refetch();
    }
  }, [refetch, response]);

  useEffect(() => {
    if (!permissions.includes("department-view"))
      redirect("/settings/expense-type");
  }, [permissions]);

  return (
    <div>
      <div className="flex flex-wrap justify-between items-center pb-2">
        <Title level={2}>{t("Manage Permission")}</Title>

        {permissions.includes("role-add") && (
          <Button type="primary" onClick={() => setIsCreateRoleOpen(true)}>
            {t("Create")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 flex-wrap">
        {data?.data?.map((item) => (
          <Card
            item={item}
            key={item.id}
            onDelete={() =>
              showConfirmBox().then(({ isConfirmed }) =>
                isConfirmed ? setDeleteId(item.id) : null,
              )
            }
            onEdit={() => {
              setRoleData(item);
              setIsUpdateRoleOpen(true);
            }}
          />
        ))}
      </div>

      <CreateEditDepartment
        onRefetch={refetch}
        open={isCreateRoleOpen}
        onClose={() => setIsCreateRoleOpen(false)}
      />

      <UpdatePermissionModal
        data={roleData}
        onRefetch={refetch}
        open={isUpdateRoleOpen}
        onClose={() => {
          setRoleData(null);
          setIsUpdateRoleOpen(false);
        }}
      />
    </div>
  );
}
