import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Textarea } from "@/Components/ui/textarea";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";

export default function GroupsEdit() {
    const { group } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: group.name || "",
        description: group.description || "",
        is_active: group.is_active ? "1" : "0",
    });

    const submit = (e) => {
        e.preventDefault();
        put(`/admin/groups/${group.id}`);
    };

    return (
        <>
            <Head title="Edit Group" />
            <LayoutApp>
                <PageHeader
                    title="Edit Group"
                    description="Ubah data group rombel"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Nama Group</FieldLabel>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                className={`${errors.name ? "border-red-500" : ""}`}
                                placeholder="Contoh: Kelas X IPA 1"
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
                                placeholder="Deskripsi kelompok..."
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
                        <Link href="/admin/groups">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
