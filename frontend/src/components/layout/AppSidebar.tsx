import {
    CalendarDays,
    LayoutDashboard,
    Boxes,
    Tags,
    LogOut,
    Settings,
    UsersRound,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

const menuItems = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Resource",
        url: "/resources",
        icon: Boxes,
    },
    {
        title:"Resource Type",
        url: "/resource-types",
        icon: Tags,
    },
    {
        title: "Reservations",
        url: "/reservations",
        icon: CalendarDays,
    },
    {
        title: "Membership",
        url: "/membership",
        icon: UsersRound,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];

export function AppSidebar() {
    const location = useLocation();

    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div className="flex h-16 items-center px-4">
                    <div>
                        <h2 className="text-lg font-bold">Smart Reservation</h2>
                        <p className="text-muted-foreground text-sm">
                            Management System
                        </p>
                    </div>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>MAIN MENU</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        isActive={location.pathname === item.url}
                                        render={<NavLink to={item.url} />}
                                    >
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.title}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t">
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton>
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}