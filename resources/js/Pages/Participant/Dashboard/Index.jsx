import { Head, Link } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    BookOpen,
    Clock,
    CheckCircle,
    CalendarDays,
    ArrowRight,
    Timer,
} from "lucide-react";

function StatusBadge({ status }) {
    const map = {
        available:   { label: "Tersedia",   className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
        upcoming:    { label: "Mendatang",  className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
        in_progress: { label: "Berlangsung",className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
        completed:   { label: "Selesai",    className: "bg-slate-500/10 text-slate-400 border-slate-500/20" },
        expired:     { label: "Berakhir",   className: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    const cfg = map[status] ?? { label: status, className: "" };
    return (
        <Badge variant="outline" className={cfg.className}>
            {cfg.label}
        </Badge>
    );
}

function StatCard({ icon: Icon, label, value, color }) {
    return (
        <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-none">
            <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-xl p-3 ${color}`}>
                    <Icon className="size-6" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-3xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function Dashboard({ stats, upcomingExams }) {
    return (
        <>
            <Head title="Dashboard Peserta" />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title="Dashboard"
                    description="Selamat datang! Pantau ujian Anda di sini."
                />

                {/* Stats */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <StatCard
                        icon={CalendarDays}
                        label="Ujian Mendatang"
                        value={stats.upcoming}
                        color="bg-blue-500/10 text-blue-400"
                    />
                    <StatCard
                        icon={Clock}
                        label="Ujian Tersedia"
                        value={stats.available}
                        color="bg-emerald-500/10 text-emerald-500"
                    />
                    <StatCard
                        icon={CheckCircle}
                        label="Ujian Selesai"
                        value={stats.completed}
                        color="bg-violet-500/10 text-violet-400"
                    />
                </div>

                {/* Upcoming Exams */}
                <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-none">
                    <CardHeader className="flex flex-row items-center justify-between pb-4">
                        <CardTitle className="flex items-center gap-2 text-base font-semibold">
                            <BookOpen className="size-4 text-primary" />
                            Ujian Aktif & Mendatang
                        </CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href="/exams">
                                Lihat semua
                                <ArrowRight className="ml-1 size-3.5" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {upcomingExams.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <BookOpen className="mb-3 size-10 text-muted-foreground/40" />
                                <p className="text-sm text-muted-foreground">
                                    Tidak ada ujian yang tersedia saat ini.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {upcomingExams.map((exam) => (
                                    <div
                                        key={exam.schedule_id}
                                        className="flex items-center justify-between rounded-lg border border-border/40 bg-background/40 p-4 transition-colors hover:bg-accent/40"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="truncate font-medium">
                                                    {exam.title}
                                                </p>
                                                <StatusBadge status={exam.status} />
                                            </div>
                                            <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                                                <span>{exam.subject}</span>
                                                <span className="flex items-center gap-1">
                                                    <Timer className="size-3" />
                                                    {exam.duration_minutes} menit
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <CalendarDays className="size-3" />
                                                    {new Date(exam.start_time).toLocaleString("id-ID", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-4 shrink-0">
                                            {exam.status === "available" ? (
                                                <Button size="sm" asChild>
                                                    <Link href={`/exams/${exam.exam_id}`}>
                                                        Mulai
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/exams/${exam.exam_id}`}>
                                                        Detail
                                                    </Link>
                                                </Button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </LayoutApp>
        </>
    );
}
