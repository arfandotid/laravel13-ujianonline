import { Head, useForm, usePage, router } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldSet,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import PageHeader from "@/Components/common/PageHeader";
import { APP_URL } from "@/constants/app";

export default function SettingsIndex() {
    const { settings } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        app_name: settings?.app_name || "",
        app_logo: null,
        _method: "PUT",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/settings", {
            preserveScroll: true,
        });
    };

    const deleteLogo = async () => {
        Swal.fire({
            title: "Apakah Anda Yakin?",
            text: "Data yang telah dihapus tidak dapat dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete("/settings/delete-logo");
            }
        });
    };

    return (
        <>
            <Head title="Pengaturan Aplikasi" />
            <LayoutApp>
                <PageHeader
                    title="Pengaturan"
                    description="Kelola pengaturan aplikasi"
                />

                <form onSubmit={handleSubmit}>
                    <FieldSet>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <Field>
                                <FieldLabel>Logo Aplikasi</FieldLabel>
                                <div className="flex gap-2 items-center">
                                    <Input
                                        type="file"
                                        id="logo_file"
                                        onChange={(e) =>
                                            setData(
                                                "app_logo",
                                                e.target.files[0],
                                            )
                                        }
                                        accept="image/png, image/jpeg, image/jpg"
                                    />
                                    {settings?.app_logo && (
                                        <>
                                            <a
                                                href={`${APP_URL}/uploads/settings/logo/${settings?.app_logo}`}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="cursor-zoom-in"
                                            >
                                                <img
                                                    src={`${APP_URL}/uploads/settings/logo/${settings?.app_logo}`}
                                                    alt="Logo Aplikasi"
                                                    className="w-10 h-10 object-contain border rounded-md"
                                                />
                                            </a>
                                            <Button
                                                type="button"
                                                onClick={deleteLogo}
                                                variant="destructive"
                                                size="icon"
                                            >
                                                <Trash2 />
                                            </Button>
                                        </>
                                    )}
                                </div>
                                <FieldDescription className="text-xs text-gray-500 mt-1">
                                    PNG / JPG, maksimal 2MB
                                </FieldDescription>
                                {errors.app_logo && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.app_logo}
                                    </FieldDescription>
                                )}
                            </Field>
                            <Field>
                                <FieldLabel>Nama Aplikasi</FieldLabel>
                                <Input
                                    type="text"
                                    value={data.app_name}
                                    onChange={(e) =>
                                        setData("app_name", e.target.value)
                                    }
                                    className={`${errors.app_name ? "border-red-500" : ""}`}
                                />
                                {errors.app_name && (
                                    <FieldDescription className="mt-1 text-sm text-red-600">
                                        {errors.app_name}
                                    </FieldDescription>
                                )}
                            </Field>
                        </div>

                        <div>
                            <Button type="submit" disabled={processing}>
                                <Save />
                                {processing
                                    ? "Menyimpan..."
                                    : "Simpan Perubahan"}
                            </Button>
                        </div>
                    </FieldSet>
                </form>
            </LayoutApp>
        </>
    );
}
