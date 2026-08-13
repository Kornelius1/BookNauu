export type ReservationStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

export type ResourceStatus =
    | "AVAILABLE"
    | "UNAVAILABLE";

export interface DashboardSummary {
    totalReservations: number;
    todayReservations: number;
    totalCustomers: number;
    reservationValue: number;
    revenue: number;
    totalResources: number;
}

export interface RecentActivity {
    reservationId: number;
    customerName: string;
    resourceName: string;
    status: ReservationStatus;
    totalPrice: number;
    createdAt: string;
}

export interface TodayReservation {
    id: number;
    customerName: string;
    resourceName: string;
    startTime: string;
    endTime: string;
    status: ReservationStatus;
    totalPrice: number;
}

export interface ResourceAvailability {
    resourceId: number;
    resourceName: string;
    status: ResourceStatus;
    available: boolean;
}

export interface BusinessDashboardResponse {
    summary: DashboardSummary;
    recentActivities: RecentActivity[];
    todayReservations: TodayReservation[];
    resourceAvailability: ResourceAvailability[];
}