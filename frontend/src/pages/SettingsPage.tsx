import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "../api/axios";

interface GoogleCalendarStatusResponse {
    connected: boolean;
    googleAccountEmail: string | null;
    calendarId: string | null;
}

interface GoogleCalendarConnectResponse {
    authorizationUrl: string;
}

export default function SettingsPage() {

    const [googleCalendar, setGoogleCalendar] =
        useState<GoogleCalendarStatusResponse | null>(null);

    const [loading, setLoading] = useState(true);
    const [connecting, setConnecting] = useState(false);
    const [disconnecting, setDisconnecting] = useState(false);


    const fetchGoogleCalendarStatus = async () => {

        try {

            const response =
                await axiosInstance.get<GoogleCalendarStatusResponse>(
                    "/v1/integrations/google/calendar/status"
                );

            setGoogleCalendar(response.data);

        } catch (error) {

            console.error(
                "Failed to fetch Google Calendar status",
                error
            );

        } finally {

            setLoading(false);
        }
    };


    useEffect(() => {

        fetchGoogleCalendarStatus();

    }, []);


    const handleConnect = async () => {

        try {

            setConnecting(true);

            const response =
                await axiosInstance.get<GoogleCalendarConnectResponse>(
                    "/v1/integrations/google/calendar/connect"
                );

            window.location.href =
                response.data.authorizationUrl;

        } catch (error) {

            console.error(
                "Failed to connect Google Calendar",
                error
            );

            setConnecting(false);
        }
    };


    const handleDisconnect = async () => {

        try {

            setDisconnecting(true);

            await axiosInstance.delete(
                "/v1/integrations/google/calendar/disconnect"
            );

            setGoogleCalendar({
                connected: false,
                googleAccountEmail: null,
                calendarId: null,
            });

        } catch (error) {

            console.error(
                "Failed to disconnect Google Calendar",
                error
            );

        } finally {

            setDisconnecting(false);
        }
    };


    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Settings
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage your business settings and integrations.
                    </p>
                </div>

                <div className="rounded-xl border p-6">
                    Loading...
                </div>
            </div>
        );
    }


    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-semibold">
                    Settings
                </h1>

                <p className="text-sm text-muted-foreground">
                    Manage your business settings and integrations.
                </p>
            </div>


            {/* Google Calendar */}

            <div className="rounded-xl border bg-card">

                <div className="flex items-center justify-between border-b p-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <CalendarDays className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Google Calendar
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Automatically sync reservations
                                to your business calendar.
                            </p>
                        </div>

                    </div>

                </div>


                <div className="p-6">

                    {googleCalendar?.connected ? (

                        <div className="space-y-5">

                            {/* Connected status */}

                            <div className="flex items-center gap-2">

                                <CheckCircle2 className="h-5 w-5 text-green-600" />

                                <span className="font-medium">
                                    Connected
                                </span>

                            </div>


                            {/* Google account */}

                            <div>

                                <p className="text-sm text-muted-foreground">
                                    Google Account
                                </p>

                                <p className="mt-1 font-medium">
                                    {googleCalendar.googleAccountEmail}
                                </p>

                            </div>


                            <Button
                                variant="destructive"
                                onClick={handleDisconnect}
                                disabled={disconnecting}
                            >
                                {disconnecting
                                    ? "Disconnecting..."
                                    : "Disconnect"
                                }
                            </Button>

                        </div>

                    ) : (

                        <div className="space-y-5">

                            <div className="flex items-center gap-2">

                                <XCircle className="h-5 w-5 text-muted-foreground" />

                                <span className="font-medium">
                                    Not connected
                                </span>

                            </div>


                            <p className="max-w-xl text-sm text-muted-foreground">
                                Connect Google Calendar so reservations
                                are automatically added to your
                                business calendar.
                            </p>


                            <Button
                                onClick={handleConnect}
                                disabled={connecting}
                            >
                                {connecting
                                    ? "Connecting..."
                                    : "Connect Google Calendar"
                                }
                            </Button>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}