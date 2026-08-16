import { useEffect, useState } from "react";
import {
    CalendarDays,
    CheckCircle2,
    XCircle,
    Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import axiosInstance from "../api/axios";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

interface GoogleCalendarStatusResponse {
    connected: boolean;
    googleAccountEmail: string | null;
    calendarId: string | null;
}

interface GoogleCalendarConnectResponse {
    authorizationUrl: string;
}

interface OperatingHours {
    id: number;
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    closed: boolean;
}

interface UpdateOperatingHoursRequest {
    dayOfWeek: string;
    openTime: string | null;
    closeTime: string | null;
    closed: boolean;
}

const DAYS = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
];

const DAY_LABELS: Record<string, string> = {
    MONDAY: "Monday",
    TUESDAY: "Tuesday",
    WEDNESDAY: "Wednesday",
    THURSDAY: "Thursday",
    FRIDAY: "Friday",
    SATURDAY: "Saturday",
    SUNDAY: "Sunday",
};

export default function SettingsPage() {

    const [googleCalendar, setGoogleCalendar] =
        useState<GoogleCalendarStatusResponse | null>(null);

    const [operatingHours, setOperatingHours] =
        useState<OperatingHours[]>([]);

    const [loading, setLoading] = useState(true);
    const [operatingHoursLoading, setOperatingHoursLoading] =
        useState(true);

    const [savingOperatingHours, setSavingOperatingHours] =
        useState(false);

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


    const fetchOperatingHours = async () => {

        try {

            const response =
                await axiosInstance.get<ApiResponse<OperatingHours[]>>(
                    "/v1/business/operating-hours"
                );

            setOperatingHours(response.data.data);

        } catch (error) {

            console.error(
                "Failed to fetch operating hours",
                error
            );

        } finally {

            setOperatingHoursLoading(false);
        }
    };


    useEffect(() => {

        fetchGoogleCalendarStatus();
        fetchOperatingHours();

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


    const handleOperatingHoursChange = (
        dayOfWeek: string,
        field: keyof OperatingHours,
        value: string | boolean
    ) => {

        setOperatingHours((current) =>
            current.map((day) => {

                if (day.dayOfWeek !== dayOfWeek) {
                    return day;
                }

                if (field === "closed" && value === true) {
                    return {
                        ...day,
                        closed: true,
                        openTime: null,
                        closeTime: null,
                    };
                }

                return {
                    ...day,
                    [field]: value,
                };
            })
        );
    };


    const handleSaveOperatingHours = async () => {

        try {

            setSavingOperatingHours(true);

            const requests: UpdateOperatingHoursRequest[] =
                operatingHours.map((day) => ({
                    dayOfWeek: day.dayOfWeek,
                    openTime: day.closed
                        ? null
                        : day.openTime,
                    closeTime: day.closed
                        ? null
                        : day.closeTime,
                    closed: day.closed,
                }));

            const responses = await Promise.all(
                requests.map((request) =>
                    axiosInstance.put<ApiResponse<OperatingHours>>(
                        "/v1/business/operating-hours",
                        request
                    )
                )
            );

            setOperatingHours(
                responses.map((response) => response.data.data)
            );

        } catch (error) {

            console.error(
                "Failed to save operating hours",
                error
            );

        } finally {

            setSavingOperatingHours(false);
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


            {/* Operating Hours */}

            <div className="rounded-xl border bg-card">

                <div className="flex items-center justify-between border-b p-6">

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                            <Clock3 className="h-5 w-5" />
                        </div>

                        <div>
                            <h2 className="font-semibold">
                                Operating Hours
                            </h2>

                            <p className="text-sm text-muted-foreground">
                                Set the hours when your business is
                                available for reservations.
                            </p>
                        </div>

                    </div>

                </div>


                <div className="p-6">

                    {operatingHoursLoading ? (

                        <div className="text-sm text-muted-foreground">
                            Loading operating hours...
                        </div>

                    ) : (

                        <div className="space-y-4">

                            {DAYS.map((dayOfWeek) => {

                                const day =
                                    operatingHours.find(
                                        (item) =>
                                            item.dayOfWeek === dayOfWeek
                                    );

                                if (!day) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={dayOfWeek}
                                        className="flex items-center gap-4"
                                    >

                                        <div className="w-28 font-medium">
                                            {DAY_LABELS[dayOfWeek]}
                                        </div>


                                        <label className="flex items-center gap-2">

                                            <input
                                                type="checkbox"
                                                checked={!day.closed}
                                                onChange={(event) =>
                                                    handleOperatingHoursChange(
                                                        dayOfWeek,
                                                        "closed",
                                                        !event.target.checked
                                                    )
                                                }
                                                className="h-4 w-4"
                                            />

                                            <span className="text-sm">
                                                Open
                                            </span>

                                        </label>


                                        {!day.closed ? (

                                            <div className="flex items-center gap-2">

                                                <input
                                                    type="time"
                                                    value={
                                                        day.openTime?.slice(
                                                            0,
                                                            5
                                                        ) ?? ""
                                                    }
                                                    onChange={(event) =>
                                                        handleOperatingHoursChange(
                                                            dayOfWeek,
                                                            "openTime",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="rounded-md border bg-background px-3 py-2 text-sm"
                                                />

                                                <span className="text-sm text-muted-foreground">
                                                    —
                                                </span>

                                                <input
                                                    type="time"
                                                    value={
                                                        day.closeTime?.slice(
                                                            0,
                                                            5
                                                        ) ?? ""
                                                    }
                                                    onChange={(event) =>
                                                        handleOperatingHoursChange(
                                                            dayOfWeek,
                                                            "closeTime",
                                                            event.target.value
                                                        )
                                                    }
                                                    className="rounded-md border bg-background px-3 py-2 text-sm"
                                                />

                                            </div>

                                        ) : (

                                            <span className="text-sm text-muted-foreground">
                                                Closed
                                            </span>

                                        )}

                                    </div>
                                );
                            })}


                            <div className="flex justify-end border-t pt-4">

                                <Button
                                    onClick={
                                        handleSaveOperatingHours
                                    }
                                    disabled={
                                        savingOperatingHours
                                    }
                                >
                                    {savingOperatingHours
                                        ? "Saving..."
                                        : "Save Changes"
                                    }
                                </Button>

                            </div>

                        </div>

                    )}

                </div>

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

                            <div className="flex items-center gap-2">

                                <CheckCircle2 className="h-5 w-5 text-green-600" />

                                <span className="font-medium">
                                    Connected
                                </span>

                            </div>


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