import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { resourceService } from "@/services/resource.service";
import type {
    CreateResourceRequest,
    ResourceResponse,
    ResourceStatus,
    ResourceTypeResponse,
    UpdateResourceRequest,
} from "@/types/resource";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface ResourceFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resourceTypes: ResourceTypeResponse[];
    resource?: ResourceResponse | null;
    onSuccess: (resource: ResourceResponse) => void;
}

interface FormData {
    resourceTypeId: string;
    name: string;
    description: string;
    capacity: string;
    price: string;
    status: ResourceStatus;
    imageUrl: string;
}

const DEFAULT_FORM: FormData = {
    resourceTypeId: "",
    name: "",
    description: "",
    capacity: "",
    price: "",
    status: "AVAILABLE",
    imageUrl: "",
};

const ResourceFormDialog = ({
                                open,
                                onOpenChange,
                                resourceTypes,
                                resource,
                                onSuccess,
                            }: ResourceFormDialogProps) => {
    const isEditMode = Boolean(resource);

    const [formData, setFormData] = useState<FormData>(DEFAULT_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (resource) {
            setFormData({
                resourceTypeId: resource.resourceTypeId.toString(),
                name: resource.name,
                description: resource.description ?? "",
                capacity: resource.capacity !== null ? resource.capacity.toString() : "",
                price: resource.price.toString(),
                status: resource.status,
                imageUrl: resource.imageUrl ?? "",
            });
        } else {
            setFormData(DEFAULT_FORM);
        }

        setErrors({});
    }, [open, resource]);

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(current => ({
            ...current,
            [field]: value,
        }));

        setErrors(current => ({
            ...current,
            [field]: "",
            form: "",
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!formData.resourceTypeId) {
            newErrors.resourceTypeId = "Resource type is required.";
        }

        if (!formData.name.trim()) {
            newErrors.name = "Resource name is required.";
        } else if (formData.name.trim().length > 150) {
            newErrors.name = "Resource name must not exceed 150 characters.";
        }

        if (formData.description.length > 500) {
            newErrors.description = "Description must not exceed 500 characters.";
        }

        if (formData.capacity !== "") {
            const capacity = Number(formData.capacity);

            if (!Number.isInteger(capacity) || capacity < 0) {
                newErrors.capacity = "Capacity must be a valid non-negative integer.";
            }
        }

        if (!formData.price.trim()) {
            newErrors.price = "Price is required.";
        } else {
            const price = Number(formData.price);

            if (Number.isNaN(price) || price < 0) {
                newErrors.price = "Price must be a valid number greater than or equal to 0.";
            }
        }

        if (formData.imageUrl.length > 500) {
            newErrors.imageUrl = "Image URL must not exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSubmitting(true);

            if (isEditMode && resource) {
                const payload: UpdateResourceRequest = {
                    resourceTypeId: Number(formData.resourceTypeId),
                    name: formData.name.trim(),
                    description: formData.description.trim() || undefined,
                    capacity: formData.capacity !== "" ? Number(formData.capacity) : undefined,
                    price: Number(formData.price),
                    status: formData.status,
                    imageUrl: formData.imageUrl.trim() || undefined,
                };

                const response = await resourceService.updateResource(resource.id, payload);
                onSuccess(response.data);
            } else {
                const payload: CreateResourceRequest = {
                    resourceTypeId: Number(formData.resourceTypeId),
                    name: formData.name.trim(),
                    description: formData.description.trim() || undefined,
                    capacity: formData.capacity !== "" ? Number(formData.capacity) : undefined,
                    price: Number(formData.price),
                    status: formData.status,
                    imageUrl: formData.imageUrl.trim() || undefined,
                };

                const response = await resourceService.createResource(payload);
                onSuccess(response.data);
            }

            onOpenChange(false);
        } catch (error) {
            console.error("Failed to save resource:", error);

            setErrors({
                form: isEditMode
                    ? "Failed to update resource. Please try again."
                    : "Failed to create resource. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>{isEditMode ? "Edit Resource" : "Add Resource"}</DialogTitle>
                    <DialogDescription>
                        {isEditMode
                            ? "Update the resource information below."
                            : "Add a new resource that can be reserved by customers."}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {errors.form && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {errors.form}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="resourceType">
                            Resource Type <span className="text-destructive">*</span>
                        </Label>

                        <Select
                            value={formData.resourceTypeId}
                            onValueChange={value => {
                                if (value !== null) {
                                    handleChange("resourceTypeId", value);
                                }
                            }}
                        >
                            <SelectTrigger id="resourceType">
                                <SelectValue placeholder="Select resource type" />
                            </SelectTrigger>

                            <SelectContent>
                                {resourceTypes.map(type => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        {errors.resourceTypeId && (
                            <p className="text-xs text-destructive">{errors.resourceTypeId}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </Label>

                        <Input
                            id="name"
                            value={formData.name}
                            onChange={event => handleChange("name", event.target.value)}
                            placeholder="e.g. Room 101"
                            maxLength={150}
                        />

                        {errors.name && (
                            <p className="text-xs text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>

                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={event => handleChange("description", event.target.value)}
                            placeholder="Describe this resource..."
                            rows={3}
                            maxLength={500}
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                {errors.description && (
                                    <span className="text-destructive">
                                        {errors.description}
                                    </span>
                                )}
                            </span>
                            <span>{formData.description.length}/500</span>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="capacity">Capacity</Label>

                            <Input
                                id="capacity"
                                type="number"
                                min={0}
                                value={formData.capacity}
                                onChange={event => handleChange("capacity", event.target.value)}
                                placeholder="e.g. 10"
                            />

                            {errors.capacity && (
                                <p className="text-xs text-destructive">{errors.capacity}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">
                                Price <span className="text-destructive">*</span>
                            </Label>

                            <Input
                                id="price"
                                type="number"
                                min={0}
                                step="0.01"
                                value={formData.price}
                                onChange={event => handleChange("price", event.target.value)}
                                placeholder="e.g. 150000"
                            />

                            {errors.price && (
                                <p className="text-xs text-destructive">{errors.price}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">
                            Status <span className="text-destructive">*</span>
                        </Label>

                        <Select
                            value={formData.status}
                            onValueChange={value => {
                                if (value !== null) {
                                    handleChange("status", value);
                                }
                            }}
                        >
                            <SelectTrigger id="status">
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="AVAILABLE">Available</SelectItem>
                                <SelectItem value="UNAVAILABLE">Unavailable</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Image URL</Label>

                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={event => handleChange("imageUrl", event.target.value)}
                            placeholder="https://example.com/image.jpg"
                            maxLength={500}
                        />

                        {errors.imageUrl && (
                            <p className="text-xs text-destructive">{errors.imageUrl}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button type="submit" disabled={submitting}>
                            {submitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isEditMode ? "Save Changes" : "Create Resource"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ResourceFormDialog;