"use client";

import { Command } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/Components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { usePage } from "@inertiajs/react";
import { APP_URL } from "@/constants/app";

export function AppSidebar({ auth, ...props }) {
    // destructure "settings" dari props page
    const { settings } = usePage().props;

    return (
        <Sidebar variant="inset" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/">
                                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                    {settings?.app_logo ? (
                                        <img
                                            src={
                                                APP_URL +
                                                "/uploads/settings/logo/" +
                                                settings.app_logo
                                            }
                                            alt="App Logo"
                                            className="h-full w-full object-contain rounded-lg"
                                        />
                                    ) : (
                                        <Command className="size-4" />
                                    )}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {settings?.app_name ||
                                            import.meta.env.VITE_APP_NAME}
                                    </span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain />
            </SidebarContent>
            <SidebarFooter>
                <NavUser auth={auth} />
            </SidebarFooter>
        </Sidebar>
    );
}
