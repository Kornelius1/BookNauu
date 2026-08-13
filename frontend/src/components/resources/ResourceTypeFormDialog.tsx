import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { resourceService } from "@/services/resource.service";
import type {
    CreateResourceTypeRequest,
    ResourceTypeResponse,
    UpdateResourceTypeRequest,
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

interface ResourceTypeFormDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    resourceType?: ResourceTypeResponse | null;
    onSuccess: (resourceType: ResourceTypeResponse) => void;
}

interface FormData {
    name: string;
    description: string;
}

const DEFAULT_FORM: FormData = {
    name: "",
    description: "",
};

const ResourceTypeFormDialog = ({
                                    open,
                                    onOpenChange,
                                    resourceType,
                                    onSuccess,
                                }: ResourceTypeFormDialogProps) => {
    const isEditMode = Boolean(resourceType);

    const [formData, setFormData] =
        useState<FormData>(DEFAULT_FORM);

    const [errors, setErrors] =
        useState<Record<string, string>>({});

    const [submitting, setSubmitting] =
        useState(false);

    useEffect(() => {
        if (!open) {
            return;
        }

        if (resourceType) {
            setFormData({
                name: resourceType.name,
                description:
                    resourceType.description ?? "",
            });
        } else {
            setFormData(DEFAULT_FORM);
        }

        setErrors({});
    }, [open, resourceType]);

    const handleChange = (
        field: keyof FormData,
        value: string
    ) => {
        setFormData((current) => ({
            ...current,
            [field]: value,
        }));

        setErrors((current) => ({
            ...current,
            [field]: "",
            form: "",
        }));
    };

    const validate = (): boolean => {
        const newErrors: Record<string, string> =
            {};

        if (!formData.name.trim()) {
            newErrors.name =
                "Resource type name is required.";
        } else if (
            formData.name.trim().length > 100
        ) {
            newErrors.name =
                "Resource type name must not exceed 100 characters.";
        }

        if (formData.description.length > 500) {
            newErrors.description =
                "Description must not exceed 500 characters.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!validate()) {
            return;
        }

        try {
            setSubmitting(true);

            if (isEditMode && resourceType) {
                const payload: UpdateResourceTypeRequest =
                    {
                        name: formData.name.trim(),
                        description:
                            formData.description.trim() ||
                            undefined,
                    };

                const response =
                    await resourceService.updateResourceType(
                        resourceType.id,
                        payload
                    );

                onSuccess(response.data);
            } else {
                const payload: CreateResourceTypeRequest =
                    {
                        name: formData.name.trim(),
                        description:
                            formData.description.trim() ||
                            undefined,
                    };

                const response =
                    await resourceService.createResourceType(
                        payload
                    );

                onSuccess(response.data);
            }

            onOpenChange(false);
        } catch (error) {
            console.error(
                "Failed to save resource type:",
                error
            );

            setErrors({
                form: isEditMode
                    ? "Failed to update resource type. Please try again."
                    : "Failed to create resource type. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!submitting) {
                    onOpenChange(nextOpen);
                }
            }}
        >
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        {isEditMode
                            ? "Edit Resource Type"
                            : "Add Resource Type"}
                    </DialogTitle>

                    <DialogDescription>
                        {isEditMode
                            ? "Update the resource type information below."
                            : "Add a new resource type for your business."}
                    </DialogDescription>
                </DialogHeader>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    {errors.form && (
                        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                            {errors.form}
                        </div>
                    )}

                    {/* Name */}
                    <div className="space-y-2">
                        <Label htmlFor="resource-type-name">
                            Name{" "}
                            <span className="text-destructive">
                                *
                            </span>
                        </Label>

                        <Input
                            id="resource-type-name"
                            value={formData.name}
                            onChange={(event) =>
                                handleChange(
                                    "name",
                                    event.target.value
                                )
                            }
                            placeholder="e.g. Room"
                            maxLength={100}
                            disabled={submitting}
                        />

                        {errors.name && (
                            <p className="text-xs text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label htmlFor="resource-type-description">
                            Description
                        </Label>

                        <Textarea
                            id="resource-type-description"
                            value={
                                formData.description
                            }
                            onChange={(event) =>
                                handleChange(
                                    "description",
                                    event.target.value
                                )
                            }
                            placeholder="Describe this resource type..."
                            rows={3}
                            maxLength={500}
                            disabled={submitting}
                        />

                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>
                                {errors.description && (
                                    <span className="text-destructive">
                                        {
                                            errors.description
                                        }
                                    </span>
                                )}
                            </span>

                            <span>
                                {
                                    formData.description
                                        .length
                                }
                                /500
                            </span>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submitting}
                            onClick={() =>
                                onOpenChange(false)
                            }
                        >
                            Cancel
                        </Button>

                        <Button
                            type="submit"
                            disabled={submitting}
                        >
                            {submitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            {isEditMode
                                ? "Save Changes"
                                : "Create Resource Type"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default ResourceTypeFormDialog;