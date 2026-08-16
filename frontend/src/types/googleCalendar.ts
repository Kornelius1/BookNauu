export interface GoogleCalendarStatusResponse {
    connected: boolean;
    googleAccountEmail: string | null;
    calendarId: string | null;
}

export interface GoogleCalendarConnectResponse {
    authorizationUrl: string;
}