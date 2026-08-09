import { Navigate, Outlet } from "react-router-dom";
import {useAuth} from "@/hooks/useAuth.ts";


interface Props {

    allowedRoles: string[];

}

export default function RoleRoute({allowedRoles,}: Props) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}