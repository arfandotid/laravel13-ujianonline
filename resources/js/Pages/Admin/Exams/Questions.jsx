import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save, Plus, Trash2, ArrowLeft } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";
import QuestionSelect from "@/Components/form/QuestionSelect";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/table/BasicTable";

export default function ExamsQuestions() {
    const { exam, availableQuestions } = usePage().props;

    // Initial state from currently assigned questions
    const initialAssigned = (exam.questions || []).map((q, idx) => ({
        question_id: q.id,
        question_text: q.question_text,
        type: q.type,
        points: q.pivot?.points ?? 10,
        order: q.pivot?.order ?? idx + 1,
    }));

    const [assigned, setAssigned] = useState(initialAssigned);
    const [selectedQuestionId, setSelectedQuestionId] = useState("");

    const { post, processing, setData, data } = useForm({
        questions: initialAssigned.map((item) => ({
            question_id: item.question_id,
            points: item.points,
            order: item.order,
        })),
    });

    const updateFormState = (updatedList) => {
        setAssigned(updatedList);
        setData(
            "questions",
            updatedList.map((item) => ({
                question_id: item.question_id,
                points: Number(item.points),
                order: Number(item.order),
            }))
        );
    };

    const handleAddQuestion = () => {
        if (!selectedQuestionId) return;

        const qId = Number(selectedQuestionId);
        if (assigned.some((item) => item.question_id === qId)) {
            alert("Soal ini sudah ditambahkan ke ujian.");
            return;
        }

        const found = availableQuestions.find((q) => q.id === qId);
        if (!found) return;

        const updated = [
            ...assigned,
            {
                question_id: found.id,
                question_text: found.question_text,
                type: found.type,
                points: 10,
                order: assigned.length + 1,
            },
        ];

        setSelectedQuestionId("");
        updateFormState(updated);
    };

    const handleRemoveQuestion = (questionId) => {
        const updated = assigned.filter((item) => item.question_id !== questionId);
        updateFormState(updated);
    };

    const handleFieldChange = (questionId, field, value) => {
        const updated = assigned.map((item) => {
            if (item.question_id === questionId) {
                return { ...item, [field]: value };
            }
            return item;
        });
        updateFormState(updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/exams/${exam.id}/questions`);
    };

    // Filter available questions not yet assigned
    const unassignedQuestions = (availableQuestions || []).filter(
        (q) => !assigned.some((item) => item.question_id === q.id)
    );

    return (
        <>
            <Head title={`Kelola Soal - ${exam.title}`} />
            <LayoutApp>
                <PageHeader
                    title={`Kelola Soal Ujian: ${exam.title}`}
                    description={`Mata Pelajaran: ${exam.subject?.name || "-"}`}
                />

                <div className="space-y-6">
                    {/* Add Question Card */}
                    <div className="p-4 border rounded-lg bg-card space-y-3">
                        <h3 className="font-semibold text-base">
                            Pilih Soal dari Bank Soal ({exam.subject?.name})
                        </h3>
                        <div className="flex flex-col gap-3 items-left">
                            <QuestionSelect
                                value={selectedQuestionId}
                                onChange={setSelectedQuestionId}
                                questions={unassignedQuestions}
                                placeholder="-- Pilih Soal untuk Ditambahkan --"
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                onClick={handleAddQuestion}
                                disabled={!selectedQuestionId}
                            >
                                <Plus className="h-4 w-4 mr-1" />
                                Tambahkan Soal
                            </Button>
                        </div>
                    </div>

                    {/* Form submit */}
                    <form onSubmit={submit} className="space-y-4">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-12">Urutan</TableHead>
                                    <TableHead>Teks Soal</TableHead>
                                    <TableHead className="w-28">Tipe</TableHead>
                                    <TableHead className="w-28">Poin / Poin Maks</TableHead>
                                    <TableHead className="w-16">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {assigned.length > 0 ? (
                                    assigned.map((item) => (
                                        <TableRow key={item.question_id}>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={item.order}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            item.question_id,
                                                            "order",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-16"
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium max-w-md">
                                                <p className="line-clamp-2">
                                                    {item.question_text}
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        item.type === "multiple_choice"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }
                                                >
                                                    {item.type === "multiple_choice"
                                                        ? "Pilihan Ganda"
                                                        : "Essay"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    value={item.points}
                                                    onChange={(e) =>
                                                        handleFieldChange(
                                                            item.question_id,
                                                            "points",
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-20"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemoveQuestion(
                                                            item.question_id
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
                                            className="text-center py-6 text-muted-foreground"
                                        >
                                            Belum ada soal yang ditambahkan ke ujian ini.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="flex justify-between items-center pt-4">
                            <Link href="/admin/exams">
                                <Button variant="outline" type="button">
                                    <ArrowLeft className="h-4 w-4 mr-1" />
                                    Kembali ke Daftar Ujian
                                </Button>
                            </Link>

                            <Button type="submit" disabled={processing}>
                                <Save className="h-4 w-4 mr-1" />
                                {processing ? "Menyimpan..." : "Simpan Susunan Soal"}
                            </Button>
                        </div>
                    </form>
                </div>
            </LayoutApp>
        </>
    );
}
