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

import type { CreateReservationRequest } from "../types/reservation";
import type { ResourceResponse } from "../types/resource";
import { resourceService } from "../../services/resource.service";

interface CreateReservationDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (
        data: CreateReservationRequest
    ) => Promise<void>;
}

export function CreateReservationDialog({
                                            open,
                                            onOpenChange,
                                            onSubmit,
                                        }: CreateReservationDialogProps) {
    const [resources, setResources] = useState<
        ResourceResponse[]
    >([]);

    const [isLoadingResources, setIsLoadingResources] =
        useState(false);

    const [resourceId, setResourceId] = useState("");
    const [reservationDate, setReservationDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [isSubmitting, setIsSubmitting] =
        useState(false);

    const [error, setError] =
        useState<string | null>(null);

    useEffect(() => {
        if (!open) {
            return;
        }

        const fetchResources = async () => {
            try {
                setIsLoadingResources(true);
                setError(null);

                const response =
                    await resourceService.getResources();

                setResources(
                    response.data.filter(
                        (resource) =>
                            resource.status === "AVAILABLE"
                    )
                );
            } catch (err) {
                console.error(
                    "Failed to fetch resources:",
                    err
                );

                setError(
                    "Failed to load resources."
                );
            } finally {
                setIsLoadingResources(false);
            }
        };

        fetchResources();
    }, [open]);

    const resetForm = () => {
        setResourceId("");
        setReservationDate("");
        setStartTime("");
        setEndTime("");
        setFullName("");
        setEmail("");
        setPhone("");
        setError(null);
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setError(null);

        if (
            !resourceId ||
            !reservationDate ||
            !startTime ||
            !endTime ||
            !fullName ||
            !phone
        ) {
            setError(
                "Please fill in all required fields."
            );
            return;
        }

        if (endTime <= startTime) {
            setError(
                "End time must be after start time."
            );
            return;
        }

        try {
            setIsSubmitting(true);

            const data: CreateReservationRequest = {
                resourceId: Number(resourceId),
                reservationDate,
                startTime,
                endTime,
                customer: {
                    fullName,
                    email: email || undefined,
                    phone,
                },
            };

            await onSubmit(data);

            resetForm();
            onOpenChange(false);
        } catch (err) {
            console.error(
                "Failed to create reservation:",
                err
            );

            setError(
                "Failed to create reservation. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleOpenChange = (value: boolean) => {
        if (!value && !isSubmitting) {
            resetForm();
        }

        onOpenChange(value);
    };

    return (
        <Dialog
            open={open}
            onOpenChange={handleOpenChange}
        >
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>
                        Create Reservation
                    </DialogTitle>

                    <DialogDescription>
                        Create a new reservation for your business.
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {/* Customer */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            Customer Information
                        </h3>

                        <div className="space-y-2">
                            <Label htmlFor="create-fullName">
                                Full Name
                            </Label>

                            <Input
                                id="create-fullName"
                                value={fullName}
                                onChange={(event) =>
                                    setFullName(
                                        event.target.value
                                    )
                                }
                                placeholder="Customer full name"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="create-email">
                                    Email
                                </Label>

                                <Input
                                    id="create-email"
                                    type="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(
                                            event.target.value
                                        )
                                    }
                                    placeholder="customer@email.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="create-phone">
                                    Phone
                                </Label>

                                <Input
                                    id="create-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(event) =>
                                        setPhone(
                                            event.target.value
                                        )
                                    }
                                    placeholder="08xxxxxxxxxx"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Reservation */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium">
                            Reservation Details
                        </h3>

                        {/* Resource */}
                        <div className="space-y-2">
                            <Label htmlFor="create-resource">
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
                                <SelectTrigger id="create-resource">
                                    <SelectValue
                                        placeholder={
                                            isLoadingResources
                                                ? "Loading resources..."
                                                : "Select a resource"
                                        }
                                    >
                                        {resourceId
                                            ? resources.find(
                                                (resource) =>
                                                    String(resource.id) === resourceId
                                            )?.name
                                            : undefined}
                                    </SelectValue>
                                </SelectTrigger>

                                <SelectContent>
                                    {resources.length === 0 ? (
                                        <SelectItem
                                            value="no-resource"
                                            disabled
                                        >
                                            No available resources
                                        </SelectItem>
                                    ) : (
                                        resources.map(
                                            (resource) => (
                                                <SelectItem
                                                    key={
                                                        resource.id
                                                    }
                                                    value={String(
                                                        resource.id
                                                    )}
                                                >
                                                    {resource.name}
                                                </SelectItem>
                                            )
                                        )
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Date */}
                        <div className="space-y-2">
                            <Label htmlFor="create-reservationDate">
                                Reservation Date
                            </Label>

                            <Input
                                id="create-reservationDate"
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
                                <Label htmlFor="create-startTime">
                                    Start Time
                                </Label>

                                <Input
                                    id="create-startTime"
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
                                <Label htmlFor="create-endTime">
                                    End Time
                                </Label>

                                <Input
                                    id="create-endTime"
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
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-destructive">
                            {error}
                        </p>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                handleOpenChange(false)
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
                                resources.length === 0
                            }
                        >
                            {isSubmitting
                                ? "Creating..."
                                : "Create Reservation"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}