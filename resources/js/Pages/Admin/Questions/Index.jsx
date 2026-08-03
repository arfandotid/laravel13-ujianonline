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
import ImportDialog from "@/Components/common/ImportDialog";

export default function QuestionsIndex() {
    const { questions, subjects } = usePage().props;

    const selectedSubject = new URLSearchParams(window.location.search).get("subject_id") || "";

    const handleFilterSubject = (val) => {
        const queryParams = new URLSearchParams(window.location.search);
        if (val) {
            queryParams.set("subject_id", val);
        } else {
            queryParams.delete("subject_id");
        }
        router.get(`/admin/questions?${queryParams.toString()}`);
    };

    return (
        <>
            <Head title="Bank Soal" />
            <LayoutApp>
                <PageHeader
                    showButton
                    title="Bank Soal"
                    description="Kelola bank soal ujian (Pilihan Ganda & Essay)"
                    action="/admin/questions/create"
                    actionText="Tambah Soal"
                    permission="questions.create"
                />

                <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="w-full sm:w-1/2">
                            <Search URL="/admin/questions" />
                        </div>
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {subjects && subjects.length > 0 && (
                                <SubjectSelect
                                    subjects={subjects}
                                    value={selectedSubject}
                                    onChange={handleFilterSubject}
                                    placeholder="Semua Mata Pelajaran"
                                    className="w-full sm:w-56"
                                />
                            )}
                            {hasAnyPermission(["questions.create"]) && (
                                <ImportDialog
                                    title="Import Bank Soal"
                                    description="Import soal secara massal menggunakan file excel. Mata pelajaran dipilih pada dialog ini dan berlaku untuk semua baris."
                                    downloadUrl="/admin/questions/import/template"
                                    previewUrl="/admin/questions/import/preview"
                                    importUrl="/admin/questions/import"
                                    triggerLabel="Import"
                                    extraFields={[
                                        {
                                            name: "subject_id",
                                            label: "Mata Pelajaran",
                                            placeholder: "Pilih mata pelajaran",
                                            required: true,
                                            options: subjects.map((s) => ({
                                                value: s.id,
                                                label: s.name,
                                            })),
                                        },
                                    ]}
                                    columns={[
                                        { key: "type", label: "Tipe" },
                                        {
                                            key: "question_text",
                                            label: "Soal",
                                        },
                                        {
                                            key: "options_summary",
                                            label: "Opsi",
                                        },
                                        {
                                            key: "answer",
                                            label: "Jawaban Benar",
                                        },
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
                                <TableHead>Tipe</TableHead>
                                <TableHead>Konten Soal</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-7">Aksi</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {questions && questions.data.length > 0 ? (
                                questions.data.map((question, index) => (
                                    <TableRow key={question.id}>
                                        <TableCell className="font-medium">
                                            {++index +
                                                (questions.current_page - 1) *
                                                    questions.per_page}
                                        </TableCell>
                                        <TableCell>{question.subject?.name || "-"}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline">
                                                {question.type === "multiple_choice" ? "Pilihan Ganda" : "Essay"}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="max-w-md truncate">
                                            {question.question_text}
                                        </TableCell>
                                        <TableCell>
                                            {question.is_active ? (
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
                                                    "questions.edit",
                                                ]) && (
                                                    <Link
                                                        href={`/admin/questions/${question.id}/edit`}
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
                                                    "questions.delete",
                                                ]) && (
                                                    <Delete
                                                        URL="/admin/questions"
                                                        id={question.id}
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableEmpty
                                    title="Tidak ada Soal"
                                    description="Silahkan tambahkan soal baru"
                                    colSpan={6}
                                />
                            )}
                        </TableBody>
                    </Table>

                    <TablePagination links={questions.links} />
                </div>
            </LayoutApp>
        </>
    );
}
