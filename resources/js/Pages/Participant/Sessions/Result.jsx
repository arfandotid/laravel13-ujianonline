import { Head, Link } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import PageHeader from "@/Components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import { cn } from "@/lib/utils";
import {
    CheckCircle2,
    XCircle,
    MinusCircle,
    Trophy,
    Target,
    Timer,
    CalendarDays,
    ArrowLeft,
    BookOpen,
    ClipboardList,
} from "lucide-react";

function ScoreRing({ score, passThreshold }) {
    const passed = score >= passThreshold;
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative flex items-center justify-center">
                <svg width="140" height="140" className="-rotate-90">
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        className="text-muted/30"
                    />
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="10"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        strokeLinecap="round"
                        className={cn(
                            "transition-all duration-1000",
                            passed ? "text-emerald-500" : "text-red-500",
                        )}
                    />
                </svg>
                <div className="absolute flex flex-col items-center">
                    <span className="text-3xl font-bold tabular-nums">
                        {Number(score).toFixed(0)}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                </div>
            </div>
            <Badge
                variant="outline"
                className={cn(
                    "gap-1.5 px-3 py-1 text-sm font-semibold",
                    passed
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-red-500/30 bg-red-500/10 text-red-400",
                )}
            >
                {passed ? (
                    <Trophy className="size-4" />
                ) : (
                    <XCircle className="size-4" />
                )}
                {passed ? "LULUS" : "TIDAK LULUS"}
            </Badge>
        </div>
    );
}

function AnswerItem({ result, index }) {
    const isCorrect = result.is_correct === true;
    const isWrong = result.is_correct === false;
    const isEssay = result.type === "essay";
    const isUnanswered = !result.answer_text;

    return (
        <div className="rounded-xl border border-border/40 bg-card/50 p-4">
            <div className="mb-3 flex items-start gap-3">
                <div
                    className={cn(
                        "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full",
                        isEssay
                            ? "bg-muted/60 text-muted-foreground"
                            : isCorrect
                            ? "bg-emerald-500/20 text-emerald-400"
                            : isUnanswered
                            ? "bg-slate-500/20 text-slate-400"
                            : "bg-red-500/20 text-red-400",
                    )}
                >
                    {isEssay ? (
                        <MinusCircle className="size-3.5" />
                    ) : isCorrect ? (
                        <CheckCircle2 className="size-3.5" />
                    ) : isUnanswered ? (
                        <MinusCircle className="size-3.5" />
                    ) : (
                        <XCircle className="size-3.5" />
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Soal {index + 1}
                        </span>
                        {!isEssay && (
                            <Badge
                                variant="outline"
                                className={cn(
                                    "text-xs",
                                    isCorrect
                                        ? "border-emerald-500/20 text-emerald-400"
                                        : isUnanswered
                                        ? "border-slate-500/20 text-slate-400"
                                        : "border-red-500/20 text-red-400",
                                )}
                            >
                                {isCorrect
                                    ? `+${Number(result.points_earned ?? 0).toFixed(0)} poin`
                                    : isUnanswered
                                    ? "Tidak dijawab"
                                    : "Salah"}
                            </Badge>
                        )}
                        {isEssay && (
                            <Badge variant="secondary" className="text-xs">
                                Essay — Belum dinilai
                            </Badge>
                        )}
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {result.question_text}
                    </p>
                </div>
            </div>

            {/* Options review (MCQ) */}
            {result.type === "multiple_choice" && (
                <div className="ml-9 space-y-1.5">
                    {result.options.map((opt) => {
                        const isSelected =
                            result.answer_text === String(opt.id);
                        const isCorrectOpt = opt.is_correct;

                        return (
                            <div
                                key={opt.id}
                                className={cn(
                                    "flex items-center gap-2 rounded-lg px-3 py-2 text-sm",
                                    isCorrectOpt
                                        ? "bg-emerald-500/10 text-emerald-400"
                                        : isSelected && !isCorrectOpt
                                        ? "bg-red-500/10 text-red-400"
                                        : "text-muted-foreground",
                                )}
                            >
                                <div
                                    className={cn(
                                        "flex size-4 shrink-0 items-center justify-center rounded-full border",
                                        isCorrectOpt
                                            ? "border-emerald-500 bg-emerald-500/20"
                                            : isSelected
                                            ? "border-red-500 bg-red-500/20"
                                            : "border-muted-foreground/30",
                                    )}
                                >
                                    {(isSelected || isCorrectOpt) && (
                                        <div
                                            className={cn(
                                                "size-1.5 rounded-full",
                                                isCorrectOpt
                                                    ? "bg-emerald-500"
                                                    : "bg-red-500",
                                            )}
                                        />
                                    )}
                                </div>
                                <span>{opt.option_text}</span>
                                {isCorrectOpt && (
                                    <CheckCircle2 className="ml-auto size-3.5 text-emerald-500" />
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Essay answer review */}
            {result.type === "essay" && result.answer_text && (
                <div className="ml-9 mt-2 rounded-lg bg-muted/30 p-3 text-sm text-muted-foreground italic">
                    {result.answer_text}
                </div>
            )}
        </div>
    );
}

export default function SessionResult({ session, exam, results }) {
    const passed = session.score >= exam.pass_threshold;
    const answeredCount = results.filter((r) => r.answer_text).length;
    const correctCount = results.filter((r) => r.is_correct === true).length;
    const duration = session.submitted_at && session.started_at
        ? Math.round(
              (new Date(session.submitted_at) - new Date(session.started_at)) /
                  60000,
          )
        : null;

    return (
        <>
            <Head title={`Hasil: ${exam.title}`} />
            <LayoutApp>
                <PageHeader
                    showButton={false}
                    title="Hasil Ujian"
                    description={exam.title}
                />

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Score panel */}
                    <div className="space-y-4 lg:col-span-1">
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                            <CardContent className="flex flex-col items-center gap-4 p-6">
                                <ScoreRing
                                    score={session.score ?? 0}
                                    passThreshold={exam.pass_threshold}
                                />

                                <div className="w-full space-y-2.5 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <Target className="size-3.5" />
                                            Passing Grade
                                        </span>
                                        <span className="font-medium">{exam.pass_threshold}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <ClipboardList className="size-3.5" />
                                            Dijawab
                                        </span>
                                        <span className="font-medium">
                                            {answeredCount}/{results.length}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1.5 text-muted-foreground">
                                            <CheckCircle2 className="size-3.5" />
                                            Benar
                                        </span>
                                        <span className="font-medium text-emerald-400">
                                            {correctCount}
                                        </span>
                                    </div>
                                    {duration !== null && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <Timer className="size-3.5" />
                                                Durasi
                                            </span>
                                            <span className="font-medium">{duration} menit</span>
                                        </div>
                                    )}
                                    {session.submitted_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="flex items-center gap-1.5 text-muted-foreground">
                                                <CalendarDays className="size-3.5" />
                                                Dikumpulkan
                                            </span>
                                            <span className="font-medium text-xs">
                                                {new Date(session.submitted_at).toLocaleString(
                                                    "id-ID",
                                                    { dateStyle: "medium", timeStyle: "short" },
                                                )}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Button variant="outline" className="w-full" asChild>
                            <Link href="/exams">
                                <ArrowLeft className="mr-2 size-4" />
                                Kembali ke Daftar Ujian
                            </Link>
                        </Button>
                    </div>

                    {/* Answer review */}
                    <div className="lg:col-span-2">
                        <Card className="border-border/50 bg-card/60 backdrop-blur-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <BookOpen className="size-4 text-primary" />
                                    Review Jawaban
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {results.map((result, i) => (
                                        <AnswerItem
                                            key={result.id}
                                            result={result}
                                            index={i}
                                        />
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </LayoutApp>
        </>
    );
}
