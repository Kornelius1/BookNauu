import axiosInstance from "@/api/axios";

import type { ApiResponse } from "@/types/api";
import type { LoginResponse, User } from "@/types/auth";
import type { LoginFormData } from "@/schemas/auth.schema";

export async function login(
    data: LoginFormData
): Promise<LoginResponse> {

    const response =
        await axiosInstance.post<ApiResponse<LoginResponse>>(
            "/auth/login",
            data
        );

    return response.data.data;
}

export async function getCurrentUser(): Promise<User> {

    const response =
        await axiosInstance.get<ApiResponse<User>>(
            "/auth/me"
        );

    return response.data.data;
}