import { Head, Link, usePage, router } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import hasAnyPermission from "@/utils/permissions";
import { Eye } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import TableEmpty from "@/Components/common/TableEmpty";
import Search from "@/Components/common/Search";
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
import ExamSelect from "@/Components/form/ExamSelect";
import GroupSelect from "@/Components/form/GroupSelect";

export default function ResultsIndex() {
    const { results, exams, groups } = usePage().props;

    const selectedExam = new URLSearchParams(window.location.search).get("exam_id") || "";
    const selectedGroup = new URLSearchParams(window.location.search).get("group_id") || "";

    const handleFilterExam = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("exam_id", val);
        } else {
            queryParams.delete("exam_id");
        }
        router.get(`/admin/results?${queryParams.toString()}`);
    };

    const handleFilterGroup = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("group_id", val);
        } else {
            queryParams.delete("group_id");
        }
        router.get(`/admin/results?${queryParams.toString()}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "submitted":
                return (
                    <Badge variant="secondary" className="bg-green-100 text-green-900">
                        Selesai
                    </Badge>
                );
            case "timed_out":
                return (
                    <Badge variant="secondary" className="bg-orange-100 text-orange-900">
                        Waktu Habis
                    </Badge>
                );
            case "in_progress":
                return (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-900">
                        Sedang Berjalan
                    </Badge>
                );
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <>
            <Head title="Hasil Ujian" />
            <LayoutApp>
                <PageHeader
                    title="Hasil Ujian & Grading"
                    description="Lihat hasil pengerjaan ujian peserta dan lakukan koreksi essay"
                />

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-1/2">
                            <Search URL="/admin/results" />
                        </div>
                        <div className="flex w-full sm:w-1/2 items-center gap-2">
                            {exams && exams.length > 0 && (
                                <div className="w-1/2">
                                    <ExamSelect
                                        exams={exams}
                                        value={selectedExam}
                                        onChange={handleFilterExam}
                                        placeholder="Semua Ujian"
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
                                <TableHead>Peserta</TableHead>
                                <TableHead>Ujian</TableHead>
                                <TableHead>Group / Rombel</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Nilai Akhir</TableHead>
                                <TableHead>Waktu Selesai</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {results && results.data.length > 0 ? (
                                results.data.map((res, index) => (
                                    <TableRow key={res.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (results.current_page - 1) *
                                                    results.per_page}
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">
                                                    {res.user?.name || "-"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {res.user?.username}
                                                </p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {res.exam?.title || "-"}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {res.exam_schedule?.group?.name || "-"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {getStatusBadge(res.status)}
                                        </TableCell>
                                        <TableCell className="font-bold text-lg">
                                            {res.score !== null ? (
                                                <span
                                                    className={
                                                        Number(res.score) >=
                                                        (res.exam?.pass_threshold || 0)
                                                            ? "text-green-600"
                                                            : "text-red-600"
                                                    }
                                                >
                                                    {res.score}
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground text-sm font-normal">
                                                    Belum Dinilai
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {formatDate(res.submitted_at)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-2">
                                                {hasAnyPermission(["results.show"]) && (
                                                    <Link
                                                        href={`/admin/results/${res.id}`}
                                                        title="Detail & Koreksi"
                                                    >
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Hasil Ujian"
                                    description="Belum ada ujian yang dikerjakan peserta"
                                    colSpan={8}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={results.links} />
                </div>
            </LayoutApp>
        </>
    );
}
