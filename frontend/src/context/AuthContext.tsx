import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";

import type {
    LoginResponse,
    User,
} from "@/types/auth";

import { getCurrentUser } from "@/services/auth.service";

interface AuthContextType {

    user: User | null;

    token: string | null;

    loading: boolean;

    isAuthenticated: boolean;

    login: (response: LoginResponse) => void;

    logout: () => void;

}

const AuthContext =
    createContext<AuthContextType | null>(null);

interface Props {

    children: ReactNode;

}

export function AuthProvider({
                                 children,
                             }: Props) {

    const [user, setUser] =
        useState<User | null>(null);

    const [token, setToken] =
        useState<string | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        async function initializeAuth() {

            const savedToken =
                localStorage.getItem("token");

            if (!savedToken) {

                setLoading(false);

                return;

            }

            setToken(savedToken);

            try {

                const currentUser =
                    await getCurrentUser();

                setUser(currentUser);

            } catch (error) {

                console.error(
                    "Failed to restore session",
                    error
                );

                logout();

            } finally {

                setLoading(false);

            }

        }

        initializeAuth();

    }, []);

    function login(
        response: LoginResponse
    ) {

        localStorage.setItem(
            "token",
            response.token
        );

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
                isAuthenticated:
                    !!token && !!user,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    const context =
        useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside AuthProvider"
        );

    }

    return context;

}