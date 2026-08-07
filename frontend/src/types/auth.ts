export interface User {
    id:number;
    fullName:string;
    email:string;
    role: "ROLE_ADMIN" | "ROLE_CUSTOMER";
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    accessToken: string | null;
    expiresIn: number | null;
    user: User;
}
