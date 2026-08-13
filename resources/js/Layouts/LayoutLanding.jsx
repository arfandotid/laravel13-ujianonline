import { ThemeProvider } from "@/Components/theme/ThemeProvider";
import { ThemeToggle } from "@/Components/theme/ThemeToggle";
import { Button } from "@/Components/ui/button";
import { APP_URL } from "@/constants/app";
import { Link, usePage } from "@inertiajs/react";
import { GalleryVerticalEnd } from "lucide-react";

const navLinks = [
    { label: "Fitur", href: "#fitur" },
    { label: "Cara Kerja", href: "#cara-kerja" },
    { label: "FAQ", href: "#faq" },
];

function Brand() {
    const { settings } = usePage().props;
    const name = settings?.app_name || import.meta.env.VITE_APP_NAME;

    return (
        <a
            href="/"
            className="flex items-center gap-2 font-medium"
        >
            {settings?.app_logo ? (
                <img
                    src={`${APP_URL}/uploads/settings/logo/${settings.app_logo}`}
                    alt="App Logo"
                    className="size-8 rounded-md"
                />
            ) : (
                <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                    <GalleryVerticalEnd className="size-5" />
                </div>
            )}
            {name}
        </a>
    );
}

function Header() {
    return (
        <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
                <Brand />

                <nav className="hidden items-center gap-1 md:flex">
                    {navLinks.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <Button asChild size="sm">
                        <Link href="/login">Masuk</Link>
                    </Button>
                </div>
            </div>
        </header>
    );
}

function Footer() {
    const { settings } = usePage().props;
    const name = settings?.app_name || import.meta.env.VITE_APP_NAME;

    return (
        <footer className="border-t border-border/40">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6">
                <div className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} {name}. Semua hak dilindungi.
                </div>
                <div className="text-sm text-muted-foreground">
                    Build with{" "}
                    <span className="text-red-500">&hearts;</span> by{" "}
                    <a
                        href="https://alamkoding.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-foreground hover:underline"
                    >
                        AlamKoding
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default function LayoutLanding({ children }) {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <div className="flex min-h-svh flex-col bg-background text-foreground">
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
            </div>
        </ThemeProvider>
    );
}