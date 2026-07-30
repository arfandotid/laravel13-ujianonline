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
import { Badge } from "@/Components/ui/badge";

export default function GroupsIndex() {
    const { groups } = usePage().props;

    return (
        <>
            <Head title="Group Rombel" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Group Rombel"
                    description="Kelola data kelas atau kelompok peserta"
                    action="/admin/groups/create"
                    actionText="Tambah Group"
                    permission="groups.create"
                />

                <div className="space-y-5">
                    <Search URL="/admin/groups" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Nama Group</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {groups && groups.data.length > 0 ? (
                                groups.data.map((group, index) => (
                                    <TableRow key={group.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (groups.current_page - 1) *
                                                    groups.per_page}
                                        </TableCell>
                                        <TableCell>{group.name}</TableCell>
                                        <TableCell>{group.description || "-"}</TableCell>
                                        <TableCell>
                                            {group.is_active ? (
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
                                                    "groups.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/groups/${group.id}/edit`}
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
                                                    "groups.delete",
                                                ]) && (
                                                    <Delete
                                                        URL="/admin/groups"
                                                        id={group.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Group"
                                    description="Silahkan tambahkan group baru"
                                    colSpan={5}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={groups.links} />
                </div>
            </LayoutApp>
        </>
    );
}
