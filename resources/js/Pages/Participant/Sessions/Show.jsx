import { Head, router } from "@inertiajs/react";
import { useState, useEffect, useCallback, useRef } from "react";
import { ThemeProvider } from "@/Components/theme/ThemeProvider";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { cn } from "@/lib/utils";
import axios from "axios";
import Swal from "sweetalert2";
import {
    Timer,
    ChevronLeft,
    ChevronRight,
    SendHorizonal,
    BookOpen,
    CheckCircle2,
} from "lucide-react";

// ─── Timer countdown ─────────────────────────────────────────────────────────
function useCountdown(initialSeconds, onExpire) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const expiredRef = useRef(false);

    useEffect(() => {
        if (seconds <= 0 && !expiredRef.current) {
            expiredRef.current = true;
            onExpire();
            return;
        }

        const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
        return () => clearTimeout(id);
    }, [seconds, onExpire]);

    return seconds;
}

function formatTime(totalSeconds) {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
        return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ─── Question Navigator ───────────────────────────────────────────────────────
function QuestionNavigator({ questions, answers, currentIndex, onJump }) {
    return (
        <div className="grid grid-cols-5 gap-1.5">
            {questions.map((q, i) => {
                const answered = answers[q.id] != null && answers[q.id] !== "";
                const isCurrent = i === currentIndex;
                return (
                    <button
                        key={q.id}
                        onClick={() => onJump(i)}
                        className={cn(
                            "flex h-9 w-full items-center justify-center rounded-md text-xs font-medium transition-all",
                            isCurrent
                                ? "ring-2 ring-primary bg-primary/20 text-primary"
                                : answered
                                ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                                : "bg-muted/60 text-muted-foreground hover:bg-muted",
                        )}
                    >
                        {i + 1}
                    </button>
                );
            })}
        </div>
    );
}

// ─── Main Session Show Component ─────────────────────────────────────────────
export default function SessionShow({
    session,
    exam,
    questions,
    answers: initialAnswers,
    seconds_remaining,
    end_time,
}) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState(initialAnswers ?? {});
    const [submitting, setSubmitting] = useState(false);

    const currentQuestion = questions[currentIndex];

    // Auto-submit on timer expiry
    const handleExpire = useCallback(() => {
        if (submitting) return;
        setSubmitting(true);
        router.post(`/sessions/${session.id}/submit`, {}, {
            onFinish: () => setSubmitting(false),
        });
    }, [session.id, submitting]);

    const secondsLeft = useCountdown(seconds_remaining, handleExpire);

    // Save answer via Axios (auto-save, no page navigation)
    const saveAnswer = useCallback(
        async (questionId, answerText) => {
            try {
                await axios.patch(
                    `/sessions/${session.id}/answer`,
                    { question_id: questionId, answer_text: answerText },
                    {
                        headers: {
                            "X-CSRF-TOKEN": document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute("content"),
                        },
                    },
                );
            } catch (err) {
                // Silently fail — answer saved locally already
            }
        },
        [session.id],
    );

    const handleSelect = (questionId, optionId) => {
        const newAnswers = { ...answers, [questionId]: String(optionId) };
        setAnswers(newAnswers);
        saveAnswer(questionId, String(optionId));
    };

    const handleEssayChange = (questionId, text) => {
        setAnswers((prev) => ({ ...prev, [questionId]: text }));
    };

    const handleEssayBlur = (questionId, text) => {
        saveAnswer(questionId, text);
    };

    const handlePrev = () =>
        setCurrentIndex((i) => Math.max(0, i - 1));
    const handleNext = () =>
        setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));

    const handleSubmit = async () => {
        const answeredCount = Object.values(answers).filter(
            (a) => a != null && a !== "",
        ).length;
        const unanswered = questions.length - answeredCount;

        const confirm = await Swal.fire({
            title: "Kumpulkan Ujian?",
            html:
                unanswered > 0
                    ? `<p>Masih ada <strong>${unanswered} soal</strong> yang belum dijawab.</p><p class="text-sm text-gray-400 mt-1">Soal yang belum dijawab tidak mendapat poin.</p>`
                    : "<p>Semua soal sudah dijawab. Yakin ingin mengumpulkan?</p>",
            icon: unanswered > 0 ? "warning" : "question",
            showCancelButton: true,
            confirmButtonText: "Ya, Kumpulkan",
            cancelButtonText: "Batal",
            confirmButtonColor: "#7c3aed",
        });

        if (!confirm.isConfirmed) return;

        setSubmitting(true);
        router.post(`/sessions/${session.id}/submit`, {}, {
            onFinish: () => setSubmitting(false),
        });
    };

    const answeredCount = Object.values(answers).filter(
        (a) => a != null && a !== "",
    ).length;
    const timerDanger = secondsLeft <= 60;

    return (
        <>
            <Head title={`Ujian: ${exam.title}`} />
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <div className="flex h-screen flex-col bg-background text-foreground overflow-hidden">
                    {/* ── Header ─────────────────────────────────────────── */}
                    <header className="flex shrink-0 items-center justify-between border-b border-border/50 bg-card/60 px-4 py-3 backdrop-blur-sm">
                        <div className="flex items-center gap-3 min-w-0">
                            <BookOpen className="size-5 shrink-0 text-primary" />
                            <div className="min-w-0">
                                <p className="truncate font-semibold text-sm leading-tight">
                                    {exam.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {exam.subject}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-xs">
                                {answeredCount}/{questions.length} dijawab
                            </Badge>
                            {/* Timer */}
                            <div
                                className={cn(
                                    "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold transition-colors",
                                    timerDanger
                                        ? "border-red-500/40 bg-red-500/10 text-red-400 animate-pulse"
                                        : "border-border/50 bg-card text-foreground",
                                )}
                            >
                                <Timer className="size-4" />
                                {formatTime(secondsLeft)}
                            </div>

                            <Button
                                size="sm"
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="hidden sm:flex"
                            >
                                <SendHorizonal className="mr-1.5 size-4" />
                                {submitting ? "Mengumpulkan..." : "Kumpulkan"}
                            </Button>
                        </div>
                    </header>

                    {/* ── Body ───────────────────────────────────────────── */}
                    <div className="flex min-h-0 flex-1 overflow-hidden">
                        {/* Question Area */}
                        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 lg:p-6">
                            {currentQuestion ? (
                                <div className="mx-auto w-full max-w-2xl">
                                    {/* Question Number & Points */}
                                    <div className="mb-4 flex items-center gap-2">
                                        <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                            Soal {currentIndex + 1} dari{" "}
                                            {questions.length}
                                        </span>
                                        {currentQuestion.points > 0 && (
                                            <Badge variant="secondary" className="text-xs">
                                                {currentQuestion.points} poin
                                            </Badge>
                                        )}
                                    </div>

                                    {/* Question Text */}
                                    <div className="mb-6 rounded-xl border border-border/50 bg-card/60 p-5 text-sm leading-relaxed backdrop-blur-sm whitespace-pre-wrap">
                                        {currentQuestion.question_text}
                                    </div>

                                    {/* Options */}
                                    {currentQuestion.type === "multiple_choice" ? (
                                        <div className="space-y-2.5">
                                            {currentQuestion.options.map((opt) => {
                                                const selected =
                                                    answers[currentQuestion.id] ===
                                                    String(opt.id);
                                                return (
                                                    <button
                                                        key={opt.id}
                                                        onClick={() =>
                                                            handleSelect(
                                                                currentQuestion.id,
                                                                opt.id,
                                                            )
                                                        }
                                                        className={cn(
                                                            "flex w-full items-start gap-3 rounded-xl border px-4 py-3 text-left text-sm transition-all",
                                                            selected
                                                                ? "border-primary/60 bg-primary/10 text-primary ring-1 ring-primary/30"
                                                                : "border-border/40 bg-card/40 hover:border-border hover:bg-card/70",
                                                        )}
                                                    >
                                                        <div
                                                            className={cn(
                                                                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                                                                selected
                                                                    ? "border-primary bg-primary"
                                                                    : "border-muted-foreground/40",
                                                            )}
                                                        >
                                                            {selected && (
                                                                <div className="size-2 rounded-full bg-white" />
                                                            )}
                                                        </div>
                                                        <span className="flex-1 leading-relaxed">
                                                            {opt.option_text}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <textarea
                                            className="min-h-32 w-full rounded-xl border border-border/50 bg-card/60 p-4 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 backdrop-blur-sm resize-y"
                                            placeholder="Tulis jawaban Anda di sini..."
                                            value={answers[currentQuestion.id] ?? ""}
                                            onChange={(e) =>
                                                handleEssayChange(
                                                    currentQuestion.id,
                                                    e.target.value,
                                                )
                                            }
                                            onBlur={(e) =>
                                                handleEssayBlur(
                                                    currentQuestion.id,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}

                                    {/* Prev / Next */}
                                    <div className="mt-6 flex items-center justify-between">
                                        <Button
                                            variant="outline"
                                            onClick={handlePrev}
                                            disabled={currentIndex === 0}
                                        >
                                            <ChevronLeft className="mr-1 size-4" />
                                            Sebelumnya
                                        </Button>

                                        {currentIndex < questions.length - 1 ? (
                                            <Button onClick={handleNext}>
                                                Selanjutnya
                                                <ChevronRight className="ml-1 size-4" />
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={handleSubmit}
                                                disabled={submitting}
                                            >
                                                <SendHorizonal className="mr-1.5 size-4" />
                                                {submitting
                                                    ? "Mengumpulkan..."
                                                    : "Kumpulkan Ujian"}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground">
                                    Tidak ada soal.
                                </p>
                            )}
                        </main>

                        {/* ── Sidebar Navigator ─────────────────────────── */}
                        <aside className="hidden w-56 shrink-0 overflow-y-auto border-l border-border/50 bg-card/40 p-4 lg:block">
                            <div className="mb-3 flex items-center gap-2">
                                <CheckCircle2 className="size-4 text-muted-foreground" />
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Navigasi Soal
                                </p>
                            </div>
                            <QuestionNavigator
                                questions={questions}
                                answers={answers}
                                currentIndex={currentIndex}
                                onJump={setCurrentIndex}
                            />

                            <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-sm bg-emerald-500/30" />
                                    Sudah dijawab
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-sm bg-muted/60" />
                                    Belum dijawab
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="size-3 rounded-sm bg-primary/20 ring-1 ring-primary" />
                                    Soal aktif
                                </div>
                            </div>

                            <Button
                                className="mt-4 w-full"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={submitting}
                            >
                                <SendHorizonal className="mr-1.5 size-3.5" />
                                {submitting ? "Mengumpulkan..." : "Kumpulkan"}
                            </Button>
                        </aside>
                    </div>
                </div>
            </ThemeProvider>
        </>
    );
}
