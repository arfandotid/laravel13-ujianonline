import { Head, Link, useForm, usePage } from "@inertiajs/react";
import LayoutApp from "@/Layouts/LayoutApp";
import { Save, ArrowLeft } from "lucide-react";
import PageHeader from "@/Components/common/PageHeader";
import TableEmpty from "@/Components/common/TableEmpty";
import Search from "@/Components/common/Search";
import TablePagination from "@/Components/common/TablePagination";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Field, FieldLabel, FieldDescription } from "@/Components/ui/field";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { Badge } from "@/Components/ui/badge";
import { APP_URL } from "@/constants/app";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/Components/table/BasicTable";

export default function GroupMembers() {
    const { group, users, groupUserIds } = usePage().props;

    const { data, setData, post, processing, errors } = useForm({
        user_ids: groupUserIds || [],
    });

    const toggleUser = (userId) => {
        setData(
            "user_ids",
            data.user_ids.includes(userId)
                ? data.user_ids.filter((id) => id !== userId)
                : [...data.user_ids, userId],
        );
    };

    const submit = (e) => {
        e.preventDefault();
        post(`/admin/groups/${group.id}/members`);
    };

    return (
        <>
            <Head title={`Kelola Anggota - ${group.name}`} />
            <LayoutApp>
                <PageHeader
                    title={`Kelola Anggota: ${group.name}`}
                    description="Atur peserta yang tergabung dalam group ini"
                />

                <form onSubmit={submit}>
                    <div className="space-y-5">
                        <Search URL={`/admin/groups/${group.id}/members`} />

                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-10">No.</TableHead>
                                    <TableHead className="w-10">Avatar</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="w-24">Anggota</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users && users.data.length > 0 ? (
                                    users.data.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {++index +
                                                    (users.current_page - 1) *
                                                        users.per_page}
                                            </TableCell>
                                            <TableCell>
                                                <Avatar className="h-8 w-8 rounded-full">
                                                    <AvatarImage
                                                        src={`${APP_URL}/uploads/avatars/${user.avatar}`}
                                                        alt={user.name}
                                                    />
                                                    <AvatarFallback className="rounded-full">
                                                        {user.name
                                                            .charAt(0)
                                                            .toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                            </TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    id={`user-${user.id}`}
                                                    checked={data.user_ids.includes(
                                                        user.id,
                                                    )}
                                                    onCheckedChange={() => {
                                                        toggleUser(user.id);
                                                    }}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableEmpty
                                        title="Tidak ada peserta"
                                        description="Tidak ada user dengan role participant"
                                        colSpan={5}
                                    />
                                )}
                            </TableBody>
                        </Table>

                        <TablePagination links={users.links} />
                    </div>

                    <div className="flex justify-start space-x-2 pt-6">
                        <Button type="submit" disabled={processing}>
                            <Save />
                            {processing ? "Menyimpan..." : "Simpan"}
                        </Button>
                        <Link href="/admin/groups">
                            <Button variant="outline">
                                <ArrowLeft />
                                Kembali
                            </Button>
                        </Link>
                    </div>
                </form>
            </LayoutApp>
        </>
    );
}
