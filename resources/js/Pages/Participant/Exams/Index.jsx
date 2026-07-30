import { Head, Link } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";
import { Card, CardContent } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    BookOpen,
    Timer,
    CalendarDays,
    CheckCircle,
    Clock,
    XCircle,
    PlayCircle,
    ArrowRight,
} from "lucide-react";

const STATUS_CONFIG = {
    available:   { label: "Tersedia",    icon: PlayCircle,  color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
    upcoming:    { label: "Mendatang",   icon: CalendarDays, color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    in_progress: { label: "Berlangsung", icon: Clock,       color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
    completed:   { label: "Selesai",     icon: CheckCircle, color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
    expired:     { label: "Berakhir",    icon: XCircle,     color: "bg-red-500/10 text-red-400 border-red-500/20" },
};

function StatusBadge({ status }) {
    const cfg = STATUS_CONFIG[status] ?? { label: status, color: "" };
    const Icon = cfg.icon ?? null;
    return (
        <Badge variant="outline" className={`${cfg.color} flex items-center gap-1`}>
            {Icon && <Icon className="size-3" />}
            {cfg.label}
        </Badge>
    );
}

function ExamCard({ exam }) {
    const cfg = STATUS_CONFIG[exam.status] ?? {};

    return (
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm transition-all hover:border-border hover:shadow-md shadow-none">
            <CardContent className="p-5">
                <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <StatusBadge status={exam.status} />
                            {exam.score !== null && exam.score !== undefined && (
                                <Badge variant="secondary">
                                    Skor: {Number(exam.score).toFixed(0)}
                                </Badge>
                            )}
                        </div>
                        <h3 className="truncate font-semibold text-base">
                            {exam.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            {exam.subject}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Timer className="size-3.5" />
                                {exam.duration_minutes} menit
                            </span>
                            <span className="flex items-center gap-1">
                                <CheckCircle className="size-3.5" />
                                Passing: {exam.pass_threshold}%
                            </span>
                            <span className="flex items-center gap-1">
                                <CalendarDays className="size-3.5" />
                                {new Date(exam.start_time).toLocaleString("id-ID", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                                {" – "}
                                {new Date(exam.end_time).toLocaleString("id-ID", {
                                    timeStyle: "short",
                                })}
                            </span>
                        </div>
                    </div>
                    <div className="shrink-0">
                        {exam.status === "available" && (
                            <Button size="sm" asChild>
                                <Link href={`/exams/${exam.exam_id}`}>
                                    Mulai
                                    <ArrowRight className="ml-1 size-3.5" />
                                </Link>
                            </Button>
                        )}
                        {exam.status === "in_progress" && exam.session_id && (
                            <Button size="sm" variant="default" asChild>
                                <Link href={`/sessions/${exam.session_id}`}>
                                    Lanjutkan
                                    <ArrowRight className="ml-1 size-3.5" />
                                </Link>
                            </Button>
                        )}
                        {exam.status === "completed" && exam.session_id && (
                            <Button size="sm" variant="outline" asChild>
                                <Link href={`/sessions/${exam.session_id}/result`}>
                                    Lihat Hasil
                                </Link>
                            </Button>
                        )}
                        {(exam.status === "upcoming" || exam.status === "expired") && (
                            <Button size="sm" variant="ghost" asChild>
                                <Link href={`/exams/${exam.exam_id}`}>
                                    Detail
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ExamsIndex({ exams }) {
    const grouped = {
        available:   exams.filter((e) => e.status === "available"),
        in_progress: exams.filter((e) => e.status === "in_progress"),
        upcoming:    exams.filter((e) => e.status === "upcoming"),
        completed:   exams.filter((e) => e.status === "completed"),
        expired:     exams.filter((e) => e.status === "expired"),
    };

    const order = ["in_progress", "available", "upcoming", "completed", "expired"];

    return (
        <>
            <Head title="Daftar Ujian" />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title="Daftar Ujian"
                    description="Semua ujian yang dijadwalkan untuk Anda."
                />

                {exams.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <BookOpen className="mb-4 size-14 text-muted-foreground/30" />
                        <p className="text-lg font-medium">Belum ada ujian</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Belum ada ujian yang dijadwalkan untuk grup Anda.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {order.map((status) => {
                            const items = grouped[status];
                            if (!items || items.length === 0) return null;
                            const cfg = STATUS_CONFIG[status];
                            return (
                                <div key={status}>
                                    <div className="mb-3 flex items-center gap-2">
                                        {cfg.icon && (
                                            <cfg.icon className="size-4 text-muted-foreground" />
                                        )}
                                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                                            {cfg.label} ({items.length})
                                        </h2>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                                        {items.map((exam) => (
                                            <ExamCard key={exam.schedule_id} exam={exam} />
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </LayoutApp>
        </>
    );
}
