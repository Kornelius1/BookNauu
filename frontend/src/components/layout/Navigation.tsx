import {
    CalendarDays,
    DoorOpen,
    LayoutDashboard,
    Settings,
    Users,
} from "lucide-react";

export const navigation = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Rooms",
        url: "/rooms",
        icon: DoorOpen,
    },
    {
        title: "Reservations",
        url: "/reservations",
        icon: CalendarDays,
    },
    {
        title: "Users",
        url: "/users",
        icon: Users,
    },
    {
        title: "Settings",
        url: "/settings",
        icon: Settings,
    },
];