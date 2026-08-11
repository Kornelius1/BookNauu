export type UserRole =
    | "ADMIN"
    | "STAFF"
    | "CUSTOMER";

export type BusinessRole =
    | "OWNER"
    | "ADMIN"
    | "STAFF";

export interface User {
    id: number;
    fullName: string;
    email: string;
    role: UserRole;
}

export interface BusinessContext {
    businessId: number;
    businessName: string;
    businessSlug: string;
    role: BusinessRole;
}

export interface CurrentUserResponse {
    user: User;
    business: BusinessContext;
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    user: User;
    business: BusinessContext;
}