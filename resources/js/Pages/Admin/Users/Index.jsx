import { Head, Link, usePage, router } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import hasAnyPermission from "@/utils/permissions";
import { Edit } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import TableEmpty from "@/Components/common/TableEmpty";
import Search from "@/Components/common/Search";
import Delete from "@/Components/common/Delete";
import TablePagination from "@/Components/common/TablePagination";
import { Button } from "@/Components/ui/button";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/table/BasicTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { APP_URL } from "@/constants/app";
import { Badge } from "@/Components/ui/badge";
import GroupSelect from "@/Components/form/GroupSelect";
import RoleSelect from "@/Components/form/RoleSelect";

export default function UsersIndex() {
    const { users, roles, groups } = usePage().props;

    const selectedGroup = new URLSearchParams(window.location.search).get("group_id") || "";
    const selectedRole = new URLSearchParams(window.location.search).get("role_id") || "";

    const handleFilterGroup = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("group_id", val);
        } else {
            queryParams.delete("group_id");
        }
        router.get(`/admin/users?${queryParams.toString()}`);
    };

    const handleFilterRole = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("role_id", val);
        } else {
            queryParams.delete("role_id");
        }
        router.get(`/admin/users?${queryParams.toString()}`);
    };

    return (
        <>
            <Head title="Users" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Users"
                    description="Kelola data pengguna dan role akses"
                    action="/admin/users/create"
                    actionText="Tambah User"
                    permission="users.create"
                />

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-1/2">
                            <Search URL="/admin/users" />
                        </div>
                        <div className="flex w-full sm:w-1/2 items-center gap-2">
                            {groups && groups.length > 0 && (
                                <div className="w-1/2">
                                    <GroupSelect
                                        groups={groups}
                                        value={selectedGroup}
                                        onChange={handleFilterGroup}
                                        placeholder="Semua Grup"
                                    />
                                </div>
                            )}
                            {roles && roles.length > 0 && (
                                <div className="w-1/2">
                                    <RoleSelect
                                        roles={roles}
                                        value={selectedRole}
                                        onChange={handleFilterRole}
                                        placeholder="Semua Role"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Group</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users && users.data.length > 0 ? (
                                users.data.map((user, index) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (users.current_page - 1) *
                                                    users.per_page}
                                        </TableCell>
                                        <TableCell>
                                            <Avatar className="h-8 w-8 rounded-full">
                                                <AvatarImage
                                                    src={`${APP_URL}/uploads/avatars/${user.avatar}`}
                                                    alt={user.name}
                                                />
                                                <AvatarFallback className="rounded-full">
                                                    {user.name
                                                        .charAt(0)
                                                        .toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        </TableCell>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.username}</TableCell>
                                        <TableCell>
                                            {user.roles.length > 0
                                                ? user.roles
                                                      .map((role) => role.name)
                                                      .join(", ")
                                                : "-"}
                                        </TableCell>
                                        <TableCell>
                                            {user.group?.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {user.is_active == "1" ? (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-green-100 text-green-900"
                                                >
                                                    Aktif
                                                </Badge>
                                            ) : (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-red-100 text-red-900"
                                                >
                                                    Non-Aktif
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {hasAnyPermission([
                                                    "users.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/users/${user.id}/edit`}
                                                        title="Edit"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                        >
                                                            <Edit />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {hasAnyPermission([
                                                    "users.delete",
                                                ]) && (
                                                    <Delete
                                                        URL="/admin/users"
                                                        id={user.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada User"
                                    description="Silahkan tambahkan user baru"
                                    colSpan={9}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={users.links} />
                </div>
            </LayoutApp>
        </>
    );
}
