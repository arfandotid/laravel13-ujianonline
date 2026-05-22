"use client";

import { ChevronsUpDown, Lock, LogOut, UserCog2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/Components/ui/sidebar";
import { Link } from "@inertiajs/react";
import { APP_URL } from "@/constants/app";

export function NavUser({ auth }) {
    const { isMobile } = useSidebar();

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="h-8 w-8 rounded-full">
                                <AvatarImage
                                    src={`${APP_URL}/uploads/avatars/${auth.user.avatar}`}
                                    alt={auth.user.name}
                                />
                                <AvatarFallback className="rounded-full">
                                    {auth.user.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {auth.user.name}
                                </span>
                                <span className="truncate text-xs">
                                    {auth.user.email}
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="h-8 w-8 rounded-full">
                                    <AvatarImage
                                        src={`${APP_URL}/uploads/avatars/${auth.user.avatar}`}
                                        alt={auth.user.name}
                                    />
                                    <AvatarFallback className="rounded-full">
                                        {auth.user.name.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">
                                        {auth.user.name}
                                    </span>
                                    <span className="truncate text-xs">
                                        {auth.user.email}
                                    </span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <Link href="/profile">
                            <DropdownMenuItem>
                                <UserCog2 />
                                Profile
                            </DropdownMenuItem>
                        </Link>
                        <Link href="/profile/password">
                            <DropdownMenuItem>
                                <Lock />
                                Change Password
                            </DropdownMenuItem>
                        </Link>
                        <Link
                            className="w-full"
                            as="button"
                            method="post"
                            href="/logout"
                        >
                            <DropdownMenuItem>
                                <LogOut />
                                Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
