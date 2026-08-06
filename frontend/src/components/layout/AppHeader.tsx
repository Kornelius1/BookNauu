import { Bell } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function AppHeader() {
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
                        Smart Reservation System
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
                        A
                    </div>

                    <div className="hidden md:block">
                        <p className="text-sm font-medium">
                            Administrator
                        </p>

                        <p className="text-muted-foreground text-xs">
                            admin@example.com
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}