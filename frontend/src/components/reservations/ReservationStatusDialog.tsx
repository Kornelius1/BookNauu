import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import type {
    ReservationResponse,
    ReservationStatus,
} from "../../types/reservation";

interface ReservationStatusDialogProps {
    reservation: ReservationResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        id: number,
        status: ReservationStatus
    ) => Promise<void>;
}

export function ReservationStatusDialog({
                                            reservation,
                                            open,
                                            onOpenChange,
                                            onSubmit,
                                        }: ReservationStatusDialogProps) {
    const [status, setStatus] =
        useState<ReservationStatus>("PENDING");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    useEffect(() => {
        if (reservation) {
            setStatus(reservation.status);
        }
    }, [reservation]);

    const handleSubmit = async () => {
        if (!reservation) {
            return;
        }

        try {
            setIsSubmitting(true);

            await onSubmit(
                reservation.id,
                status
            );

            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Change Reservation Status
                    </DialogTitle>

                    <DialogDescription>
                        Update the status of reservation #
                        {reservation?.id}.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label className="text-sm font-medium">
                        Status
                    </label>

                    <Select
                        value={status}
                        onValueChange={(value) =>
                            setStatus(
                                value as ReservationStatus
                            )
                        }
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="PENDING">
                                Pending
                            </SelectItem>

                            <SelectItem value="CONFIRMED">
                                Confirmed
                            </SelectItem>

                            <SelectItem value="CANCELLED">
                                Cancelled
                            </SelectItem>

                            <SelectItem value="COMPLETED">
                                Completed
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() =>
                            onOpenChange(false)
                        }
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>

                    <Button
                        onClick={handleSubmit}
                        disabled={
                            isSubmitting ||
                            status === reservation?.status
                        }
                    >
                        {isSubmitting
                            ? "Updating..."
                            : "Update Status"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}