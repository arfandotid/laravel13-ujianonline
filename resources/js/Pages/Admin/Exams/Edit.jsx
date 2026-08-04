import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import StatusSelect from "@/Components/form/StatusSelect";
import SubjectSelect from "@/Components/form/SubjectSelect";

export default function ExamsEdit() {
    const { exam, subjects } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        subject_id: exam.subject_id || "",
        title: exam.title || "",
        description: exam.description || "",
        duration_minutes: exam.duration_minutes || 60,
        pass_threshold: exam.pass_threshold || 75,
        shuffle_questions: Boolean(exam.shuffle_questions),
        shuffle_answers: Boolean(exam.shuffle_answers),
        is_active: exam.is_active ? "1" : "0",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/exams/${exam.id}`);
    };

    return (
        <>
            <Head title="Edit Ujian" />
            <LayoutApp>
                <PageHeader
                    title="Edit Ujian"
                    description="Perbarui konfigurasi ujian online"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Mata Pelajaran</FieldLabel>
                            <SubjectSelect
                                subjects={subjects}
                                value={data.subject_id}
                                onChange={(val) => setData("subject_id", val)}
                                placeholder="-- Pilih Mata Pelajaran --"
                            />
                            {errors.subject_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.subject_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Judul Ujian</FieldLabel>
                            <Input
                                type="text"
                                value={data.title}
                                onChange={(e) => setData("title", e.target.value)}
                                className={`${errors.title ? "border-red-500" : ""}`}
                                placeholder="Judul ujian..."
                            />
                            {errors.title && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.title}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Deskripsi / Petunjuk Ujian</FieldLabel>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className={`${errors.description ? "border-red-500" : ""}`}
                                placeholder="Petunjuk pengerjaan..."
                            />
                            {errors.description && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.description}
                                </FieldDescription>
                            )}
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Durasi (Menit)</FieldLabel>
                                <Input
                                    type="number"
                                    min="1"
                                    value={data.duration_minutes}
                                    onChange={(e) =>
                                        setData("duration_minutes", e.target.value)
                                    }
                                    className={`${
                                        errors.duration_minutes ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.duration_minutes && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.duration_minutes}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Nilai Kelulusan / KKM (%)</FieldLabel>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={data.pass_threshold}
                                    onChange={(e) =>
                                        setData("pass_threshold", e.target.value)
                                    }
                                    className={`${
                                        errors.pass_threshold ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.pass_threshold && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.pass_threshold}
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-md bg-card">
                            <Field orientation="horizontal">
                                <Checkbox
                                    id="shuffle_questions"
                                    checked={data.shuffle_questions}
                                    onCheckedChange={(val) =>
                                        setData("shuffle_questions", val)
                                    }
                                />
                                <FieldLabel htmlFor="shuffle_questions">
                                    Acak Urutan Soal
                                </FieldLabel>
                            </Field>

                            <Field orientation="horizontal">
                                <Checkbox
                                    id="shuffle_answers"
                                    checked={data.shuffle_answers}
                                    onCheckedChange={(val) =>
                                        setData("shuffle_answers", val)
                                    }
                                />
                                <FieldLabel htmlFor="shuffle_answers">
                                    Acak Pilihan Jawaban
                                </FieldLabel>
                            </Field>
                        </div>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <StatusSelect
                                value={data.is_active}
                                onChange={(val) => setData("is_active", val)}
                            />
                        </Field>
                    </div>

                    <div className="flex justify-start space-x-2 pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save className="h-4 w-4 mr-1" />
                            {processing ? "Menyimpan..." : "Update Ujian"}
                        </Button>
                        <Link href="/admin/exams">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
