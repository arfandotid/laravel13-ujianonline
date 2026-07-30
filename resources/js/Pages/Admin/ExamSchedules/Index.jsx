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
import { Badge } from "@/Components/ui/badge";
import SubjectSelect from "@/Components/form/SubjectSelect";
import GroupSelect from "@/Components/form/GroupSelect";

export default function ExamSchedulesIndex() {
    const { schedules, subjects, groups } = usePage().props;

    const selectedSubject = new URLSearchParams(window.location.search).get("subject_id") || "";
    const selectedGroup = new URLSearchParams(window.location.search).get("group_id") || "";

    const handleFilterSubject = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("subject_id", val);
        } else {
            queryParams.delete("subject_id");
        }
        router.get(`/admin/schedules?${queryParams.toString()}`);
    };

    const handleFilterGroup = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("group_id", val);
        } else {
            queryParams.delete("group_id");
        }
        router.get(`/admin/schedules?${queryParams.toString()}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    return (
        <>
            <Head title="Jadwal Ujian" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Jadwal Ujian"
                    description="Pengaturan dan penjadwalan ujian per kelompok/rombongan belajar"
                    action="/admin/schedules/create"
                    actionText="Tambah Jadwal"
                    permission="exams.create"
                />

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-1/2">
                            <Search URL="/admin/schedules" />
                        </div>
                        <div className="flex w-full sm:w-1/2 items-center gap-2">
                            {subjects && subjects.length > 0 && (
                                <div className="w-1/2">
                                    <SubjectSelect
                                        subjects={subjects}
                                        value={selectedSubject}
                                        onChange={handleFilterSubject}
                                        placeholder="Semua Mata Pelajaran"
                                    />
                                </div>
                            )}
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
                        </div>
                    </div>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>No.</TableHead>
                                <TableHead>Ujian</TableHead>
                                <TableHead>Mata Pelajaran</TableHead>
                                <TableHead>Group / Rombel</TableHead>
                                <TableHead>Waktu Mulai</TableHead>
                                <TableHead>Waktu Selesai</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {schedules && schedules.data.length > 0 ? (
                                schedules.data.map((schedule, index) => (
                                    <TableRow key={schedule.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (schedules.current_page - 1) *
                                                    schedules.per_page}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {schedule.exam?.title || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.exam?.subject?.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {schedule.group?.name || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(schedule.start_time)}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(schedule.end_time)}
                                        </TableCell>
                                        <TableCell>
                                            {schedule.is_active ? (
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
                                                {hasAnyPermission(["exams.edit"]) && (
                                                    <Link
                                                        href={`/admin/schedules/${schedule.id}/edit`}
                                                        title="Edit Jadwal"
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
                                                        URL="/admin/schedules"
                                                        id={schedule.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Jadwal Ujian"
                                    description="Silahkan tambahkan jadwal ujian baru"
                                    colSpan={8}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={schedules.links} />
                </div>
            </LayoutApp>
        </>
    );
}
