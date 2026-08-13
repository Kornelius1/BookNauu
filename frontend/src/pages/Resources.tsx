import { useEffect, useMemo, useState } from "react";
import {
    Circle,
    Edit,
    Plus,
    RefreshCw,
    Search,
    Trash2,
} from "lucide-react";

import { resourceService } from "@/services/resource.service";

import type {
    ResourceResponse,
    ResourceStatus,
    ResourceTypeResponse,
} from "@/types/resource";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ResourceFormDialog from "@/components/resources/ResourceFormDialog";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

const Resources = () => {
    const [resources, setResources] = useState<ResourceResponse[]>([]);
    const [resourceTypes, setResourceTypes] = useState<
        ResourceTypeResponse[]
    >([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [resourceTypeFilter, setResourceTypeFilter] =
        useState<string>("all");
    const [statusFilter, setStatusFilter] =
        useState<string>("all");

    const [deleteResource, setDeleteResource] =
        useState<ResourceResponse | null>(null);

    const [deleting, setDeleting] = useState(false);

    const [formOpen, setFormOpen] = useState(false);

    const [editingResource, setEditingResource] =
        useState<ResourceResponse | null>(null);

    const fetchResources = async () => {
        try {
            setLoading(true);
            setError(null);

            const [resourceResponse, resourceTypeResponse] =
                await Promise.all([
                    resourceService.getResources(),
                    resourceService.getResourceTypes(),
                ]);

            setResources(resourceResponse.data);
            setResourceTypes(resourceTypeResponse.data);
        } catch (err) {
            console.error(
                "Failed to fetch resources:",
                err
            );

            setError(
                "Failed to load resources."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResources();
    }, []);

    const filteredResources = useMemo(() => {
        return resources.filter((resource) => {
            const normalizedSearch =
                search.toLowerCase().trim();

            const matchesSearch =
                normalizedSearch === "" ||
                resource.name
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                resource.resourceTypeName
                    .toLowerCase()
                    .includes(normalizedSearch) ||
                (resource.description ?? "")
                    .toLowerCase()
                    .includes(normalizedSearch);

            const matchesResourceType =
                resourceTypeFilter === "all" ||
                resource.resourceTypeId.toString() ===
                resourceTypeFilter;

            const matchesStatus =
                statusFilter === "all" ||
                resource.status === statusFilter;

            return (
                matchesSearch &&
                matchesResourceType &&
                matchesStatus
            );
        });
    }, [
        resources,
        search,
        resourceTypeFilter,
        statusFilter,
    ]);

    const handleDelete = async () => {
        if (!deleteResource) {
            return;
        }

        try {
            setDeleting(true);

            await resourceService.deleteResource(
                deleteResource.id
            );

            setResources((current) =>
                current.filter(
                    (resource) =>
                        resource.id !==
                        deleteResource.id
                )
            );

            setDeleteResource(null);
        } catch (err) {
            console.error(
                "Failed to delete resource:",
                err
            );

            setError(
                "Failed to delete resource."
            );
        } finally {
            setDeleting(false);
        }
    };

    const getStatusBadge = (
        status: ResourceStatus
    ) => {
        if (status === "AVAILABLE") {
            return (
                <Badge
                    variant="outline"
                    className="border-green-200 bg-green-50 text-green-700"
                >
                    <Circle className="mr-1.5 h-2.5 w-2.5 fill-current" />
                    Available
                </Badge>
            );
        }

        return (
            <Badge
                variant="outline"
                className="border-red-200 bg-red-50 text-red-700"
            >
                <Circle className="mr-1.5 h-2.5 w-2.5 fill-current" />
                Unavailable
            </Badge>
        );
    };

    const formatPrice = (price: number) => {
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    /*
     * Loading
     */
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-40" />
                        <Skeleton className="h-4 w-72" />
                    </div>

                    <Skeleton className="h-10 w-36" />
                </div>

                <Card>
                    <CardHeader>
                        <Skeleton className="h-5 w-32" />
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {Array.from({ length: 5 }).map(
                            (_, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border p-4"
                                >
                                    <div className="space-y-2">
                                        <Skeleton className="h-5 w-32" />
                                        <Skeleton className="h-4 w-48" />
                                    </div>

                                    <Skeleton className="h-8 w-20" />
                                </div>
                            )
                        )}
                    </CardContent>
                </Card>
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
                            Unable to load resources
                        </h2>

                        <p className="text-sm text-muted-foreground">
                            {error}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        onClick={fetchResources}
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try again
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Resources
                    </h1>

                    <p className="text-sm text-muted-foreground">
                        Manage the resources available for reservation.
                    </p>
                </div>

                <Button
                    onClick={()=>{
                        setEditingResource(null);
                        setFormOpen(true);
                    }}
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Resource
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="p-4">
                    <div className="grid gap-3 md:grid-cols-[1fr_200px_180px]">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                value={search}
                                onChange={(event) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search resources..."
                                className="pl-9"
                            />
                        </div>

                        {/* Resource Type */}
                        <Select
                            value={resourceTypeFilter}
                            onValueChange={(value) => {
                                if (value !== null) {
                                    setResourceTypeFilter(value);
                                }
                            }}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Resource type" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All types
                                </SelectItem>

                                {resourceTypes.map(
                                    (type) => (
                                        <SelectItem
                                            key={type.id}
                                            value={type.id.toString()}
                                        >
                                            {type.name}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>

                        {/* Status */}
                        <Select
                            value={statusFilter}
                            onValueChange={(value) => {
                                if (value !== null) {
                                    setStatusFilter(value);
                            }}
                        }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All status
                                </SelectItem>

                                <SelectItem value="AVAILABLE">
                                    Available
                                </SelectItem>

                                <SelectItem value="UNAVAILABLE">
                                    Unavailable
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Resource List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>
                        Resources
                    </CardTitle>

                    <span className="text-sm text-muted-foreground">
                        {filteredResources.length}{" "}
                        {filteredResources.length === 1
                            ? "resource"
                            : "resources"}
                    </span>
                </CardHeader>

                <CardContent>
                    {filteredResources.length === 0 ? (
                        <div className="flex min-h-[250px] items-center justify-center">
                            <div className="space-y-2 text-center">
                                <h3 className="font-medium">
                                    No resources found
                                </h3>

                                <p className="text-sm text-muted-foreground">
                                    Try changing your search or
                                    filter.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredResources.map(
                                (resource) => (
                                    <div
                                        key={resource.id}
                                        className="flex flex-col gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/30 md:flex-row md:items-center md:justify-between"
                                    >
                                        {/* Resource information */}
                                        <div className="flex min-w-0 items-center gap-4">
                                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                                                {resource.imageUrl ? (
                                                    <img
                                                        src={
                                                            resource.imageUrl
                                                        }
                                                        alt={
                                                            resource.name
                                                        }
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-lg font-semibold text-muted-foreground">
                                                        {resource.name
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="font-medium">
                                                        {
                                                            resource.name
                                                        }
                                                    </p>

                                                    {getStatusBadge(
                                                        resource.status
                                                    )}
                                                </div>

                                                <p className="text-sm text-muted-foreground">
                                                    {
                                                        resource.resourceTypeName
                                                    }

                                                    {resource.capacity !==
                                                        null && (
                                                            <>
                                                                {" · "}
                                                                Capacity{" "}
                                                                {
                                                                    resource.capacity
                                                                }
                                                            </>
                                                        )}
                                                </p>

                                                {resource.description && (
                                                    <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                                                        {
                                                            resource.description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Price + Actions */}
                                        <div className="flex items-center justify-between gap-4 md:justify-end">
                                            <div className="text-right">
                                                <p className="font-semibold">
                                                    {formatPrice(
                                                        resource.price
                                                    )}
                                                </p>

                                                <p className="text-xs text-muted-foreground">
                                                    Resource #
                                                    {
                                                        resource.id
                                                    }
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Edit resource"
                                                    onClick={() => {
                                                        setEditingResource(resource);
                                                        setFormOpen(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>

                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    title="Delete resource"
                                                    onClick={() =>
                                                        setDeleteResource(
                                                            resource
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Resource Form */}
            <ResourceFormDialog
                open={formOpen}
                onOpenChange={(open) => {
                    setFormOpen(open);

                    if (!open) {
                        setEditingResource(null);
                    }
                }}
                resourceTypes={resourceTypes}
                resource={editingResource}
                onSuccess={(savedResource) => {
                    setResources((current) => {
                        if (editingResource) {
                            return current.map((resource) =>
                                resource.id === savedResource.id
                                    ? savedResource
                                    : resource
                            );
                        }

                        return [...current, savedResource];
                    });

                    setEditingResource(null);
                }}
            />

            {/* Delete Confirmation */}
            <AlertDialog
                open={deleteResource !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeleteResource(null);
                    }
                }}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            Delete resource?
                        </AlertDialogTitle>

                        <AlertDialogDescription>
                            {deleteResource
                                ? `Are you sure you want to delete "${deleteResource.name}"? This action cannot be undone.`
                                : "This action cannot be undone."}
                        </AlertDialogDescription>
                    </AlertDialogHeader>

                    <AlertDialogFooter>
                        <AlertDialogCancel
                            disabled={deleting}
                        >
                            Cancel
                        </AlertDialogCancel>

                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? (
                                <>
                                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Resources;