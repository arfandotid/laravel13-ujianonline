import { ThemeProvider } from "@/Components/theme/ThemeProvider";
import { ThemeToggle } from "@/Components/theme/ThemeToggle";
import { APP_URL } from "@/constants/app";
import { usePage } from "@inertiajs/react";
import { GalleryVerticalEnd } from "lucide-react";

export default function LayoutAuth({ children }) {
    const { settings } = usePage().props;

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="relative bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
                <div className="absolute right-6 top-6">
                    <ThemeToggle />
                </div>

                <div className="flex w-full max-w-sm flex-col gap-6">
                    <a
                        href="/"
                        className="flex items-center gap-2 self-center font-medium"
                    >
                        {settings?.app_logo ? (
                            <img
                                src={`${APP_URL}/uploads/settings/logo/${settings.app_logo}`}
                                alt="App Logo"
                                className="flex size-6 items-center justify-center rounded-md"
                            />
                        ) : (
                            <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                                <GalleryVerticalEnd className="size-4" />
                            </div>
                        )}
                        {settings?.app_name ||
                            import.meta.env.VITE_APP_NAME}
                    </a>

                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
