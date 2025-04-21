import {
  Tag,
  Users,
  Settings,
  Bookmark,
  SquarePen,
  LayoutGrid,
  LucideIcon,
  BaggageClaim,
  BellRing,
  AreaChart,
} from "lucide-react";

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string, role?: string): Group[] {
  const menuGroups: Group[] = [
    {
      groupLabel: "",
      menus: [
        {
          href: "/dashboard",
          label: "Dashboard",
          icon: LayoutGrid,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: "Contents",
      menus: [
        {
          href: "/inventory",
          label: "Inventory",
          icon: BaggageClaim,
        },
        {
          href: "/alerts-and-notifications",
          label: "Alerts and Notifications",
          icon: BellRing,
        },
        {
          href: "/sales-analytics",
          label: "Sales Analytics",
          icon: AreaChart,
        },
      ],
    },
    {
      groupLabel: "Settings",
      menus: [
        {
          href: "/account",
          label: "Account",
          icon: Settings,
        },
      ],
    },
  ];

  // Only include the Users menu item if the user is an admin or owner
  if (role === "admin" || role === "owner") {
    const settingsGroup = menuGroups.find(
      (group) => group.groupLabel === "Settings",
    );
    if (settingsGroup) {
      settingsGroup.menus.unshift({
        href: "/users",
        label: "Users",
        icon: Users,
      });
    }
  }

  return menuGroups;
}
