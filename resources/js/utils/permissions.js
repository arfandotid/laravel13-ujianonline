import { usePage } from "@inertiajs/react";

export default function hasAnyPermission(permissions) {
    const { auth } = usePage().props;
    const allPermissions = auth?.permissions || {};

    if (typeof permissions === "string") {
        permissions = [permissions];
    }

    return permissions.some((permission) => allPermissions[permission] === true);
}

export function hasPermission(permission) {
    return hasAnyPermission([permission]);
}

export function hasRole(roleName) {
    const { auth } = usePage().props;

    if (!auth?.user || !auth.user.roles) {
        return false;
    }

    return auth.user.roles.some((role) => role.name === roleName);
}
