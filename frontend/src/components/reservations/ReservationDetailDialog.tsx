import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Reservation {
    id: number;
    reservationDate: string;
    startTime: string;
    endTime: string;

    customerId: number;
    customerName: string;

    resourceId: number;
    resourceName: string;

    resourceTypeId: number;
    resourceTypeName: string;

    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

    note: string | null;

    createdAt: string;
    updatedAt: string;
}

interface ReservationDetailDialogProps {
    reservation: Reservation | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const statusVariant = (
    status: Reservation["status"]
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
    return new Date(`${date}T00:00:00`).toLocaleDateString(
        "id-ID",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );
};

const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
    }).format(value);
};

export function ReservationDetailDialog({
                                            reservation,
                                            open,
                                            onOpenChange,
                                        }: ReservationDetailDialogProps) {
    if (!reservation) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <div className="flex items-center justify-between gap-4 pr-6">
                        <div>
                            <DialogTitle>
                                Reservation #{reservation.id}
                            </DialogTitle>

                            <p className="text-sm text-muted-foreground mt-1">
                                Reservation details
                            </p>
                        </div>

                        <Badge variant={statusVariant(reservation.status)}>
                            {reservation.status}
                        </Badge>
                    </div>
                </DialogHeader>

                <ScrollArea className="max-h-[70vh] pr-4">
                    <div className="space-y-6">

                        {/* Reservation */}
                        <section>
                            <h3 className="text-sm font-semibold mb-3">
                                Reservation
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    label="Date"
                                    value={formatDate(
                                        reservation.reservationDate
                                    )}
                                />

                                <DetailItem
                                    label="Time"
                                    value={`${reservation.startTime} - ${reservation.endTime}`}
                                />

                                <DetailItem
                                    label="Total Price"
                                    value={formatCurrency(
                                        reservation.totalPrice
                                    )}
                                />

                                <DetailItem
                                    label="Status"
                                    value={reservation.status}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Customer */}
                        <section>
                            <h3 className="text-sm font-semibold mb-3">
                                Customer
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    label="Customer"
                                    value={reservation.customerName}
                                />

                                <DetailItem
                                    label="Customer ID"
                                    value={`#${reservation.customerId}`}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Resource */}
                        <section>
                            <h3 className="text-sm font-semibold mb-3">
                                Resource
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                <DetailItem
                                    label="Resource"
                                    value={reservation.resourceName}
                                />

                                <DetailItem
                                    label="Resource Type"
                                    value={reservation.resourceTypeName}
                                />
                            </div>
                        </section>

                        <Separator />

                        {/* Note */}
                        <section>
                            <h3 className="text-sm font-semibold mb-3">
                                Note
                            </h3>

                            <div className="rounded-lg border bg-muted/30 p-4">
                                {reservation.note ? (
                                    <p className="text-sm whitespace-pre-wrap">
                                        {reservation.note}
                                    </p>
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">
                                        No note provided.
                                    </p>
                                )}
                            </div>
                        </section>

                        <Separator />

                        {/* Metadata */}
                        <section>
                            <h3 className="text-sm font-semibold mb-3">
                                Information
                            </h3>

                            <div className="grid grid-cols-1 gap-4">
                                <DetailItem
                                    label="Created At"
                                    value={formatDateTime(
                                        reservation.createdAt
                                    )}
                                />

                                <DetailItem
                                    label="Updated At"
                                    value={formatDateTime(
                                        reservation.updatedAt
                                    )}
                                />
                            </div>
                        </section>

                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
}

interface DetailItemProps {
    label: string;
    value: string;
}

function DetailItem({
                        label,
                        value,
                    }: DetailItemProps) {
    return (
        <div className="space-y-1">
            <p className="text-xs text-muted-foreground">
                {label}
            </p>

            <p className="text-sm font-medium">
                {value}
            </p>
        </div>
    );
}