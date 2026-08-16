import axiosInstance from "../api/axios";
import type {
    CreateReservationRequest,
    ReservationResponse,
    ReservationStatusRequest,
    UpdateReservationRequest,
} from "../types/reservation";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
    errors: unknown;
    timestamp: string;
}

const reservationService = {
    async getAll(): Promise<ReservationResponse[]> {
        const response =
            await axiosInstance.get<ApiResponse<ReservationResponse[]>>(
                "/reservations"
            );

        return response.data.data;
    },

    async getById(id: number): Promise<ReservationResponse> {
        const response =
            await axiosInstance.get<ApiResponse<ReservationResponse>>(
                `/reservations/${id}`
            );

        return response.data.data;
    },

    async create(
        data: CreateReservationRequest
    ): Promise<ReservationResponse> {
        const response =
            await axiosInstance.post<ApiResponse<ReservationResponse>>(
                "/reservations",
                data
            );

        return response.data.data;
    },

    async update(
        id: number,
        data: UpdateReservationRequest
    ): Promise<ReservationResponse> {
        const response =
            await axiosInstance.put<ApiResponse<ReservationResponse>>(
                `/reservations/${id}`,
                data
            );

        return response.data.data;
    },

    async updateStatus(
        id: number,
        data: ReservationStatusRequest
    ): Promise<ReservationResponse> {
        const response =
            await axiosInstance.patch<ApiResponse<ReservationResponse>>(
                `/reservations/${id}/status`,
                data
            );

        return response.data.data;
    },

    async delete(id: number): Promise<void> {
        await axiosInstance.delete(`/reservations/${id}`);
    },
};

export default reservationService;