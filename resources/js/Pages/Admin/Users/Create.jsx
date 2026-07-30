import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import { Field, FieldDescription, FieldLabel } from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Checkbox } from "@/Components/ui/checkbox";
import { Button } from "@/Components/ui/button";
import StatusSelect from "@/Components/form/StatusSelect";
import GroupSelect from "@/Components/form/GroupSelect";

export default function UsersCreate() {
    const { roles, groups } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        name: "",
        email: "",
        username: "",
        password: "",
        roles: [],
        avatar: null,
        is_active: "1",
        group_id: "",
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
        post("/admin/users");
    };

    return (
        <>
            <Head title="Tambah User" />
            <LayoutApp>
                <PageHeader
                    title="Tambah User"
                    description="Buat akun pengguna dan tentukan role akses"
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
                            <FieldLabel>Password</FieldLabel>
                            <Input
                                type="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`${errors.password ? "border-red-500" : ""}`}
                                placeholder="Minimal 8 karakter"
                            />
                            {errors.password && (
                                <FieldDescription className="mt-1 text-sm text-red-600">
                                    {errors.password}
                                </FieldDescription>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Roles</FieldLabel>
                            {roles.map((role) => (
                                <Field orientation="horizontal" key={role.id}>
                                    <Checkbox
                                        id={`role-${role.id}`}
                                        checked={data.roles.includes(role.id)}
                                        onCheckedChange={() => {
                                            toggleRole(role.id);
                                        }}
                                    />
                                    <FieldLabel htmlFor={`role-${role.id}`}>
                                        {role.name}
                                    </FieldLabel>
                                </Field>
                            ))}

                            {errors.roles && (
                                <p className="mt-2 text-sm text-red-600">
                                    {errors.roles}
                                </p>
                            )}
                        </Field>
                        <Field>
                            <FieldLabel>Avatar</FieldLabel>
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
                            <FieldLabel>Grup</FieldLabel>
                            <GroupSelect
                                groups={groups}
                                value={data.group_id}
                                onChange={(val) => setData("group_id", val)}
                                placeholder="Pilih grup"
                            />
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
                            {processing ? "Menyimpan..." : "Simpan"}
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
