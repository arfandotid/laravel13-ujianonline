import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";

export default function ExamSchedulesCreate() {
    const { exams, groups } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        exam_id: "",
        group_id: "",
        start_time: "",
        end_time: "",
        is_active: "1",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/admin/schedules");
    };

    return (
        <>
            <Head title="Tambah Jadwal Ujian" />
            <LayoutApp>
                <PageHeader
                    title="Tambah Jadwal Ujian"
                    description="Jadwalkan ujian untuk kelompok peserta / group tertentu"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Pilih Ujian</FieldLabel>
                            <select
                                value={data.exam_id}
                                onChange={(e) => setData("exam_id", e.target.value)}
                                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                                    errors.exam_id ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">-- Pilih Ujian --</option>
                                {exams &&
                                    exams.map((ex) => (
                                        <option key={ex.id} value={ex.id}>
                                            {ex.title}
                                        </option>
                                    ))}
                            </select>
                            {errors.exam_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.exam_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Pilih Group / Rombel</FieldLabel>
                            <select
                                value={data.group_id}
                                onChange={(e) => setData("group_id", e.target.value)}
                                className={`w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring ${
                                    errors.group_id ? "border-red-500" : ""
                                }`}
                            >
                                <option value="">-- Pilih Group --</option>
                                {groups &&
                                    groups.map((g) => (
                                        <option key={g.id} value={g.id}>
                                            {g.name}
                                        </option>
                                    ))}
                            </select>
                            {errors.group_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.group_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Waktu Mulai</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    value={data.start_time}
                                    onChange={(e) =>
                                        setData("start_time", e.target.value)
                                    }
                                    className={`${
                                        errors.start_time ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.start_time && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.start_time}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Waktu Selesai</FieldLabel>
                                <Input
                                    type="datetime-local"
                                    value={data.end_time}
                                    onChange={(e) =>
                                        setData("end_time", e.target.value)
                                    }
                                    className={`${
                                        errors.end_time ? "border-red-500" : ""
                                    }`}
                                />
                                {errors.end_time && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.end_time}
                                    </FieldDescription>
                                )}
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
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Link href="/admin/schedules">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
