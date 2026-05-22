import { Head, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import {
    Field,
    FieldDescription,
    FieldLabel,
    FieldSet,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import PageHeader from "@/Shared/PageHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { APP_URL } from "@/constants/app";

export default function ProfileIndex() {
    const { user } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: user?.name || "",
        email: user?.email || "",
        username: user?.username || "",

        _method: "PUT",
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post("/profile", {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={`Profile`} />
            <LayoutApp>
                <PageHeader title="Profile" description="Kelola profil saya" />

                <form onSubmit={handleSubmit}>
                    <FieldSet>
                        <Field>
                            <FieldLabel>Nama</FieldLabel>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={`${errors.name ? "border-red-500" : ""}`}
                            />
                            {errors.name && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.name}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Email</FieldLabel>
                            <Input
                                type="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={`${errors.email ? "border-red-500" : ""}`}
                            />
                            {errors.email && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.email}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Username</FieldLabel>
                            <Input
                                type="text"
                                value={data.username}
                                onChange={(e) =>
                                    setData("username", e.target.value)
                                }
                                className={`${errors.username ? "border-red-500" : ""}`}
                            />
                            {errors.username && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.username}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Avatar</FieldLabel>
                            <div className="flex">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage
                                        src={`${APP_URL}/uploads/avatars/${user.avatar}`}
                                        alt={user.name}
                                    />
                                    <AvatarFallback className="rounded-full">
                                        {user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <Input
                                type="file"
                                onChange={(e) =>
                                    setData("avatar", e.target.files[0])
                                }
                                className={`${errors.avatar ? "border-red-500" : ""}`}
                            />
                            {errors.avatar && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.avatar}
                                </FieldDescription>
                            )}
                        </Field>
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
