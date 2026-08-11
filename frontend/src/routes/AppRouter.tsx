import { Routes, Route } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Reservations from "@/pages/Reservation";
import Unauthorized from "@/pages/Unauthorized";
import AcceptInvitation from "@/pages/AcceptInvitation";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
    return (
        <Routes>

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/accept-invitation"
                element={<AcceptInvitation />}
            />


            {/* Protected - authenticated */}
            <Route element={<ProtectedRoute />}>

                <Route
                    path="/reservations"
                    element={<Reservations />}
                />

            </Route>


            {/* Protected - OWNER / ADMIN */}
            <Route
                element={
                    <ProtectedRoute
                        allowedRoles={[
                            "OWNER",
                            "ADMIN",
                        ]}
                    />
                }
            >

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Route>


            {/* Unauthorized */}
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

        </Routes>
    );
}