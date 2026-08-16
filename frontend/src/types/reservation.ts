export type ReservationStatus =
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

export interface CustomerRequest {
    fullName: string;
    email?: string;
    phone: string;
}

export interface CreateReservationRequest {
    resourceId: number;
    reservationDate: string;
    customer: CustomerRequest;
    startTime: string;
    endTime: string;
}

export interface UpdateReservationRequest {
    resourceId?: number;
    reservationDate?: string;
    startTime?: string;
    endTime?: string;
}

export interface ReservationStatusRequest {
    status: ReservationStatus;
}

export interface ReservationResponse {
    id: number;

    reservationDate: string;
    startTime: string;
    endTime: string;

    customerId: number;
    customerName: string;

    resourceId: number;
    resourceName: string;

    resourceTypeId: number;
    resourceTypeName: string;

    totalPrice: number;

    status: ReservationStatus;

    note: string | null;

    createdAt: string;
    updatedAt: string;
}