import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Button } from "@/Components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";

export default function PermissionsEdit() {
    const { permission } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: permission.name || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/permissions/${permission.id}`);
    };

    return (
        <>
            <Head title={`Edit Permission - ${import.meta.env.VITE_APP_NAME}`} />
            <LayoutApp>
                <PageHeader
                    title="Edit Permission"
                    description="Perbarui data permission untuk hak akses pengguna"
                />

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Nama Permission</FieldLabel>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={`${errors.name ? "border-red-500" : ""}`}
                                placeholder="Contoh: permissions.edit"
                            />
                            {errors.name && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </FieldDescription>
                            )}
                        </Field>
                    </div>

                    <div className="flex justify-start space-x-2 pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save />
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Link href="/admin/permissions">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
