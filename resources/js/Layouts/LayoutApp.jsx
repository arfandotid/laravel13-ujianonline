import { AppSidebar } from "@/Components/Sidebar/AppSidebar";
import NavBreadcrumb from "@/Components/Sidebar/NavBreadcrumb";
import { ThemeProvider } from "@/Components/theme/ThemeProvider";
import { ThemeToggle } from "@/Components/theme/ThemeToggle";
import { Separator } from "@/Components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/Components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import Swal from "sweetalert2";

export default function LayoutApp({ children }) {
    const { auth, flash } = usePage().props;

    useEffect(() => {
        if (flash?.success) {
            Swal.fire({
                icon: "success",
                title: "SUCCESS!",
                text: flash.success,
                showConfirmButton: false,
                timer: 2000,
                timerProgressBar: true,
            });
        } else if (flash?.error) {
            Swal.fire({
                icon: "error",
                title: "ERROR!",
                text: flash.error,
                showConfirmButton: true,
            });
        }
    }, [flash]);

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <SidebarProvider>
                <AppSidebar auth={auth} />
                <SidebarInset className="min-w-0">
                    <header className="flex h-16 shrink-0 items-center justify-between px-4">
                        <div className="flex items-center gap-2">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <NavBreadcrumb />
                        </div>

                        <div>
                            <ThemeToggle />
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </ThemeProvider>
    );
}
