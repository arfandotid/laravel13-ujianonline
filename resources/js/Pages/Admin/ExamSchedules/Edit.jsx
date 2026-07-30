import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";
import ExamSelect from "@/Components/form/ExamSelect";
import GroupSelect from "@/Components/form/GroupSelect";
import DateTimePicker from "@/Components/form/DateTimePicker";

export default function ExamSchedulesEdit() {
    const { schedule, exams, groups } = usePage().props;

    const formatDatetimeLocal = (datetimeStr) => {
        if (!datetimeStr) return "";
        const date = new Date(datetimeStr);
        const pad = (n) => (n < 10 ? "0" + n : n);
        return (
            date.getFullYear() +
            "-" +
            pad(date.getMonth() + 1) +
            "-" +
            pad(date.getDate()) +
            "T" +
            pad(date.getHours()) +
            ":" +
            pad(date.getMinutes())
        );
    };

    const { data, setData, put, processing, errors } = useForm({
        exam_id: schedule.exam_id || "",
        group_id: schedule.group_id || "",
        start_time: formatDatetimeLocal(schedule.start_time),
        end_time: formatDatetimeLocal(schedule.end_time),
        is_active: schedule.is_active ? "1" : "0",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/schedules/${schedule.id}`);
    };

    return (
        <>
            <Head title="Edit Jadwal Ujian" />
            <LayoutApp>
                <PageHeader
                    title="Edit Jadwal Ujian"
                    description="Perbarui waktu dan kelompok ujian"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Pilih Ujian</FieldLabel>
                            <ExamSelect
                                exams={exams}
                                value={data.exam_id}
                                onChange={(val) => setData("exam_id", val)}
                                placeholder="-- Pilih Ujian --"
                            />
                            {errors.exam_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.exam_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Pilih Group / Rombel</FieldLabel>
                            <GroupSelect
                                groups={groups}
                                value={data.group_id}
                                onChange={(val) => setData("group_id", val)}
                                placeholder="-- Pilih Group --"
                            />
                            {errors.group_id && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.group_id}
                                </FieldDescription>
                            )}
                        </Field>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Waktu Mulai</FieldLabel>
                                <DateTimePicker
                                    value={data.start_time}
                                    onChange={(val) =>
                                        setData("start_time", val)
                                    }
                                    placeholder="Pilih tanggal & waktu mulai"
                                />
                                {errors.start_time && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.start_time}
                                    </FieldDescription>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel>Waktu Selesai</FieldLabel>
                                <DateTimePicker
                                    value={data.end_time}
                                    onChange={(val) => setData("end_time", val)}
                                    placeholder="Pilih tanggal & waktu selesai"
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
                            {processing ? "Menyimpan..." : "Update Jadwal"}
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
