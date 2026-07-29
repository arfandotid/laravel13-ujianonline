import { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { ArrowLeft, CheckCircle, XCircle, Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Input } from "@/Components/ui/input";

function EssayGradingForm({ answer, maxPoints, sessionId }) {
    const { data, setData, post, processing } = useForm({
        participant_answer_id: answer.id,
        points_earned: answer.points_earned ?? 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/results/${sessionId}/grade-essay`);
    };

    return (
        <form onSubmit={submit} className="flex items-center gap-3 mt-3 pt-3 border-t">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Nilai Essay (Max {maxPoints}):</span>
                <Input
                    type="number"
                    min="0"
                    max={maxPoints}
                    step="0.01"
                    value={data.points_earned}
                    onChange={(e) => setData("points_earned", e.target.value)}
                    className="w-24"
                />
            </div>
            <Button type="submit" size="sm" disabled={processing}>
                <Save className="h-4 w-4 mr-1" />
                {processing ? "Menyimpan..." : "Simpan Nilai"}
            </Button>
        </form>
    );
}

export default function ResultsShow() {
    const { session, examQuestionPoints } = usePage().props;

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        const date = new Date(dateString);
        return date.toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    const passThreshold = session.exam?.pass_threshold || 0;
    const isPassed = Number(session.score) >= passThreshold;

    return (
        <>
            <Head title={`Detail Hasil - ${session.user?.name}`} />
            <LayoutApp>
                <PageHeader
                    title={`Detail Hasil Ujian: ${session.user?.name}`}
                    description={`Ujian: ${session.exam?.title || "-"} | Mata Pelajaran: ${session.exam?.subject?.name || "-"}`}
                />

                <div className="space-y-6">
                    {/* Summary Header */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 border rounded-lg bg-card shadow-sm">
                        <div>
                            <p className="text-xs text-muted-foreground">Peserta</p>
                            <p className="font-semibold text-base">{session.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user?.username}</p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Group / Rombel</p>
                            <p className="font-semibold text-base">
                                {session.exam_schedule?.group?.name || "-"}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Waktu Pengerjaan</p>
                            <p className="text-xs font-medium mt-1">
                                Mulai: {formatDate(session.started_at)}
                            </p>
                            <p className="text-xs font-medium">
                                Selesai: {formatDate(session.submitted_at)}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">Nilai Akhir (KKM: {passThreshold}%)</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-2xl font-bold ${isPassed ? "text-green-600" : "text-red-600"}`}>
                                    {session.score !== null ? session.score : "Belum Lengkap"}
                                </span>
                                {session.score !== null && (
                                    <Badge variant="secondary" className={isPassed ? "bg-green-100 text-green-900" : "bg-red-100 text-red-900"}>
                                        {isPassed ? "LULUS" : "TIDAK LULUS"}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Answers Breakdown */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg">Lembar Jawaban Peserta</h3>

                        {session.answers && session.answers.length > 0 ? (
                            session.answers.map((ans, idx) => {
                                const question = ans.question;
                                const maxPoints = examQuestionPoints?.[question?.id] ?? 0;
                                const isMCQ = question?.type === "multiple_choice";

                                // For MCQ, answer_text stores option_id
                                const selectedOption = isMCQ
                                    ? question?.options?.find(
                                          (o) => String(o.id) === String(ans.answer_text)
                                      )
                                    : null;

                                const correctOption = isMCQ
                                    ? question?.options?.find((o) => o.is_correct)
                                    : null;

                                return (
                                    <div
                                        key={ans.id}
                                        className="p-5 border rounded-lg bg-card space-y-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-base">
                                                    Soal #{idx + 1}
                                                </span>
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        isMCQ
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-purple-100 text-purple-800"
                                                    }
                                                >
                                                    {isMCQ ? "Pilihan Ganda" : "Essay"}
                                                </Badge>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                {isMCQ ? (
                                                    ans.is_correct ? (
                                                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                            <CheckCircle className="h-3 w-3 mr-1" />
                                                            Benar ({ans.points_earned} / {maxPoints} Poin)
                                                        </Badge>
                                                    ) : (
                                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                            <XCircle className="h-3 w-3 mr-1" />
                                                            Salah ({ans.points_earned} / {maxPoints} Poin)
                                                        </Badge>
                                                    )
                                                ) : (
                                                    <Badge variant="outline">
                                                        Poin: {ans.points_earned ?? 0} / {maxPoints}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>

                                        <p className="font-medium text-foreground whitespace-pre-wrap">
                                            {question?.question_text}
                                        </p>

                                        {/* MCQ Answer Display */}
                                        {isMCQ && (
                                            <div className="space-y-2 pt-2 text-sm">
                                                <div className="p-3 rounded border bg-muted/30">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Jawaban Peserta:
                                                    </p>
                                                    <p className="font-medium mt-1">
                                                        {selectedOption
                                                            ? selectedOption.option_text
                                                            : "(Tidak Menjawab)"}
                                                    </p>
                                                </div>

                                                <div className="p-3 rounded border bg-green-50/50 border-green-200 text-green-900">
                                                    <p className="text-xs font-medium text-green-700">
                                                        Kunci Jawaban Benar:
                                                    </p>
                                                    <p className="font-medium mt-1">
                                                        {correctOption
                                                            ? correctOption.option_text
                                                            : "-"}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Essay Answer & Grading Display */}
                                        {!isMCQ && (
                                            <div className="space-y-2 pt-2 text-sm">
                                                <div className="p-3 rounded border bg-muted/30">
                                                    <p className="text-xs font-medium text-muted-foreground">
                                                        Jawaban Essay Peserta:
                                                    </p>
                                                    <p className="font-medium mt-1 whitespace-pre-wrap">
                                                        {ans.answer_text || "(Tidak Menjawab)"}
                                                    </p>
                                                </div>

                                                <EssayGradingForm
                                                    answer={ans}
                                                    maxPoints={maxPoints}
                                                    sessionId={session.id}
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground border rounded-lg bg-card">
                                Tidak ada rincian jawaban ditemukan.
                            </div>
                        )}
                    </div>

                    <div className="pt-4">
                        <Link href="/admin/results">
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-1" />
                                Kembali ke Daftar Hasil
                            </Button>
                        </Link>
                    </div>
                </div>
            </LayoutApp>
        </>
    );
}
