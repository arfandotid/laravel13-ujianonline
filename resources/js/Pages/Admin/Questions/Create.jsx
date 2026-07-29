import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save, Plus, Trash2 } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";

export default function QuestionsCreate() {
    const { subjects } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        subject_id: "",
        type: "multiple_choice",
        question_text: "",
        is_active: "1",
        options: [
            { option_text: "", is_correct: true, order: 1 },
            { option_text: "", is_correct: false, order: 2 },
        ],
    });

    const handleAddOption = () => {
        setData("options", [
            ...data.options,
            { option_text: "", is_correct: false, order: data.options.length + 1 },
        ]);
    };

    const handleRemoveOption = (index) => {
        const updated = data.options.filter((_, i) => i !== index);
        setData("options", updated);
    };

    const handleOptionTextChange = (index, text) => {
        const updated = [...data.options];
        updated[index].option_text = text;
        setData("options", updated);
    };

    const handleOptionCorrectChange = (selectedIndex) => {
        const updated = data.options.map((opt, i) => ({
            ...opt,
            is_correct: i === selectedIndex,
        }));
        setData("options", updated);
    };

    const submit = (e) => {
        e.preventDefault();
        post("/admin/questions");
    };

    return (
        <>
            <Head title="Tambah Soal" />
            <LayoutApp>
                <PageHeader
                    title="Tambah Soal"
                    description="Buat soal baru untuk bank soal"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Mata Pelajaran</FieldLabel>
                            <select
                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm ${
                                    errors.subject_id ? "border-red-500" : ""
                                }`}
                                value={data.subject_id}
                                onChange={(e) => setData("subject_id", e.target.value)}
                            >
                                <option value="">-- Pilih Mata Pelajaran --</option>
                                {subjects &&
                                    subjects.map((s) => (
                                        <option key={s.id} value={s.id}>
                                            {s.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.subject_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.subject_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Tipe Soal</FieldLabel>
                            <select
                                className={`flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring md:text-sm ${
                                    errors.type ? "border-red-500" : ""
                                }`}
                                value={data.type}
                                onChange={(e) => setData("type", e.target.value)}
                            >
                                <option value="multiple_choice">Pilihan Ganda (Multiple Choice)</option>
                                <option value="essay">Essay</option>
                            </select>
                            {errors.type && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.type}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Konten / Teks Soal</FieldLabel>
                            <Textarea
                                value={data.question_text}
                                onChange={(e) => setData("question_text", e.target.value)}
                                className={`${errors.question_text ? "border-red-500" : ""}`}
                                placeholder="Tuliskan pertanyaan disini..."
                            />
                            {errors.question_text && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.question_text}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Status</FieldLabel>
                            <StatusSelect
                                value={data.is_active}
                                onChange={(val) => setData("is_active", val)}
                            />
                        </Field>

                        {data.type === "multiple_choice" && (
                            <Field>
                                <div className="flex items-center justify-between mb-2">
                                    <FieldLabel>Pilihan Jawaban</FieldLabel>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleAddOption}
                                    >
                                        <Plus className="w-4 h-4 mr-1" /> Tambah Opsi
                                    </Button>
                                </div>

                                {errors.options && (
                                    <p className="mb-2 text-sm text-red-600">
                                        {errors.options}
                                    </p>
                                )}

                                <div className="space-y-3">
                                    {data.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="correct_option"
                                                checked={option.is_correct}
                                                onChange={() => handleOptionCorrectChange(index)}
                                                className="h-4 w-4 text-primary"
                                                title="Tandai sebagai jawaban benar"
                                            />
                                            <Input
                                                type="text"
                                                placeholder={`Opsi Jawaban ${String.fromCharCode(65 + index)}`}
                                                value={option.option_text}
                                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                                className="flex-1"
                                            />
                                            {data.options.length > 2 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => handleRemoveOption(index)}
                                                >
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </Field>
                        )}
                    </div>

                    <div className="flex justify-start space-x-2 pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save />
                            {processing ? "Menyimpan..." : "Simpan Soal"}
                        </Button>
                        <Link href="/admin/questions">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
