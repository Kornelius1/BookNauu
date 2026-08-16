import axiosInstance from "../api/axios";

export interface GoogleCalendarStatusResponse {
    connected: boolean;
    googleAccountEmail: string | null;
    calendarId: string | null;
}

export const getGoogleCalendarStatus =
    async (): Promise<GoogleCalendarStatusResponse> => {

        const response =
            await axiosInstance.get<GoogleCalendarStatusResponse>(
                "/v1/integrations/google/calendar/status"
            );

        return response.data;
    };


export const disconnectGoogleCalendar =
    async (): Promise<void> => {

        await axiosInstance.delete(
            "/v1/integrations/google/calendar/disconnect"
        );
    };


export const connectGoogleCalendar = (): void => {

    window.location.href =
        `${import.meta.env.VITE_API_URL}/v1/integrations/google/calendar/connect`;
};