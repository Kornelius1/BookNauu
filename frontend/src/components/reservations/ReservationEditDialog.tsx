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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { resourceService } from "../../services/resource.service";
import type { ResourceResponse } from "../../types/resource";
import type { ReservationResponse } from "../../types/reservation";

interface ReservationEditDialogProps {
    reservation: ReservationResponse | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        id: number,
        data: {
            resourceId: number;
            reservationDate: string;
            startTime: string;
            endTime: string;
        }
    ) => Promise<void>;
}

export function ReservationEditDialog({
                                          reservation,
                                          open,
                                          onOpenChange,
                                          onSubmit,
                                      }: ReservationEditDialogProps) {
    const [resourceId, setResourceId] = useState("");
    const [resources, setResources] = useState<ResourceResponse[]>([]);
    const [isLoadingResources, setIsLoadingResources] =
        useState(false);

    const [reservationDate, setReservationDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!reservation) {
            return;
        }

        setResourceId(
            String(reservation.resourceId)
        );

        setReservationDate(
            reservation.reservationDate
        );

        setStartTime(
            reservation.startTime.substring(0, 5)
        );

        setEndTime(
            reservation.endTime.substring(0, 5)
        );
    }, [reservation]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                setIsLoadingResources(true);

                const response =
                    await resourceService.getResources();

                setResources(response.data);
            } catch (error) {
                console.error(
                    "Failed to load resources:",
                    error
                );
            } finally {
                setIsLoadingResources(false);
            }
        };

        if (open) {
            fetchResources();
        }
    }, [open]);

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        if (!reservation) {
            return;
        }

        try {
            setIsSubmitting(true);

            await onSubmit(
                reservation.id,
                {
                    resourceId: Number(resourceId),
                    reservationDate,
                    startTime,
                    endTime,
                }
            );

            onOpenChange(false);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedResource =
        resources.find(
            (resource) =>
                String(resource.id) === resourceId
        );

    return (
        <Dialog
            open={open}
            onOpenChange={onOpenChange}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        Edit Reservation
                    </DialogTitle>

                    <DialogDescription>
                        Update the reservation details.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {/* Resource */}
                    <div className="space-y-2">
                        <Label htmlFor="resourceId">
                            Resource
                        </Label>

                        <Select
                            value={resourceId}
                            onValueChange={setResourceId}
                            disabled={
                                isLoadingResources ||
                                isSubmitting
                            }
                        >
                            <SelectTrigger id="resourceId">
                                <SelectValue
                                    placeholder={
                                        isLoadingResources
                                            ? "Loading resources..."
                                            : "Select a resource"
                                    }
                                >
                                    {selectedResource?.name}
                                </SelectValue>
                            </SelectTrigger>

                            <SelectContent>
                                {resources.map(
                                    (resource) => (
                                        <SelectItem
                                            key={resource.id}
                                            value={String(
                                                resource.id
                                            )}
                                        >
                                            {resource.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reservation Date */}
                    <div className="space-y-2">
                        <Label htmlFor="reservationDate">
                            Reservation Date
                        </Label>

                        <Input
                            id="reservationDate"
                            type="date"
                            value={reservationDate}
                            onChange={(event) =>
                                setReservationDate(
                                    event.target.value
                                )
                            }
                            required
                        />
                    </div>

                    {/* Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="startTime">
                                Start Time
                            </Label>

                            <Input
                                id="startTime"
                                type="time"
                                value={startTime}
                                onChange={(event) =>
                                    setStartTime(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="endTime">
                                End Time
                            </Label>

                            <Input
                                id="endTime"
                                type="time"
                                value={endTime}
                                onChange={(event) =>
                                    setEndTime(
                                        event.target.value
                                    )
                                }
                                required
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                onOpenChange(false)
                            }
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isLoadingResources ||
                                !resourceId
                            }
                        >
                            {isSubmitting
                                ? "Saving..."
                                : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}