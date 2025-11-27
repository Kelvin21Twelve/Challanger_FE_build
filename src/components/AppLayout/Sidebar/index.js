"use client";

import clsx from "clsx";
import Swal from "sweetalert2";
import { usePathname, redirect } from "next/navigation";
import { useContext, useCallback, useState, useEffect } from "react";

import {
  LogoutIcon,
  SidebarMenuIcon,
  ChangePasswordIcon,
} from "@/assets/icons";

import { UserContext } from "@/contexts/UserContext";
import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import MenuItem from "./MenuItem";
import JobActions from "./JobActions";
import LanguageSwitcher from "./LanguageSwitcher";
import MenuItemSeparator from "./MenuItemSeparator";
import UserAndVersionInfo from "./UserAndVersionInfo";

import menuItems from "./items";

export function Sidebar() {
  const pageId = usePathname();
  const [, dispatch] = useContext(ModelContext);
  const { permissions } = useContext(UserContext);

  const [actionSidebar, setActionSidebar] = useState(true);

  const pageWiseMenu = menuItems.find((item) => pageId.includes(item.pageId));
  const { items = [] } = pageWiseMenu || {};

  const handleLogout = useCallback(async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancel",
      confirmButtonText: "Logout!",
      confirmButtonColor: "#007bff",
      cancelButtonColor: "rgb(221, 51, 51)",
      title: "Are you sure?",
    });

    if (isConfirmed) {
      localStorage.clear();
      redirect("/login");
    }
  }, []);

  useEffect(() => {
    setActionSidebar(false);
  }, [pageId]);

  return (
    <div
      {...(actionSidebar ? { "data-custom": "true" } : {})}
      className={clsx(
        "border-[#dfe0e1] bg-[#f8f9fa] text-[#414141] sm:!w-[229px]",
        "absolute max-h-full overflow-y-auto sm:static max-w-full top-0",
        "sm:left-[unset] sm:top-[unset] z-50 border border-l-0 left-0",
        "data-[custom]:w-auto",
      )}
    >
      <button
        className="sm:hidden p-1 text-gray-500"
        onClick={() => setActionSidebar((prev) => !prev)}
      >
        <SidebarMenuIcon />
      </button>
      <div
        {...(actionSidebar ? { "data-custom": "true" } : {})}
        className="hidden data-[custom]:block sm:!block"
      >
        <div className="pt-2 border-t border-[#dfe0e1]">
          <div key={pageId}>
            {items.map(
              (item) =>
                (!item.slug || permissions.includes(item.slug)) && (
                  <MenuItem
                    {...item}
                    isActive={pageId === item.href}
                    key={item.label + pageId + item.isLabel}
                    onClick={() => dispatch({ type: item.action })}
                  />
                ),
            )}
          </div>

          {pageId === "/jobs" && <JobActions />}

          <div className="-my-2">
            <MenuItemSeparator />
          </div>

          <MenuItem
            href="#"
            label="Change Password"
            icon={<ChangePasswordIcon />}
            onClick={() =>
              dispatch({ type: ACTIONS.toggleIsChangePasswordModalOpen })
            }
          />

          <MenuItem
            href="#"
            label="Logout"
            icon={<LogoutIcon />}
            onClick={handleLogout}
          />
          <LanguageSwitcher />
        </div>
        <UserAndVersionInfo />
      </div>
    </div>
  );
}
