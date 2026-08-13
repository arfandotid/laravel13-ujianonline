import { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import LayoutLanding from "@/Layouts/LayoutLanding";
import { Button } from "@/Components/ui/button";
import { Badge } from "@/Components/ui/badge";
import { Card, CardContent } from "@/Components/ui/card";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    ArrowRight,
    BarChart3,
    CalendarDays,
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    FolderOpen,
    Monitor,
    PencilLine,
    ShieldCheck,
    Zap,
} from "lucide-react";

const features = [
    {
        icon: FolderOpen,
        title: "Bank Soal Terpusat",
        description:
            "Kelola ribuan soal pilihan ganda dan essay dalam satu bank soal yang rapi, lengkap dengan bobot nilai.",
    },
    {
        icon: CalendarDays,
        title: "Penjadwalan Ujian",
        description:
            "Atur jadwal ujian per rombongan belajar dengan batas waktu mulai dan berakhir yang fleksibel.",
    },
    {
        icon: Zap,
        title: "Koreksi Otomatis",
        description:
            "Soal pilihan ganda dikoreksi dan dinilai otomatis begitu peserta mengumpulkan jawaban.",
    },
    {
        icon: PencilLine,
        title: "Penilaian Essay",
        description:
            "Nilai jawaban essay secara manual dengan mudah, skor total langsung dihitung ulang secara otomatis.",
    },
    {
        icon: BarChart3,
        title: "Hasil Instan & Analisis",
        description:
            "Peserta melihat hasil secara langsung setelah ujian selesai, lengkap dengan review jawaban.",
    },
    {
        icon: Monitor,
        title: "Multi Perangkat",
        description:
            "Akses ujian dari komputer, laptop, maupun tablet selama terhubung dengan internet.",
    },
];

const steps = [
    {
        title: "Siapkan Soal & Jadwal",
        description:
            "Admin menyusun bank soal, mengatur bobot nilai, lalu membuat jadwal ujian untuk setiap rombongan belajar.",
    },
    {
        title: "Peserta Mengerjakan",
        description:
            "Peserta masuk ke akun, memulai ujian sesuai jadwal, dan mengerjakan soal dengan batas waktu yang ditentukan.",
    },
    {
        title: "Hasil Langsung Tampil",
        description:
            "Jawaban pilihan ganda dinilai otomatis, soal essay dinilai oleh admin, dan nilai akhir langsung terlihat.",
    },
];

const faqs = [
    {
        question: "Apakah aplikasi ini gratis digunakan?",
        answer:
            "Silakan hubungi tim kami untuk informasi mengenai paket penggunaan aplikasi sesuai kebutuhan institusi Anda.",
    },
    {
        question: "Perangkat apa saja yang bisa digunakan peserta?",
        answer:
            "Peserta dapat mengerjakan ujian dari komputer, laptop, atau tablet selama terhubung ke internet dan menggunakan browser modern.",
    },
    {
        question: "Bagaimana cara peserta melihat hasil ujian?",
        answer:
            "Hasil ujian dapat dilihat langsung pada halaman hasil setelah ujian selesai, mencakup skor, status lulus, dan review jawaban.",
    },
    {
        question: "Apakah jawaban tersimpan otomatis jika koneksi terputus?",
        answer:
            "Jawaban peserta tersimpan otomatis saat sesi ujian berlangsung, sehingga risiko kehilangan jawaban dapat diminimalkan.",
    },
];

function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/10 via-transparent to-transparent" />
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
                <div className="grid items-center gap-10 lg:grid-cols-2">
                    <div>
                        <Badge
                            variant="outline"
                            className="border-primary/30 bg-primary/10 text-primary"
                        >
                            <ShieldCheck className="size-3.5" />
                            Solusi Ujian Online Modern
                        </Badge>
                        <h1 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
                            Ujian Online Jadi{" "}
                            <span className="text-primary">
                                Mudah, Cepat &amp; Efisien
                            </span>
                        </h1>
                        <p className="mt-4 text-lg text-muted-foreground">
                            Kelola bank soal, jadwalkan ujian, koreksi otomatis,
                            dan tampilkan hasil secara langsung dalam satu
                            aplikasi terpadu.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button asChild size="lg">
                                <Link href="/login">
                                    Masuk ke Aplikasi
                                    <ArrowRight />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <a href="#fitur">Lihat Fitur</a>
                            </Button>
                        </div>
                    </div>

                    {/* Stylized dashboard preview */}
                    <div className="relative">
                        <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-primary/10 blur-2xl" />
                        <Card className="relative border-border/50 bg-card/80 shadow-xl backdrop-blur">
                            <CardContent className="p-5">
                                <div className="flex items-center justify-between border-b border-border/40 pb-4">
                                    <div>
                                        <p className="text-sm font-semibold">
                                            Matematika — Ujian Tengah Semester
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Kelas XII · 30 Soal · 90 Menit
                                        </p>
                                    </div>
                                    <Badge className="bg-emerald-500/10 text-emerald-400">
                                        Aktif
                                    </Badge>
                                </div>
                                <div className="mt-4 space-y-2.5">
                                    {[
                                        {
                                            label: "Soal 1",
                                            status: "Selesai",
                                            good: true,
                                        },
                                        {
                                            label: "Soal 2",
                                            status: "Selesai",
                                            good: true,
                                        },
                                        {
                                            label: "Soal 3",
                                            status: "Selesai",
                                            good: false,
                                        },
                                        {
                                            label: "Soal 4",
                                            status: "Sedang dikerjakan",
                                            good: false,
                                        },
                                    ].map((q, i) => (
                                        <div
                                            key={q.label}
                                            className="flex items-center gap-3 rounded-lg border border-border/40 bg-background/50 px-3 py-2.5"
                                        >
                                            <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                                                {i + 1}
                                            </div>
                                            <span className="text-sm">
                                                {q.label}
                                            </span>
                                            <span className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
                                                {q.good && (
                                                    <CheckCircle2 className="size-4 text-emerald-500" />
                                                )}
                                                {q.status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                                    <span className="text-sm text-muted-foreground">
                                        Waktu tersisa
                                    </span>
                                    <span className="flex items-center gap-1.5 font-mono text-sm font-semibold">
                                        <ClipboardList className="size-4 text-primary" />
                                        62:45
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}

function Features() {
    return (
        <section id="fitur" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Fitur Lengkap untuk Ujian Online
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Semua yang Anda butuhkan untuk menyelenggarakan ujian
                    berbasis komputer dari satu tempat.
                </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {features.map((feature) => (
                    <Card
                        key={feature.title}
                        className="border-border/40 bg-card/50 transition-colors hover:border-primary/40 hover:bg-card"
                    >
                        <CardContent className="p-5">
                            <div className="bg-primary/10 text-primary flex size-11 items-center justify-center rounded-lg">
                                <feature.icon className="size-5" />
                            </div>
                            <h3 className="mt-4 font-semibold">
                                {feature.title}
                            </h3>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {feature.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}

function HowItWorks() {
    return (
        <section
            id="cara-kerja"
            className="border-y border-border/40 bg-muted/30"
        >
            <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
                <div className="mx-auto max-w-2xl text-center">
                    <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                        Cara Kerja
                    </h2>
                    <p className="mt-3 text-muted-foreground">
                        Tiga langkah sederhana untuk menyelenggarakan ujian
                        online.
                    </p>
                </div>
                <div className="mt-10 grid gap-4 md:grid-cols-3">
                    {steps.map((step, index) => (
                        <Card
                            key={step.title}
                            className="relative border-border/40 bg-card/50"
                        >
                            <CardContent className="p-5">
                                <div className="text-primary flex size-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold">
                                    {index + 1}
                                </div>
                                <h3 className="mt-4 font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}

function FAQ() {
    const [open, setOpen] = useState(0);

    return (
        <section id="faq" className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-20">
            <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                    Pertanyaan Umum
                </h2>
                <p className="mt-3 text-muted-foreground">
                    Jawaban atas pertanyaan yang sering diajukan.
                </p>
            </div>
            <div className="mt-8 space-y-3">
                {faqs.map((faq, index) => (
                    <Collapsible
                        key={faq.question}
                        open={open === index}
                        onOpenChange={(isOpen) => setOpen(isOpen ? index : null)}
                        className="rounded-lg border border-border/40 bg-card/50"
                    >
                        <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-4 py-3.5 text-left font-medium">
                            {faq.question}
                            <ChevronDown
                                className={`size-4 shrink-0 text-muted-foreground transition-transform ${
                                    open === index ? "rotate-180" : ""
                                }`}
                            />
                        </CollapsibleTrigger>
                        <CollapsibleContent className="px-4 pb-4">
                            <p className="text-sm text-muted-foreground">
                                {faq.answer}
                            </p>
                        </CollapsibleContent>
                    </Collapsible>
                ))}
            </div>
        </section>
    );
}

function CTA() {
    return (
        <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-20">
            <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-primary/20 via-card to-card p-8 text-center md:p-12">
                <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-96 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
                <h2 className="relative text-2xl font-bold tracking-tight md:text-3xl">
                    Siap Menyelenggarakan Ujian Online?
                </h2>
                <p className="relative mx-auto mt-3 max-w-xl text-muted-foreground">
                    Masuk sekarang dan kelola bank soal, jadwal, hingga hasil
                    ujian dengan mudah.
                </p>
                <div className="relative mt-6">
                    <Button asChild size="lg">
                        <Link href="/login">
                            Mulai Sekarang
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}

export default function Landing() {
    return (
        <>
            <Head title="Ujian Online" />
            <LayoutLanding>
                <Hero />
                <Features />
                <HowItWorks />
                <FAQ />
                <CTA />
            </LayoutLanding>
        </>
    );
}