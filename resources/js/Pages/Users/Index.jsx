import { Head, Link, usePage } from "@inertiajs/react";
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

export default function UsersIndex() {
    const { users } = usePage().props;

    return (
        <>
            <Head title="Users" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Users"
                    description="Kelola data pengguna dan role akses"
                    action="/users/create"
                    actionText="Tambah User"
                    permission="users.create"
                />

                <div className="space-y-5">
                    <Search URL="/users" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Avatar</TableHead>
                                <TableHead>Nama</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Username</TableHead>
                                <TableHead>Role</TableHead>
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
                                                        href={`/users/${user.id}/edit`}
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
                                                        URL="/users"
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
                                    colSpan={8}
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
