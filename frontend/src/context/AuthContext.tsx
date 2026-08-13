import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";


import {
    getCurrentUser,
    logout as logoutService,
} from "@/services/auth.service";

import type {
    User,
    BusinessContext,
    LoginResponse,
} from "@/types/auth";


interface AuthContextType {

    user: User | null;

    business: BusinessContext | null;

    isAuthenticated: boolean;

    isLoading: boolean;

    login: (
        response: LoginResponse
    ) => void;

    logout: () => void;
}


export const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );


export function useAuth() {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error(
            "useAuth must be used within an AuthProvider"
        );
    }

    return context;
}


interface AuthProviderProps {
    children: ReactNode;
}


export function AuthProvider({
                                 children,
                             }: AuthProviderProps) {

    const [user, setUser] =
        useState<User | null>(null);

    const [business, setBusiness] =
        useState<BusinessContext | null>(null);

    const [isLoading, setIsLoading] =
        useState(true);


    useEffect(() => {

        async function initializeAuth() {

            const token =
                localStorage.getItem("token");


            /*
             * Tidak ada token.
             *
             * Tidak perlu memanggil /auth/me.
             */
            if (!token) {

                setUser(null);
                setBusiness(null);
                setIsLoading(false);

                return;
            }


            /*
             * Token ada.
             *
             * Validasi token dengan backend
             * melalui /auth/me.
             */
            try {

                const response =
                    await getCurrentUser();


                setUser(response.user);

                setBusiness(response.business);

            } catch (error) {

                console.error(
                    "Failed to restore authentication",
                    error
                );


                /*
                 * Token invalid / expired.
                 */
                logoutService();

                setUser(null);

                setBusiness(null);

            } finally {

                setIsLoading(false);
            }
        }


        initializeAuth();

    }, []);


    /*
     * Dipanggil setelah login berhasil.
     */
    function login(
        response: LoginResponse
    ) {

        localStorage.setItem(
            "token",
            response.token
        );

        setUser(response.user);

        setBusiness(response.business);
    }


    /*
     * Logout.
     */
    function logout() {

        logoutService();

        setUser(null);

        setBusiness(null);
    }


    const value: AuthContextType = {

        user,

        business,

        isAuthenticated:
            user !== null,

        isLoading,

        login,

        logout,
    };


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

