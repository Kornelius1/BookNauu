export interface ApiResponse<T> {
    data: T;
    message: string;
    success: boolean;
    timestamp: string;
}

export type ResourceStatus =
    | "AVAILABLE"
    | "UNAVAILABLE";

export interface ResourceResponse {
    id: number;
    businessId: number;
    resourceTypeId: number;
    resourceTypeName: string;
    name: string;
    description: string | null;
    capacity: number | null;
    price: number;
    status: ResourceStatus;
    imageUrl: string | null;
}

export interface ResourceTypeResponse {
    id: number;
    businessId: number;
    name: string;
    description: string | null;
}

export interface CreateResourceRequest {
    resourceTypeId: number;
    name: string;
    description?: string;
    capacity?: number;
    price: number;
    status: ResourceStatus;
    imageUrl?: string;
}

export interface UpdateResourceRequest {
    resourceTypeId?: number;
    name?: string;
    description?: string;
    capacity?: number;
    price?: number;
    status?: ResourceStatus;
    imageUrl?: string;
}

export interface CreateResourceTypeRequest {
    name: string;
    description?: string;
}

export interface UpdateResourceTypeRequest {
    name: string;
    description?: string;
}