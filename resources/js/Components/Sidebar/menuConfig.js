import hasAnyPermission from "@/utils/permissions";
import {
    Users,
    UserCog,
    Settings,
    Key,
    Shield,
    LayoutDashboard,
    FileText,
    Calendar,
    Award,
    BookOpen,
    HelpCircle,
    GraduationCap,
} from "lucide-react";

export const menuItems = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        href: "/admin/dashboard",
    },
    {
        name: "User Management",
        icon: UserCog,
        permissions: ["roles.index", "permissions.index", "users.index"],
        dropdown: [
            {
                name: "Roles",
                href: "/admin/roles",
                icon: Shield,
                permissions: ["roles.index"],
            },
            {
                name: "Permissions",
                href: "/admin/permissions",
                icon: Key,
                permissions: ["permissions.index"],
            },
            {
                name: "Users",
                href: "/admin/users",
                icon: Users,
                permissions: ["users.index"],
            },
        ],
    },
    {
        name: "Master Data",
        icon: GraduationCap,
        permissions: ["groups.index", "subjects.index", "questions.index"],
        dropdown: [
            {
                name: "Group Rombel",
                href: "/admin/groups",
                icon: Users,
                permissions: ["groups.index"],
            },
            {
                name: "Mata Pelajaran",
                href: "/admin/subjects",
                icon: BookOpen,
                permissions: ["subjects.index"],
            },
            {
                name: "Bank Soal",
                href: "/admin/questions",
                icon: HelpCircle,
                permissions: ["questions.index"],
            },
        ],
    },
    {
        name: "Ujian",
        icon: FileText,
        permissions: ["exams.index"],
        dropdown: [
            {
                name: "Kelola Ujian",
                href: "/admin/exams",
                icon: FileText,
                permissions: ["exams.index"],
            },
            {
                name: "Jadwal Ujian",
                href: "/admin/schedules",
                icon: Calendar,
                permissions: ["exams.index"],
            },
        ],
    },
    {
        name: "Hasil Ujian",
        icon: Award,
        href: "/admin/results",
        permissions: ["results.index"],
    },
    {
        name: "Settings",
        icon: Settings,
        href: "/admin/settings",
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
