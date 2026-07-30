import { Head, Link, useForm } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { Separator } from "@/Components/ui/separator";
import {
    BookOpen,
    Timer,
    CalendarDays,
    CheckCircle,
    ClipboardList,
    Target,
    ShuffleIcon,
    ArrowLeft,
    PlayCircle,
    AlertCircle,
} from "lucide-react";

const STATUS_CONFIG = {
    available:   { label: "Tersedia",    color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    upcoming:    { label: "Mendatang",   color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    in_progress: { label: "Berlangsung", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    completed:   { label: "Selesai",     color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    expired:     { label: "Berakhir",    color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function InfoRow({ icon: Icon, label, value }) {
    return (
        <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="size-4" />
                {label}
            </div>
            <span className="text-sm font-medium">{value}</span>
        </div>
    );
}

export default function ExamShow({ schedule, exam, status, session_id }) {
    const { post, processing } = useForm({});
    const cfg = STATUS_CONFIG[status] ?? { label: status, color: "" };

    const handleStart = (e) => {
        e.preventDefault();
        post(`/exams/${exam.id}/start`);
    };

    const handleContinue = () => {
        window.location.href = `/sessions/${session_id}`;
    };

    return (
        <>
            <Head title={exam.title} />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title={exam.title}
                    description={exam.subject?.name ?? ""}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main info */}
                    <Card className="border-border/50 bg-card/60 backdrop-blur-sm lg:col-span-2 shadow-none">
                        <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                                <CardTitle className="text-base">
                                    Informasi Ujian
                                </CardTitle>
                                <Badge
                                    variant="outline"
                                    className={cfg.color}
                                >
                                    {cfg.label}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {exam.description && (
                                <div className="mb-4 rounded-lg bg-muted/40 p-4 text-sm text-muted-foreground">
                                    {exam.description}
                                </div>
                            )}

                            <div className="divide-y divide-border/50">
                                <InfoRow
                                    icon={BookOpen}
                                    label="Mata Pelajaran"
                                    value={exam.subject?.name ?? "-"}
                                />
                                <InfoRow
                                    icon={Timer}
                                    label="Durasi"
                                    value={`${exam.duration_minutes} menit`}
                                />
                                <InfoRow
                                    icon={ClipboardList}
                                    label="Jumlah Soal"
                                    value={exam.questions_count ?? "-"}
                                />
                                <InfoRow
                                    icon={Target}
                                    label="Passing Grade"
                                    value={`${exam.pass_threshold}%`}
                                />
                                <InfoRow
                                    icon={ShuffleIcon}
                                    label="Acak Soal"
                                    value={exam.shuffle_questions ? "Ya" : "Tidak"}
                                />
                                <InfoRow
                                    icon={ShuffleIcon}
                                    label="Acak Jawaban"
                                    value={exam.shuffle_answers ? "Ya" : "Tidak"}
                                />
                            </div>

                            <Separator className="my-4" />

                            <div className="divide-y divide-border/50">
                                <InfoRow
                                    icon={CalendarDays}
                                    label="Mulai"
                                    value={new Date(schedule.start_time).toLocaleString("id-ID", {
                                        dateStyle: "long",
                                        timeStyle: "short",
                                    })}
                                />
                                <InfoRow
                                    icon={CalendarDays}
                                    label="Selesai"
                                    value={new Date(schedule.end_time).toLocaleString("id-ID", {
                                        dateStyle: "long",
                                        timeStyle: "short",
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action panel */}
                    <div className="space-y-4">
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-none">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-base">Aksi</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {status === "available" && !session_id && (
                                    <>
                                        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-sm text-emerald-500">
                                            <div className="flex items-center gap-2 font-medium">
                                                <CheckCircle className="size-4" />
                                                Ujian sedang berlangsung!
                                            </div>
                                            <p className="mt-1 text-xs text-emerald-600/80">
                                                Anda dapat memulai ujian ini sekarang.
                                            </p>
                                        </div>
                                        <form onSubmit={handleStart}>
                                            <Button
                                                type="submit"
                                                className="w-full"
                                                disabled={processing}
                                            >
                                                <PlayCircle className="mr-2 size-4" />
                                                {processing
                                                    ? "Memulai..."
                                                    : "Mulai Ujian"}
                                            </Button>
                                        </form>
                                    </>
                                )}

                                {status === "in_progress" && session_id && (
                                    <>
                                        <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-sm text-amber-500">
                                            <div className="flex items-center gap-2 font-medium">
                                                <Timer className="size-4" />
                                                Ujian sedang berjalan
                                            </div>
                                            <p className="mt-1 text-xs">
                                                Anda memiliki sesi ujian yang belum selesai.
                                            </p>
                                        </div>
                                        <Button
                                            className="w-full"
                                            onClick={handleContinue}
                                        >
                                            Lanjutkan Ujian
                                        </Button>
                                    </>
                                )}

                                {status === "completed" && session_id && (
                                    <>
                                        <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-sm text-violet-500">
                                            <div className="flex items-center gap-2 font-medium">
                                                <CheckCircle className="size-4" />
                                                Ujian sudah selesai
                                            </div>
                                            <p className="mt-1 text-xs">
                                                Anda tidak dapat mengulang ujian ini.
                                            </p>
                                        </div>
                                        <Button variant="outline" className="w-full" asChild>
                                            <Link href={`/sessions/${session_id}/result`}>
                                                Lihat Hasil
                                            </Link>
                                        </Button>
                                    </>
                                )}

                                {status === "upcoming" && (
                                    <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 p-3 text-sm text-blue-400">
                                        <div className="flex items-center gap-2 font-medium">
                                            <CalendarDays className="size-4" />
                                            Belum dimulai
                                        </div>
                                        <p className="mt-1 text-xs">
                                            Ujian akan dimulai pada waktu yang telah ditentukan.
                                        </p>
                                    </div>
                                )}

                                {status === "expired" && (
                                    <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-sm text-red-400">
                                        <div className="flex items-center gap-2 font-medium">
                                            <AlertCircle className="size-4" />
                                            Waktu habis
                                        </div>
                                        <p className="mt-1 text-xs">
                                            Waktu untuk mengikuti ujian ini telah berakhir.
                                        </p>
                                    </div>
                                )}

                                <Button variant="ghost" size="sm" className="w-full" asChild>
                                    <Link href="/exams">
                                        <ArrowLeft className="mr-2 size-3.5" />
                                        Kembali ke Daftar
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </LayoutApp>
        </>
    );
}
