export type BusinessRole = "OWNER" | "ADMIN";

export interface TeamMember {
    userId: number;
    fullName: string;
    email: string;
    role: BusinessRole;
}

export interface InviteAdminRequest {
    email: string;
}