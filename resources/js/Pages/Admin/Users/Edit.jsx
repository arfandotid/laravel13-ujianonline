import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Input } from "@/Components/ui/input";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { APP_URL } from "@/constants/app";

export default function UsersEdit() {
    const { user, roles, userRoles } = usePage().props;

    const { data, setData, put, processing, errors } = useForm({
        name: user.name || "",
        email: user.email || "",
        username: user.username || "",
        password: "",
        roles: userRoles || [],
        is_active: user.is_active,
        avatar: null,
    });

    const toggleRole = (id) => {
        setData(
            "roles",
            data.roles.includes(id)
                ? data.roles.filter((item) => item !== id)
                : [...data.roles, id],
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    };

    return (
        <>
            <Head title={`Edit User - ${import.meta.env.VITE_APP_NAME}`} />
            <LayoutApp>
                <PageHeader
                    title="Edit User"
                    description="Perbarui data pengguna dan role akses"
                />

                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <Field>
                            <FieldLabel>Nama</FieldLabel>
                            <Input
                                type="text"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={`${errors.name ? "border-red-500" : ""}`}
                                placeholder="Nama lengkap"
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
                                placeholder="email@example.com"
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
                                placeholder="username"
                            />
                            {errors.username && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.username}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Password (opsional)</FieldLabel>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`${errors.password ? "border-red-500" : ""}`}
                                placeholder="Kosongkan jika tidak ingin mengubah"
                            />
                            {errors.password && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Roles</FieldLabel>

                            <div className="grid grid-cols-1 gap-4">
                                {roles.map((role) => (
                                    <Field
                                        orientation="horizontal"
                                        key={role.id}
                                    >
                                        <Checkbox
                                            id={`role-${role.id}`}
                                            checked={data.roles.includes(
                                                role.id,
                                            )}
                                            onCheckedChange={() => {
                                                toggleRole(role.id);
                                            }}
                                        />
                                        <FieldLabel htmlFor={`role-${role.id}`}>
                                            {role.name}
                                        </FieldLabel>
                                    </Field>
                                ))}
                            </div>

                            {errors.roles && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.roles}
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
                            {processing ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Link href="/admin/users">
                            <Button variant="outline">Batal</Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
