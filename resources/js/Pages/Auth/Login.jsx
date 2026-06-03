import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import LayoutAuth from "@/Layouts/LayoutAuth";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/Components/ui/field";
import { Input } from "@/Components/ui/input";
import { Head, Link, useForm } from "@inertiajs/react";
import { Loader2, LogIn } from "lucide-react";

export default function Login({ className, ...props }) {
    //destruct useForm
    const { data, setData, post, processing, errors } = useForm({
        login: "",
        password: "",
    });

    //function "loginHandler"
    const loginHandler = async (e) => {
        e.preventDefault();

        //fetch to login
        post("/login");
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
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">
                                Selamat Datang
                            </CardTitle>
                            <CardDescription>
                                Masuk ke akun Anda untuk mengakses Aplikasi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={loginHandler}>
                                <FieldGroup>
                                    <Field>
                                        <FieldLabel htmlFor="login">
                                            Email atau Username
                                        </FieldLabel>

                                        <Input
                                            type="text"
                                            placeholder="email atau username"
                                            value={data.login}
                                            className={
                                                errors.login
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setData("login", e.target.value)
                                            }
                                        />

                                        {errors.login && (
                                            <FieldDescription className="text-red-500">
                                                {errors.login}
                                            </FieldDescription>
                                        )}
                                    </Field>
                                    <Field>
                                        <div className="flex items-center">
                                            <FieldLabel htmlFor="password">
                                                Password
                                            </FieldLabel>
                                            <Link
                                                href="/forgot-password"
                                                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                                            >
                                                Lupa password?
                                            </Link>
                                        </div>
                                        <Input
                                            type="password"
                                            placeholder="Masukkan password"
                                            value={data.password}
                                            className={
                                                errors.password
                                                    ? "border-red-500 focus-visible:ring-red-500"
                                                    : ""
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                        />
                                        {errors.password && (
                                            <FieldDescription className="text-red-500">
                                                {errors.password}
                                            </FieldDescription>
                                        )}
                                    </Field>
                                    <Field>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <span className="flex items-center justify-center">
                                                    <Loader2 className="animate-spin mr-2" />
                                                    Memproses...
                                                </span>
                                            ) : (
                                                <span className="flex items-center justify-center">
                                                    <LogIn className="w-5 h-5 mr-2" />
                                                    Masuk
                                                </span>
                                            )}
                                        </Button>
                                        <FieldDescription className="text-center">
                                            {new Date().getFullYear()} &copy;
                                            Build with &hearts; by{" "}
                                            <a
                                                href="https://alamkoding.com"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-medium"
                                            >
                                                AlamKoding
                                            </a>
                                        </FieldDescription>
                                    </Field>
                                </FieldGroup>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </LayoutAuth>
        </>
    );
}
