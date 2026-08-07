export interface User {
    id:number;
    fullName:string;
    email:string;
    avatar?: string;
    role: "ADMIN" | "CUSTOMER";
}

export interface LoginResponse {
    token: string;
    tokenType: string;
    accessToken: string | null;
    expiresIn: number | null;
    user: User;
}
