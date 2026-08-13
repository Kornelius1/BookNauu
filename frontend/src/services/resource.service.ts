import axiosInstance from "../api/axios";

import type {
    ApiResponse,
    CreateResourceRequest,
    CreateResourceTypeRequest,
    ResourceResponse,
    ResourceTypeResponse,
    UpdateResourceRequest,
    UpdateResourceTypeRequest,
} from "../types/resource";

const getResources = async (): Promise<
    ApiResponse<ResourceResponse[]>
> => {
    const response = await axiosInstance.get<
        ApiResponse<ResourceResponse[]>
    >("/resources");

    return response.data;
};

const getResourceById = async (
    id: number
): Promise<ApiResponse<ResourceResponse>> => {
    const response = await axiosInstance.get<
        ApiResponse<ResourceResponse>
    >(`/resources/${id}`);

    return response.data;
};

const getResourcesByType = async (
    resourceTypeId: number
): Promise<ApiResponse<ResourceResponse[]>> => {
    const response = await axiosInstance.get<
        ApiResponse<ResourceResponse[]>
    >(`/resources/type/${resourceTypeId}`);

    return response.data;
};

const createResource = async (
    data: CreateResourceRequest
): Promise<ApiResponse<ResourceResponse>> => {
    const response = await axiosInstance.post<
        ApiResponse<ResourceResponse>
    >("/resources", data);

    return response.data;
};

const updateResource = async (
    id: number,
    data: UpdateResourceRequest
): Promise<ApiResponse<ResourceResponse>> => {
    const response = await axiosInstance.put<
        ApiResponse<ResourceResponse>
    >(`/resources/${id}`, data);

    return response.data;
};

const deleteResource = async (
    id: number
): Promise<ApiResponse<unknown>> => {
    const response = await axiosInstance.delete<
        ApiResponse<unknown>
    >(`/resources/${id}`);

    return response.data;
};

const getResourceTypes = async (): Promise<
    ApiResponse<ResourceTypeResponse[]>
> => {
    const response = await axiosInstance.get<
        ApiResponse<ResourceTypeResponse[]>
    >("/resource-types");

    return response.data;
};

const getResourceTypeById = async (
    id: number
): Promise<ApiResponse<ResourceTypeResponse>> => {
    const response = await axiosInstance.get<
        ApiResponse<ResourceTypeResponse>
    >(`/resource-types/${id}`);

    return response.data;
};

const createResourceType = async (
    data: CreateResourceTypeRequest
): Promise<ApiResponse<ResourceTypeResponse>> => {
    const response = await axiosInstance.post<
        ApiResponse<ResourceTypeResponse>
    >("/resource-types", data);

    return response.data;
};

const updateResourceType = async (
    id: number,
    data: UpdateResourceTypeRequest
): Promise<ApiResponse<ResourceTypeResponse>> => {
    const response = await axiosInstance.put<
        ApiResponse<ResourceTypeResponse>
    >(`/resource-types/${id}`, data);

    return response.data;
};

const deleteResourceType = async (
    id: number
): Promise<ApiResponse<unknown>> => {
    const response = await axiosInstance.delete<
        ApiResponse<unknown>
    >(`/resource-types/${id}`);

    return response.data;
};

export const resourceService = {
    getResources,
    getResourceById,
    getResourcesByType,
    createResource,
    updateResource,
    deleteResource,
    getResourceTypes,
    getResourceTypeById,
    createResourceType,
    updateResourceType,
    deleteResourceType,
};