import { Head, Link, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import hasAnyPermission from "@/utils/permissions";
import { Edit, HelpCircle, Calendar } from "lucide-react";
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

export default function ExamsIndex() {
    const { exams } = usePage().props;

    return (
        <>
            <Head title="Kelola Ujian" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Kelola Ujian"
                    description="Daftar dan pengelolaan ujian online"
                    action="/admin/exams/create"
                    actionText="Tambah Ujian"
                    permission="exams.create"
                />

                <div className="space-y-5">
                    <Search URL="/admin/exams" />

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Judul Ujian</TableHead>
                                <TableHead>Mata Pelajaran</TableHead>
                                <TableHead>Durasi</TableHead>
                                <TableHead>KKM / Threshold</TableHead>
                                <TableHead>Jumlah Soal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {exams && exams.data.length > 0 ? (
                                exams.data.map((exam, index) => (
                                    <TableRow key={exam.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (exams.current_page - 1) *
                                                    exams.per_page}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {exam.title}
                                        </TableCell>
                                        <TableCell>
                                            {exam.subject?.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {exam.duration_minutes} Menit
                                        </TableCell>
                                        <TableCell>
                                            {exam.pass_threshold}%
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {exam.questions_count ?? 0} Soal
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {exam.is_active ? (
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
                                                {hasAnyPermission(["exams.index"]) && (
                                                    <Link
                                                        href={`/admin/exams/${exam.id}/questions`}
                                                        title="Kelola Soal Ujian"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                        >
                                                            <HelpCircle className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {hasAnyPermission(["exams.edit"]) && (
                                                    <Link
                                                        href={`/admin/exams/${exam.id}/edit`}
                                                        title="Edit Ujian"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                                {hasAnyPermission(["exams.delete"]) && (
                                                    <Delete
                                                        URL="/admin/exams"
                                                        id={exam.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Ujian"
                                    description="Silahkan tambahkan ujian baru"
                                    colSpan={8}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={exams.links} />
                </div>
            </LayoutApp>
        </>
    );
}
