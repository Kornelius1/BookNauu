import { Bell, LogOut, Settings, ChevronDown, User } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";

export function AppHeader() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate("/login", { replace: true });
    }

    // Mengambil inisial dari fullName, jika kosong gunakan "U" (User)
    const initial = user?.fullName?.charAt(0).toUpperCase() || "U";

    return (
        <header className="flex h-16 items-center justify-between border-b bg-background px-6">
            {/* Left */}
            <div className="flex items-center gap-3">
                <SidebarTrigger />

                <div>
                    <h1 className="text-lg font-semibold">
                        Dashboard
                    </h1>

                    <p className="text-muted-foreground text-sm">
                        BookNauu
                    </p>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                >
                    <Bell className="h-5 w-5" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger
                        className="flex items-center gap-3 rounded-xl border px-3 py-1.5 transition-all hover:bg-accent hover:shadow-sm"
                    >
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
                            {initial}
                        </div>

                        <div className="hidden text-left md:block">
                            <p className="text-sm font-medium">
                                {user?.fullName}
                            </p>

                            <p className="text-muted-foreground text-xs">
                                {user?.email}
                            </p>
                        </div>

                        <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[popup-open]:rotate-180" />
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                        align="end"
                        className="w-64"
                    >

                        <DropdownMenuSeparator />

                        <DropdownMenuItem disabled>
                            <User className="mr-2 h-4 w-4" />
                            Profile
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => navigate("/settings")}
                            className="flex items-center"
                        >
                            <Settings className="mr-2 h-4 w-4 shrink-0" />
                            <span>Settings</span>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                            onClick={handleLogout}
                            className="text-red-600 focus:text-red-600"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </DropdownMenuItem>

                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}