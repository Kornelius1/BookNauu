import { useEffect, useState } from "react";
import {
    CalendarDays,
    Eye,
    MoreHorizontal,
    Pencil,
    Plus,
    RefreshCw,
    Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import reservationService from "../services/reservationService";
import { ReservationDetailDialog } from "@/components/reservations/ReservationDetailDialog";
import { ReservationEditDialog } from "@/components/reservations/ReservationEditDialog";
import { ReservationStatusDialog } from "@/components/reservations/ReservationStatusDialog";
import { CreateReservationDialog } from "@/components/reservations/CreateReservationDialog";

import type {
    CreateReservationRequest,
    ReservationResponse,
    ReservationStatus,
} from "../../types/reservation";


export default function Reservation() {
    const [reservations, setReservations] = useState<
        ReservationResponse[]
    >([]);

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchReservations = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const data = await reservationService.getAll();

            setReservations(data);
        } catch (err) {
            console.error("Failed to fetch reservations:", err);

            setError(
                "Failed to load reservations. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, []);

    const getStatusVariant = (
        status: ReservationStatus
    ) => {
        switch (status) {
            case "CONFIRMED":
                return "default";

            case "CANCELLED":
                return "destructive";

            case "COMPLETED":
                return "secondary";

            case "PENDING":
            default:
                return "outline";
        }
    };

    const formatDate = (date: string) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(`${date}T00:00:00`));
    };

    const formatTime = (time: string) => {
        return time.substring(0, 5);
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(value);
    };

    const [selectedReservation, setSelectedReservation] =
        useState<ReservationResponse | null>(null);

    const [detailDialogOpen, setDetailDialogOpen] =
        useState(false);

    const [editDialogOpen, setEditDialogOpen] =
        useState(false);

    const [statusDialogOpen, setStatusDialogOpen] =
        useState(false);

    const [createDialogOpen, setCreateDialogOpen] =
        useState(false);

    const handleView = (reservation: ReservationResponse) => {
        setSelectedReservation(reservation);
        setDetailDialogOpen(true);
    };

    const handleEdit = (reservation: ReservationResponse) => {
        setSelectedReservation(reservation);
        setEditDialogOpen(true);
    };

    const handleChangeStatus = (reservation: ReservationResponse) => {
        setSelectedReservation(reservation);
        setStatusDialogOpen(true);
    };

    const handleDelete = async (
        reservation: ReservationResponse
    ) => {
        try {
            await reservationService.delete(
                reservation.id
            );

            await fetchReservations();
        } catch (err) {
            console.error(
                "Failed to delete reservation:",
                err
            );
        }
    };

    const handleEditSubmit = async (
        id: number,
        data: {
            resourceId: number;
            reservationDate: string;
            startTime: string;
            endTime: string;
        }
    ) => {
        try {
            await reservationService.update(id, data);

            await fetchReservations();
        } catch (err) {
            console.error(
                "Failed to update reservation:",
                err
            );
        }
    };

    const handleStatusSubmit = async (
        id: number,
        status: ReservationStatus
    ) => {
        try {
            await reservationService.updateStatus(
                id,
                {
                    status
                }
            );

            await fetchReservations();
        } catch (err) {
            console.error(
                "Failed to update reservation status:",
                err
            );
            throw err
        }
    };

    const handleCreateSubmit = async (
        data: CreateReservationRequest
    ) => {
        try {
            await reservationService.create(data);

            await fetchReservations();
        } catch (err) {
            console.error(
                "Failed to create reservation:",
                err
            );

            throw err;
        }
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-5 w-5" />

                        <h1 className="text-2xl font-semibold tracking-tight">
                            Reservations
                        </h1>
                    </div>

                    <p className="text-sm text-muted-foreground">
                        Manage and monitor all reservations for your
                        business.
                    </p>
                </div>

                <Button
                    onClick={() => setCreateDialogOpen(true)}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Reservation
                </Button>
            </div>

            {/* Main Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>All Reservations</CardTitle>

                            <CardDescription>
                                {reservations.length}{" "}
                                {reservations.length === 1
                                    ? "reservation"
                                    : "reservations"}
                            </CardDescription>
                        </div>

                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchReservations}
                            disabled={isLoading}
                        >
                            <RefreshCw
                                className={`h-4 w-4 ${
                                    isLoading
                                        ? "animate-spin"
                                        : ""
                                }`}
                            />
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    {/* Loading */}
                    {isLoading && (
                        <div className="flex min-h-[300px] items-center justify-center">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <RefreshCw className="h-4 w-4 animate-spin" />
                                Loading reservations...
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {!isLoading && error && (
                        <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                            <p className="text-sm text-destructive">
                                {error}
                            </p>

                            <Button
                                variant="outline"
                                onClick={fetchReservations}
                            >
                                Try Again
                            </Button>
                        </div>
                    )}

                    {/* Empty */}
                    {!isLoading &&
                        !error &&
                        reservations.length === 0 && (
                            <div className="flex min-h-[300px] flex-col items-center justify-center gap-4">
                                <CalendarDays className="h-10 w-10 text-muted-foreground" />

                                <div className="text-center">
                                    <h3 className="font-medium">
                                        No reservations yet
                                    </h3>

                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Create your first reservation to
                                        get started.
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setCreateDialogOpen(true)}
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Reservation
                                </Button>
                            </div>
                        )}

                    {/* Table */}
                    {!isLoading &&
                        !error &&
                        reservations.length > 0 && (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                    <tr className="border-b text-left">
                                        <th className="h-12 px-4 font-medium">
                                            Date
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Time
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Customer
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Resource
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Resource Type
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Total
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Status
                                        </th>

                                        <th className="h-12 px-4 font-medium">
                                            Note
                                        </th>

                                        <th className="h-12 w-[60px] px-4" />
                                    </tr>
                                    </thead>

                                    <tbody>
                                    {reservations.map(
                                        (reservation) => (
                                            <tr
                                                key={reservation.id}
                                                className="border-b transition-colors hover:bg-muted/50"
                                            >
                                                {/* Date */}
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {formatDate(
                                                        reservation.reservationDate
                                                    )}
                                                </td>

                                                {/* Time */}
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {formatTime(
                                                        reservation.startTime
                                                    )}{" "}
                                                    -{" "}
                                                    {formatTime(
                                                        reservation.endTime
                                                    )}
                                                </td>

                                                {/* Customer */}
                                                <td className="px-4 py-4">
                                                    <div className="font-medium">
                                                        {
                                                            reservation.customerName
                                                        }
                                                    </div>
                                                </td>

                                                {/* Resource */}
                                                <td className="px-4 py-4">
                                                    {
                                                        reservation.resourceName
                                                    }
                                                </td>

                                                {/* Resource Type */}
                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {
                                                        reservation.resourceTypeName
                                                    }
                                                </td>

                                                {/* Total */}
                                                <td className="px-4 py-4 whitespace-nowrap">
                                                    {formatCurrency(
                                                        reservation.totalPrice
                                                    )}
                                                </td>

                                                {/* Status */}
                                                <td className="px-4 py-4">
                                                    <Badge
                                                        variant={getStatusVariant(
                                                            reservation.status
                                                        )}
                                                    >
                                                        {reservation.status}
                                                    </Badge>
                                                </td>

                                                <td className="px-4 py-4 text-muted-foreground">
                                                    {
                                                        reservation.note || "-"
                                                    }
                                                </td>

                                                {/* Actions */}
                                                <td className="px-4 py-4">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            className="inline-flex h-9 w-9 items-center justify-center rounded-md hover:bg-muted"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />

                                                            <span className="sr-only">
            Open actions
        </span>
                                                        </DropdownMenuTrigger>

                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleView(reservation)
                                                                }
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                View Details
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleEdit(reservation)
                                                                }
                                                            >
                                                                <Pencil className="mr-2 h-4 w-4" />
                                                                Edit
                                                            </DropdownMenuItem>

                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    handleChangeStatus(reservation)
                                                                }
                                                            >
                                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                                Change Status
                                                            </DropdownMenuItem>

                                                            <DropdownMenuSeparator />

                                                            <DropdownMenuItem
                                                                variant="destructive"
                                                                onClick={() =>
                                                                    handleDelete(reservation)
                                                                }
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        )
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                </CardContent>
                <ReservationDetailDialog
                    reservation={selectedReservation}
                    open={detailDialogOpen}
                    onOpenChange={setDetailDialogOpen}
                />

                <ReservationEditDialog
                    reservation={selectedReservation}
                    open={editDialogOpen}
                    onOpenChange={setEditDialogOpen}
                    onSubmit={handleEditSubmit}
                />

                <ReservationStatusDialog
                    reservation={selectedReservation}
                    open={statusDialogOpen}
                    onOpenChange={setStatusDialogOpen}
                    onSubmit={handleStatusSubmit}
                />

                <CreateReservationDialog
                    open={createDialogOpen}
                    onOpenChange={setCreateDialogOpen}
                    onSubmit={handleCreateSubmit}
                />
            </Card>
        </div>
    );
}