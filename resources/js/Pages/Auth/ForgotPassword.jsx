import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Alert, AlertDescription } from "@/Components/ui/alert";
import { Link } from "@inertiajs/react";
import { CheckCircle2 } from "lucide-react";
import LayoutAuth from "@/Layouts/LayoutAuth";
import { cn } from "@/lib/utils";

export default function ForgotPassword({ className, status, ...props }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post("/forgot-password", { preserveScroll: true });
    };

    return (
        <>
            <Head title="Login" />
            <LayoutAuth>
                <div
                    className={cn("flex flex-col gap-6", className)}
                    {...props}
                >
                    <Card>
                        <CardHeader className="space-y-1 text-center">
                            <CardTitle className="text-2xl font-bold">
                                Lupa Password
                            </CardTitle>
                            <CardDescription>
                                Masukkan email kamu dan kami akan mengirimkan
                                link untuk reset password.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {status && (
                                <Alert className="mb-4 border-green-200 bg-green-50 text-green-800">
                                    <CheckCircle2 className="h-4 w-4" />
                                    <AlertDescription>
                                        {status}
                                    </AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={submit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="email@contoh.com"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        autoComplete="username"
                                        autoFocus
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Mengirim..."
                                        : "Kirim Link Reset Password"}
                                </Button>

                                <div className="text-center text-sm text-muted-foreground">
                                    Ingat password?{" "}
                                    <Link
                                        href="/login"
                                        className="text-primary underline underline-offset-4 hover:text-primary/80"
                                    >
                                        Kembali Login
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </LayoutAuth>
        </>
    );
}
