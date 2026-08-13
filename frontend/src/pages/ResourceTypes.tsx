import { useEffect, useMemo, useState } from "react";
import {
    Edit,
    Loader2,
    Plus,
    Search,
    Trash2,
} from "lucide-react";

import { resourceService } from "@/services/resource.service";
import type { ResourceTypeResponse } from "@/types/resource";

import ResourceTypeFormDialog from "@/components/resources/ResourceTypeFormDialog";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertDialog } from "@/components/ui/alert-dialog";
import {
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const ResourceTypes = () => {
    const [resourceTypes, setResourceTypes] = useState<
        ResourceTypeResponse[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");

    const [formOpen, setFormOpen] = useState(false);

    const [editingResourceType, setEditingResourceType] =
        useState<ResourceTypeResponse | null>(null);

    const [deleteResourceType, setDeleteResourceType] =
        useState<ResourceTypeResponse | null>(null);

    const [deleting, setDeleting] = useState(false);

    const fetchResourceTypes = async () => {
        try {
            setLoading(true);
            setError("");

            const response =
                await resourceService.getResourceTypes();

            if (response.success) {
                setResourceTypes(response.data);
            } else {
                setError(
                    response.message ||
                    "Unable to load resource types."
                );
            }
        } catch (err) {
            console.error(
                "Failed to load resource types:",
                err
            );

            setError(
                "Unable to load resource types. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResourceTypes();
    }, []);

    const filteredResourceTypes = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) {
            return resourceTypes;
        }

        return resourceTypes.filter((resourceType) => {
            return (
                resourceType.name
                    .toLowerCase()
                    .includes(keyword) ||
                (resourceType.description ?? "")
                    .toLowerCase()
                    .includes(keyword)
            );
        });
    }, [resourceTypes, search]);

    const handleCreate = () => {
        setEditingResourceType(null);
        setFormOpen(true);
    };

    const handleEdit = (
        resourceType: ResourceTypeResponse
    ) => {
        setEditingResourceType(resourceType);
        setFormOpen(true);
    };

    const handleDelete = async () => {
        if (!deleteResourceType) {
            return;
        }

        try {
            setDeleting(true);

            await resourceService.deleteResourceType(
                deleteResourceType.id
            );

            setResourceTypes((current) =>
                current.filter(
                    (resourceType) =>
                        resourceType.id !==
                        deleteResourceType.id
                )
            );

            setDeleteResourceType(null);
        } catch (err) {
            console.error(
                "Failed to delete resource type:",
                err
            );

            setError(
                "Failed to delete resource type. Please try again."
            );
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Resource Types
                    </h1>

                    <p className="text-muted-foreground">
                        Manage the types of resources
                        available for reservations.
                    </p>
                </div>

                <Button onClick={handleCreate}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource Type
                </Button>
            </div>

            {/* Error */}
            {error && (
                <Alert variant="destructive">
                    <AlertDescription>
                        {error}
                    </AlertDescription>
                </Alert>
            )}

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search resource types..."
                            className="pl-9"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Resource Types */}
            {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map(
                        (_, index) => (
                            <Card key={index}>
                                <CardContent className="space-y-4 pt-6">
                                    <div className="h-5 w-32 animate-pulse rounded bg-muted" />

                                    <div className="space-y-2">
                                        <div className="h-4 w-full animate-pulse rounded bg-muted" />
                                        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <div className="h-5 w-16 animate-pulse rounded bg-muted" />

                                        <div className="flex gap-2">
                                            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
                                            <div className="h-9 w-9 animate-pulse rounded bg-muted" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            ) : filteredResourceTypes.length === 0 ? (
                <Card>
                    <CardContent className="flex min-h-[240px] flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-muted p-3">
                            <Search className="h-6 w-6 text-muted-foreground" />
                        </div>

                        <h3 className="text-lg font-semibold">
                            {search
                                ? "No resource types found"
                                : "No resource types yet"}
                        </h3>

                        <p className="mt-1 max-w-md text-sm text-muted-foreground">
                            {search
                                ? "Try adjusting your search keyword."
                                : "Create your first resource type to start organizing your resources."}
                        </p>

                        {!search && (
                            <Button
                                className="mt-4"
                                onClick={
                                    handleCreate
                                }
                            >
                                <Plus className="mr-2 h-4 w-4" />
                                Add Resource Type
                            </Button>
                        )}
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredResourceTypes.map(
                        (resourceType) => (
                            <Card
                                key={
                                    resourceType.id
                                }
                                className="transition-shadow hover:shadow-md"
                            >
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="truncate text-lg font-semibold">
                                                    {
                                                        resourceType.name
                                                    }
                                                </h3>

                                                <Badge variant="secondary">
                                                    Type
                                                </Badge>
                                            </div>

                                            <p className="mt-2 min-h-[40px] text-sm text-muted-foreground">
                                                {resourceType.description ||
                                                    "No description provided."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between border-t pt-4">
                                        <span className="text-xs text-muted-foreground">
                                            ID:{" "}
                                            {
                                                resourceType.id
                                            }
                                        </span>

                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title="Edit resource type"
                                                onClick={() =>
                                                    handleEdit(
                                                        resourceType
                                                    )
                                                }
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                title="Delete resource type"
                                                onClick={() =>
                                                    setDeleteResourceType(
                                                        resourceType
                                                    )
                                                }
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    )}
                </div>
            )}

            {/* Resource Type Form */}
            <ResourceTypeFormDialog
                open={formOpen}
                onOpenChange={(open) => {
                    setFormOpen(open);

                    if (!open) {
                        setEditingResourceType(
                            null
                        );
                    }
                }}
                resourceType={
                    editingResourceType
                }
                onSuccess={(savedResourceType) => {
                    setResourceTypes((current) => {
                        if (
                            editingResourceType
                        ) {
                            return current.map(
                                (resourceType) =>
                                    resourceType.id ===
                                    savedResourceType.id
                                        ? savedResourceType
                                        : resourceType
                            );
                        }

                        return [
                            ...current,
                            savedResourceType,
                        ];
                    });

                    setEditingResourceType(null);
                }}
            />

            {/* Delete Confirmation */}
            <AlertDialog
                open={Boolean(
                    deleteResourceType
                )}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeleteResourceType(
                            null
                        );
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete Resource Type?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            Are you sure you want to
                            delete{" "}
                            <span className="font-semibold text-foreground">
                                {deleteResourceType?.name}
                            </span>
                            ? This action cannot be
                            undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={deleting}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            disabled={deleting}
                            onClick={(event) => {
                                event.preventDefault();
                                handleDelete();
                            }}
                        >
                            {deleting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}

                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ResourceTypes;