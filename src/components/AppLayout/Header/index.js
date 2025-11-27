"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge, Drawer, Menu } from "antd";
import { useTranslations } from "next-intl";
import { useContext, useMemo, useState } from "react";
import { usePathname, redirect } from "next/navigation";

import {
  MenuIcon,
  CarsIcon,
  HrmsIcon,
  JobsIcon,
  SearchIcon,
  ReportsIcon,
  SettingsIcon,
  InventoryIcon,
  DashboardIcon,
  CustomersIcon,
  SparePartsIcon,
  AccountingIcon,
  NotificationIcon,
} from "@/assets/icons";

import { UserContext } from "@/contexts/UserContext";
import { ModelContext, ACTIONS } from "@/contexts/ModelContexts";

import Logo from "@/assets/images/logo.png";
import Mrafie from "@/assets/images/mrafie.png";

import HeaderItem from "./HeaderItem";

function MobileMenu({ items, onAction }) {
  const [drawer, setDrawer] = useState(false);

  const getSelectedKeys = () =>
    items.filter((item) => item.isActive).map((item) => String(item.id));

  const handleMenuClick = ({ key }) => {
    const { action, path, subPath } =
      items.find((item) => String(item.id) === key) || {};

    if (action) {
      onAction(action);
      setDrawer(false);
      return;
    }

    if (path) {
      const url = path + (subPath || "") || "#";
      setDrawer(false);
      redirect(url);
    }
  };

  const getItems = () =>
    items?.map(({ id, label, icon }) => ({
      label,
      key: String(id),
      icon: <span className="[&_svg]:w-4 [&_svg]:h-4">{icon}</span>,
    })) || [];

  return (
    <div className="h-full flex items-center justify-center min-w-12 lg:hidden">
      <button
        className="cursor-pointer"
        onClick={() => setDrawer((prev) => !prev)}
      >
        <MenuIcon />
      </button>

      <Drawer
        width={300}
        open={drawer}
        placement="right"
        onClose={() => setDrawer(false)}
        className="[&_.ant-drawer-body]:!p-2"
      >
        <Menu
          selectedKeys={getSelectedKeys()}
          onClick={handleMenuClick}
          className="!border-r-0"
          items={getItems()}
        />
      </Drawer>
    </div>
  );
}

export function Header() {
  const t = useTranslations("header");
  const pathName = usePathname();

  const { permissions } = useContext(UserContext);
  const [state, dispatch] = useContext(ModelContext);

  const headerItems = useMemo(
    () => [
      {
        id: 1,
        slug: "dash-view",
        path: "/dashboard",
        label: t("Dashboard"),
        icon: <DashboardIcon />,
      },
      {
        id: 2,
        path: "/jobs",
        label: t("Jobs"),
        icon: <JobsIcon />,
        slug: "job-menu-visible",
      },
      {
        id: 4,
        path: "#",
        label: t("Spare Parts"),
        icon: <SparePartsIcon />,
        action: ACTIONS.toggleSparePartsSalesFormModal,
      },
      {
        id: 5,
        path: "/memo",
        label: t("Memo"),
        slug: "memo-view",
        icon: <CustomersIcon />,
      },
      {
        id: 6,
        path: "/cars",
        label: t("Cars"),
        icon: <CarsIcon />,
        slug: "car-menu-visible",
      },
      {
        id: 7,
        path: "/inventory",
        label: t("Inventory"),
        icon: <InventoryIcon />,
        subPath: "/used-spare-parts",
        slug: "inventory-menu-visible",
      },
      {
        id: 8,
        path: "/accounting",
        label: t("Accounting"),
        icon: <AccountingIcon />,
        subPath: "/tree-of-accounts",
      },
      {
        id: 9,
        path: "/hrms",
        label: t("HRMS"),
        icon: <HrmsIcon />,
        subPath: "/add-employee",
        slug: "hrms-menu-visible",
      },
      {
        id: 10,
        path: "/customers",
        label: t("Customers"),
        icon: <CustomersIcon />,
        slug: "customer-menu-visible",
      },
      {
        id: 11,
        path: "/reports",
        label: t("Reports"),
        icon: <ReportsIcon />,
      },
      {
        id: 12,
        path: "/settings",
        subPath: "/make",
        label: t("Settings"),
        icon: <SettingsIcon />,
        slug: "setting-menu-visible",
      },
      {
        id: 13,
        path: "#",
        label: t("Search"),
        icon: <SearchIcon />,
        slug: "master-search-view",
        action: ACTIONS.toggleIsSearchModalOpen,
      },
    ],
    [t],
  );

  const isActive = (item) => item.path !== "#" && pathName.includes(item.path);

  const hasPermissions = (item) =>
    !item.slug || permissions.includes(item.slug);

  const handleAction = (action = "") => dispatch({ type: action });

  return (
    <div className="bg-[#267ff8] text-white flex shadow-lg z-10">
      <div className="inline-flex items-center gap-1.5 p-[14px] bg-[#3271e4] sm:w-[228px]">
        <Image
          src={Logo}
          alt="Logo"
          width={100}
          height={100}
          style={{ width: 60 }}
        />
        <Link href="/dashboard">
          <span className="text-[21px] hidden sm:block font-semibold">
            {t("Challenger")}
          </span>
        </Link>
      </div>

      <div className="grow">
        <div className="flex h-full items-center justify-end lg:justify-start">
          {headerItems.map(
            (item) =>
              hasPermissions(item) && (
                <HeaderItem
                  {...item}
                  key={item.id}
                  isActive={isActive(item)}
                  onClick={() => handleAction(item.action || "")}
                />
              ),
          )}

          {permissions.includes("visa-notification-view") && (
            <button
              type="button"
              onClick={() =>
                dispatch({ type: ACTIONS.toggleNotificationModalOpen })
              }
              className="[&_svg]:h-[22px] w-[70px] flex justify-center cursor-pointer"
            >
              <Badge
                count={state.notificationCount}
                className="[&_sup]:!shadow !text-white"
              >
                <NotificationIcon />
              </Badge>
            </button>
          )}

          <MobileMenu
            onAction={handleAction}
            items={
              headerItems?.filter(hasPermissions)?.map((item) => ({
                ...item,
                isActive: isActive(item),
                pathName: pathName,
              })) || []
            }
          />
        </div>
      </div>

      <div className="p-[14px] bg-[#1a6fe3] hidden sm:block">
        <Image
          alt="Mrafie"
          width={100}
          src={Mrafie}
          height={100}
          style={{ width: 48 }}
        />
      </div>
    </div>
  );
}
