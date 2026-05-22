"use client";

import { ChevronRight } from "lucide-react";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/Components/ui/sidebar";
import { Link, usePage } from "@inertiajs/react";

// import menuConfig
import {
    menuItems,
    getFilteredMenuItems,
    getFilteredDropdown,
} from "./menuConfig";

export function NavMain() {
    const filteredMenuItems = getFilteredMenuItems();
    const { url } = usePage();

    return (
        <SidebarGroup>
            <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
            <SidebarMenu>
                {filteredMenuItems.map((item) => {
                    // Filter dropdown items
                    const filteredDropdown = getFilteredDropdown(item.dropdown);

                    // Hide dropdown if it has no items
                    if (item.dropdown && filteredDropdown.length === 0) {
                        return null;
                    }

                    const isDropdownActive =
                        item.dropdown &&
                        item.dropdown.some((subItem) =>
                            url.startsWith(subItem.href),
                        );

                    return (
                        <Collapsible
                            key={item.name}
                            asChild
                            defaultOpen={isDropdownActive}
                            className="group/collapsible"
                        >
                            <SidebarMenuItem>
                                {filteredDropdown.length > 0 ? (
                                    <>
                                        <CollapsibleTrigger asChild>
                                            <SidebarMenuButton
                                                tooltip={item.name}
                                                isActive={isDropdownActive}
                                            >
                                                {item.icon && <item.icon />}
                                                <span>{item.name}</span>
                                                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                            </SidebarMenuButton>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <SidebarMenuSub>
                                                {filteredDropdown.map(
                                                    (subItem) => (
                                                        <SidebarMenuSubItem
                                                            key={subItem.name}
                                                        >
                                                            <SidebarMenuSubButton
                                                                asChild
                                                                isActive={url.startsWith(
                                                                    subItem.href,
                                                                )}
                                                            >
                                                                <Link
                                                                    href={
                                                                        subItem.href
                                                                    }
                                                                >
                                                                    <span>
                                                                        {
                                                                            subItem.name
                                                                        }
                                                                    </span>
                                                                </Link>
                                                            </SidebarMenuSubButton>
                                                        </SidebarMenuSubItem>
                                                    ),
                                                )}
                                            </SidebarMenuSub>
                                        </CollapsibleContent>
                                    </>
                                ) : (
                                    <SidebarMenuButton
                                        asChild
                                        isActive={url.startsWith(item.href)}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.name}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                )}
                            </SidebarMenuItem>
                        </Collapsible>
                    );
                })}
            </SidebarMenu>
        </SidebarGroup>
    );
}
