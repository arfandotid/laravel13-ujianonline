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

export default function PermissionsIndex() {
    const { permissions } = usePage().props;

    return (
        <>
            <Head title="Permissions" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Permissions"
                    description="Kelola permission untuk hak akses pengguna"
                    action="/admin/permissions/create"
                    actionText="Tambah Permission"
                    permission="permissions.create"
                />

                <div className="space-y-5">
                    <Search URL="/admin/permissions" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Nama Permission</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {permissions && permissions.data.length > 0 ? (
                                permissions.data.map((permission, index) => (
                                    <TableRow key={permission.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (permissions.current_page - 1) *
                                                    permissions.per_page}
                                        </TableCell>
                                        <TableCell>{permission.name}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {hasAnyPermission([
                                                    "permissions.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/permissions/${permission.id}/edit`}
                                                        title="Edit"
                                                    >
                                                        <Button
                                                            size="icon"
                                                            variant="outline"
                                                        >
                                                            <Edit />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {hasAnyPermission([
                                                    "permissions.delete",
                                                ]) && (
                                                    <Delete
                                                        URL="/admin/permissions"
                                                        id={permission.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Permission"
                                    description="Silahkan tambahkan permission baru"
                                    colSpan={3}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={permissions.links} />
                </div>
            </LayoutApp>
        </>
    );
}
