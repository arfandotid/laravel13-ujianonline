import hasAnyPermission from "@/utils/permissions";
import {
    Users,
    UserCog,
    Settings,
    Key,
    Shield,
    LayoutDashboard,
} from "lucide-react";

export const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
    },
    {
        name: "User Management",
        icon: UserCog,
        permissions: ["roles.index", "permissions.index", "users.index"],
        dropdown: [
            {
                name: "Roles",
                href: "/roles",
                icon: Shield,
                permissions: ["roles.index"],
            },
            {
                name: "Permissions",
                href: "/permissions",
                icon: Key,
                permissions: ["permissions.index"],
            },
            {
                name: "Users",
                href: "/users",
                icon: Users,
                permissions: ["users.index"],
            },
        ],
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/settings",
        permissions: ["settings.index"],
    },
];

export const getFilteredMenuItems = () => {
    return menuItems.filter((item) => {
        if (item.permissions && item.permissions.length > 0) {
            return hasAnyPermission(item.permissions);
        }
        return true;
    });
};

export const getFilteredDropdown = (dropdownItems) => {
    if (!dropdownItems) return [];

    return dropdownItems.filter((subItem) => {
        if (subItem.permissions && subItem.permissions.length > 0) {
            return hasAnyPermission(subItem.permissions);
        }
        return true;
    });
};
