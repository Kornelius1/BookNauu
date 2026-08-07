import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

                <div className="flex items-center gap-3 rounded-lg border px-3 py-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                        {initial}
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-medium">
                            {user?.fullName || "Pengguna"}
                        </p>

                        <p className="text-muted-foreground text-xs">
                            {user?.email || "Memuat..."}
                        </p>
                    </div>
                </div>

                {/* Tombol Logout */}
                <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    className="flex items-center gap-2"
                >
                    <LogOut className="h-4 w-4" />
                    <span className="hidden sm:inline">Logout</span>
                </Button>
            </div>
        </header>
    );
}