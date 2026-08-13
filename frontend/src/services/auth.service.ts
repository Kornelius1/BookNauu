import axios from "axios";

import type {
    LoginResponse,
    CurrentUserResponse,
} from "@/types/auth";

import type { LoginFormData } from "@/schemas/auth.schema";

const API_URL = "http://localhost:8080/api/v1/auth";


export async function login(
    data: LoginFormData
): Promise<LoginResponse> {

    localStorage.removeItem("token");

    const response = await axios.post(
        `${API_URL}/login`,
        data
    );

    return response.data.data;
}


export async function getCurrentUser(): Promise<CurrentUserResponse> {

    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No authentication token found");
    }

    const response = await axios.get(
        `${API_URL}/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return response.data.data;
}


export function logout(): void {

    localStorage.removeItem("token");
}