import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LoginResponse, User } from "@/types/auth";
import { getCurrentUser } from "@/services/auth.service";

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (response: LoginResponse) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface Props {
    children: ReactNode;
}


export function AuthProvider({ children }: Props) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function initializeAuth() {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const currentUser = await getCurrentUser();
                setUser(currentUser);

                localStorage.setItem("user", JSON.stringify({
                    id: currentUser.id,
                    name: currentUser.fullName,
                    avatar: currentUser.avatar
                }));
            } catch (error) {
                console.error("Sesi tidak valid", error);
                logout();
            } finally {
                setLoading(false);
            }
        }

        initializeAuth();
    }, [token]);

    function login(response: LoginResponse) {
        localStorage.setItem("token", response.token);

        setToken(response.token);
        setUser(response.user);
    }

    function logout() {
        localStorage.removeItem("token");

        setToken(null);
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                logout,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth harus digunakan di dalam AuthProvider");
    }
    return context;
}