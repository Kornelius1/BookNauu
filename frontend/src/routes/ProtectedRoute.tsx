import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

import type { BusinessRole } from "@/types/auth";


interface ProtectedRouteProps {
    allowedRoles?: BusinessRole[];
}


export default function ProtectedRoute({
                                           allowedRoles,
                                       }: ProtectedRouteProps) {

    const {
        isAuthenticated,
        isLoading,
        business,
    } = useAuth();


    /*
     * AuthContext masih melakukan
     * GET /auth/me.
     *
     * Jangan melakukan redirect
     * sebelum proses tersebut selesai.
     */
    if (isLoading) {

        return (
            <div className="flex min-h-screen items-center justify-center">
                <div className="text-sm text-muted-foreground">
                    Loading...
                </div>
            </div>
        );
    }


    /*
     * User belum login.
     */
    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }


    /*
     * Route tidak membutuhkan
     * role tertentu.
     */
    if (!allowedRoles || allowedRoles.length === 0) {

        return <Outlet />;
    }


    /*
     * User sudah login tetapi
     * belum memiliki business context.
     */
    if (!business) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    /*
     * Cek business role.
     */
    const hasPermission =
        allowedRoles.includes(
            business.role
        );


    /*
     * Login valid,
     * tetapi role tidak diperbolehkan.
     */
    if (!hasPermission) {

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }


    return <Outlet />;
}