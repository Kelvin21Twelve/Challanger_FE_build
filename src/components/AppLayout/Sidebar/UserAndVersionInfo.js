import { useMe } from "@/queries";
import { getBuildVersionText } from "@/utils";

import MenuItemSeparator from "./MenuItemSeparator";

export default function UserAndVersionInfo() {
  const { data, isLoading } = useMe();
  const { success: information } = data || {};
  const { name, email } = information || {};

  return (
    <div className="font-medium text-center text-sm pb-5">
      {isLoading ? (
        <>
          <div className="bg-gray-200 animate-pulse p-1 mb-2" />
          <div className="bg-gray-200 animate-pulse p-1" />
        </>
      ) : (
        <>
          <div className="flex justify-center gap-1">
            <span>User:</span>
            <span className="capitalize">{name || "-"}</span>
          </div>
          <div>{email || "-"}</div>
        </>
      )}
      <MenuItemSeparator />
      <div>{getBuildVersionText()}</div>
    </div>
  );
}
