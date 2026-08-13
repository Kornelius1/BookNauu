import axiosInstance from "../api/axios";
import type { BusinessDashboardResponse } from "../types/dashboard";

const getDashboard = async (): Promise<BusinessDashboardResponse> => {
    const response = await axiosInstance.get<BusinessDashboardResponse>(
        "/v1/business/dashboard"
    );

    return response.data;
};

export const dashboardService = {
    getDashboard,
};