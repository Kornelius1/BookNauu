import { useEffect, useState } from "react";
import {
    CalendarDays,
    CircleDollarSign,
    Users,
    Wallet,
    RefreshCw,
    Circle,
} from "lucide-react";

import { dashboardService } from "@/services/dashboard.service";
import type {
    BusinessDashboardResponse,
} from "@/types/dashboard";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const Dashboard = () => {
    const [dashboard, setDashboard] =
        useState<BusinessDashboardResponse | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState<string | null>(null);

    const fetchDashboard = async () => {
        try {
            setLoading(true);
            setError(null);

            const data =
                await dashboardService.getDashboard();

            setDashboard(data);

        } catch (err) {

            console.error(
                "Failed to fetch dashboard:",
                err
            );

            setError(
                "Failed to load dashboard data."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="space-y-6">

                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-72" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({
                        length: 4,
                    }).map((_, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <Skeleton className="h-4 w-32" />
                            </CardHeader>

                            <CardContent>
                                <Skeleton className="h-8 w-36" />
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        );
    }

    /*
     * Error
     */
    if (error) {
        return (
            <div className="flex min-h-[400px] items-center justify-center">

                <div className="space-y-4 text-center">

                    <div>
                        <h2 className="text-lg font-semibold">
                            Unable to load dashboard
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            {error}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={fetchDashboard}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try again
                    </Button>

                </div>

            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const {
        summary,
        todayReservations,
        resourceAvailability,
        recentActivities,
    } = dashboard;

    /*
     * Summary cards
     */
    const summaryCards = [
        {
            title: "Reservation Value",
            value: `Rp ${summary.reservationValue.toLocaleString("id-ID")}`,
            icon: Wallet,
        },
        {
            title: "Revenue",
            value: `Rp ${summary.revenue.toLocaleString("id-ID")}`,
            icon: CircleDollarSign,
        },
        {
            title: "Today",
            value: summary.todayReservations.toLocaleString("id-ID"),
            icon: CalendarDays,
        },
        {
            title: "Customers",
            value: summary.totalCustomers.toLocaleString("id-ID"),
            icon: Users,
        },
    ];

    /*
     * Status badge
     */
    const getStatusClass = (status: string) => {
        switch (status) {

            case "COMPLETED":
                return "bg-green-100 text-green-700";

            case "CONFIRMED":
                return "bg-blue-100 text-blue-700";

            case "PENDING":
                return "bg-yellow-100 text-yellow-700";

            case "CANCELLED":
                return "bg-red-100 text-red-700";

            default:
                return "bg-muted text-muted-foreground";
        }
    };

    return (
        <div className="space-y-6">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Business Dashboard
                </h1>

                <p className="text-sm text-muted-foreground">
                    Monitor your business operations.
                </p>
            </div>


            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                {summaryCards.map((card) => {

                    const Icon = card.icon;

                    return (
                        <Card key={card.title}>

                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">

                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {card.title}
                                </CardTitle>

                                <Icon className="h-5 w-5 text-muted-foreground" />

                            </CardHeader>

                            <CardContent>

                                <div className="text-2xl font-bold">
                                    {card.value}
                                </div>

                            </CardContent>

                        </Card>
                    );
                })}

            </div>


            {/* Today's Reservations */}
            <Card>

                <CardHeader>
                    <CardTitle>
                        Today's Reservations
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    {todayReservations.length === 0 ? (

                        <p className="py-6 text-center text-sm text-muted-foreground">
                            No reservations today.
                        </p>

                    ) : (

                        <div className="space-y-3">

                            {todayReservations.map(
                                (reservation) => (

                                    <div
                                        key={reservation.id}
                                        className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                                    >

                                        <div className="flex items-center gap-4">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">

                                                <CalendarDays className="h-5 w-5" />

                                            </div>

                                            <div>

                                                <p className="font-medium">
                                                    {reservation.customerName}
                                                </p>

                                                <p className="text-sm text-muted-foreground">
                                                    {reservation.startTime.slice(
                                                        0,
                                                        5
                                                    )}
                                                    {" - "}
                                                    {reservation.endTime.slice(
                                                        0,
                                                        5
                                                    )}
                                                    {" · "}
                                                    {reservation.resourceName}
                                                </p>

                                            </div>

                                        </div>


                                        <div className="flex items-center justify-between gap-4 md:justify-end">

                                            <span className="font-medium">
                                                Rp{" "}
                                                {reservation.totalPrice.toLocaleString(
                                                    "id-ID"
                                                )}
                                            </span>

                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                    reservation.status
                                                )}`}
                                            >
                                                {reservation.status}
                                            </span>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </CardContent>

            </Card>


            {/* Resource Availability */}
            <Card>

                <CardHeader>
                    <CardTitle>
                        Resource Availability
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                        {resourceAvailability.map(
                            (resource) => (

                                <div
                                    key={resource.resourceId}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >

                                    <div>
                                        <p className="font-medium">
                                            {resource.resourceName}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {resource.status}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">

                                        <Circle
                                            className={`h-3 w-3 fill-current ${
                                                resource.available
                                                    ? "text-green-500"
                                                    : "text-red-500"
                                            }`}
                                        />

                                        <span className="text-sm font-medium">
                                            {resource.available
                                                ? "Available"
                                                : "Unavailable"}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </CardContent>

            </Card>


            {/* Recent Activities */}
            <Card>

                <CardHeader>
                    <CardTitle>
                        Recent Activities
                    </CardTitle>
                </CardHeader>

                <CardContent>

                    <div className="space-y-4">

                        {recentActivities.map(
                            (activity) => (

                                <div
                                    key={activity.reservationId}
                                    className="flex flex-col gap-2 border-b pb-4 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
                                >

                                    <div>

                                        <p className="font-medium">
                                            {activity.customerName}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {activity.resourceName}
                                            {" · "}
                                            Reservation #
                                            {activity.reservationId}
                                        </p>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                                                activity.status
                                            )}`}
                                        >
                                            {activity.status}
                                        </span>

                                        <span className="text-sm font-medium">
                                            Rp{" "}
                                            {activity.totalPrice.toLocaleString(
                                                "id-ID"
                                            )}
                                        </span>

                                    </div>

                                </div>

                            )
                        )}

                    </div>

                </CardContent>

            </Card>

        </div>
    );
};

export default Dashboard;