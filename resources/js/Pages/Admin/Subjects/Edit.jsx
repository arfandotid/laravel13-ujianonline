import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";

export default function SubjectsEdit() {
    const { subject } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: subject.name || "",
        description: subject.description || "",
        is_active: subject.is_active ? "1" : "0",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/subjects/${subject.id}`);
    };

    return (
        <>
            <Head title="Edit Mata Pelajaran" />
            <LayoutApp>
                <PageHeader
                    title="Edit Mata Pelajaran"
                    description="Ubah data mata pelajaran"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Nama Mata Pelajaran</FieldLabel>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className={`${errors.name ? "border-red-500" : ""}`}
                                placeholder="Contoh: Matematika"
                            />
                            {errors.name && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </FieldDescription>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel>Deskripsi</FieldLabel>
                            <Textarea
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                                className={`${errors.description ? "border-red-500" : ""}`}
                                placeholder="Deskripsi mata pelajaran..."
                            />
                            {errors.description && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.description}
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
                    </div>

                    <div className="flex justify-start space-x-2 pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save />
                            {processing ? "Perbarui..." : "Perbarui"}
                        </Button>
                        <Link href="/admin/subjects">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
