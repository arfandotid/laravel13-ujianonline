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
import ImportDialog from "@/Components/common/ImportDialog";

export default function SubjectsIndex() {
    const { subjects } = usePage().props;

    return (
        <>
            <Head title="Mata Pelajaran" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Mata Pelajaran"
                    description="Kelola data mata pelajaran"
                    action="/admin/subjects/create"
                    actionText="Tambah Mata Pelajaran"
                    permission="subjects.create"
                />

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-1/2">
                            <Search URL="/admin/subjects" />
                        </div>
                        <div className="w-full sm:w-auto">
                            {hasAnyPermission(["subjects.create"]) && (
                                <ImportDialog
                                    title="Import Mata Pelajaran"
                                    description="Import mata pelajaran secara massal menggunakan file excel."
                                    downloadUrl="/admin/subjects/import/template"
                                    previewUrl="/admin/subjects/import/preview"
                                    importUrl="/admin/subjects/import"
                                    triggerLabel="Import"
                                    columns={[
                                        { key: "name", label: "Nama" },
                                        { key: "description", label: "Deskripsi" },
                                        { key: "status", label: "Status" },
                                    ]}
                                />
                            )}
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Mata Pelajaran</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Deskripsi</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {subjects && subjects.data.length > 0 ? (
                                subjects.data.map((subject, index) => (
                                    <TableRow key={subject.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (subjects.current_page - 1) *
                                                    subjects.per_page}
                                        </TableCell>
                                        <TableCell>{subject.name}</TableCell>
                                        <TableCell>{subject.slug}</TableCell>
                                        <TableCell>{subject.description || "-"}</TableCell>
                                        <TableCell>
                                            {subject.is_active ? (
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
                                                    "subjects.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/subjects/${subject.id}/edit`}
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
                                                    "subjects.delete",
                                                ]) && (
                                                    <Delete
                                                        URL="/admin/subjects"
                                                        id={subject.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Mata Pelajaran"
                                    description="Silahkan tambahkan mata pelajaran baru"
                                    colSpan={6}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={subjects.links} />
                </div>
            </LayoutApp>
        </>
    );
}
