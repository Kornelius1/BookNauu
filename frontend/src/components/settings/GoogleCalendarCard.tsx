import { useCallback, useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    Loader2,
    Link2,
    Unlink,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import {
    googleCalendarService,
    type GoogleCalendarStatusResponse,
} from "@/services/googleCalendarService";

type Props = {
    onStatusChange?: (
        status: GoogleCalendarStatusResponse
    ) => void;
};

export function GoogleCalendarCard({
                                       onStatusChange,
                                   }: Props) {
    const [status, setStatus] =
        useState<GoogleCalendarStatusResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [disconnecting, setDisconnecting] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const loadStatus = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const result =
                await googleCalendarService.getStatus();

            setStatus(result);
            onStatusChange?.(result);
        } catch (err) {
            console.error(
                "Failed to load Google Calendar status:",
                err
            );

            setError(
                "Gagal mengambil status Google Calendar."
            );
        } finally {
            setLoading(false);
        }
    }, [onStatusChange]);

    useEffect(() => {
        loadStatus();
    }, [loadStatus]);

    const handleConnect = () => {
        window.location.href =
            googleCalendarService.getConnectUrl();
    };

    const handleDisconnect = async () => {
        const confirmed = window.confirm(
            "Putuskan koneksi Google Calendar?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setDisconnecting(true);
            setError(null);

            await googleCalendarService.disconnect();

            const updatedStatus =
                await googleCalendarService.getStatus();

            setStatus(updatedStatus);
            onStatusChange?.(updatedStatus);
        } catch (err) {
            console.error(
                "Failed to disconnect Google Calendar:",
                err
            );

            setError(
                "Gagal memutuskan koneksi Google Calendar."
            );
        } finally {
            setDisconnecting(false);
        }
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-background">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <CardTitle>
                                Google Calendar
                            </CardTitle>

                            <CardDescription>
                                Kelola koneksi Google Calendar untuk
                                reservation business Anda.
                            </CardDescription>
                        </div>
                    </div>

                    {!loading && status?.connected && (
                        <div className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
                            <CheckCircle2 className="h-4 w-4" />

                            <span>Connected</span>
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardContent>
                {loading ? (
                    <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />

                        Memuat status Google Calendar...
                    </div>
                ) : error ? (
                    <div className="space-y-3">
                        <p className="text-sm text-destructive">
                            {error}
                        </p>

                        <Button
                            variant="outline"
                            onClick={loadStatus}
                        >
                            Coba lagi
                        </Button>
                    </div>
                ) : status?.connected ? (
                    <ConnectedState
                        status={status}
                        disconnecting={disconnecting}
                        onDisconnect={handleDisconnect}
                    />
                ) : (
                    <DisconnectedState
                        onConnect={handleConnect}
                    />
                )}
            </CardContent>
        </Card>
    );
}

type ConnectedStateProps = {
    status: GoogleCalendarStatusResponse;
    disconnecting: boolean;
    onDisconnect: () => void;
};

function ConnectedState({
                            status,
                            disconnecting,
                            onDisconnect,
                        }: ConnectedStateProps) {
    return (
        <div className="space-y-5">
            <div className="space-y-4">
                <div>
                    <p className="text-sm font-medium">
                        Google Account
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                        {status.googleAccountEmail ?? "-"}
                    </p>
                </div>

                <div>
                    <p className="text-sm font-medium">
                        Calendar
                    </p>

                    <p className="mt-1 break-all text-sm text-muted-foreground">
                        BookNauu Reservations
                    </p>
                </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between gap-4">
                <div>
                    <p className="text-sm font-medium">
                        Google Calendar terhubung
                    </p>

                    <p className="text-sm text-muted-foreground">
                        Reservation yang dikonfirmasi akan
                        dikelola otomatis di kalender ini.
                    </p>
                </div>

                <Button
                    variant="outline"
                    onClick={onDisconnect}
                    disabled={disconnecting}
                >
                    {disconnecting ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Disconnecting...
                        </>
                    ) : (
                        <>
                            <Unlink className="mr-2 h-4 w-4" />
                            Disconnect
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
}

type DisconnectedStateProps = {
    onConnect: () => void;
};

function DisconnectedState({
                               onConnect,
                           }: DisconnectedStateProps) {
    return (
        <div className="space-y-5">
            <div>
                <p className="text-sm font-medium">
                    Belum terhubung
                </p>

                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                    Hubungkan Google Calendar agar reservation
                    yang dikonfirmasi dapat otomatis masuk ke
                    kalender business Anda.
                </p>
            </div>

            <Button onClick={onConnect}>
                <Link2 className="mr-2 h-4 w-4" />
                Connect Google Calendar
            </Button>
        </div>
    );
}