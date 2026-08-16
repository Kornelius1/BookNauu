import { Routes, Route, Navigate } from "react-router-dom";

import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Reservations from "@/pages/Reservation";
import Unauthorized from "@/pages/Unauthorized";
import AcceptInvitation from "@/pages/AcceptInvitation";
import Resources from "@/pages/Resources";
import ResourceTypes from "@/pages/ResourceTypes";

import AppLayout from "@/components/layout/AppLayout";
import ProtectedRoute from "./ProtectedRoute";
import MembershipPage from "@/pages/MembershipPage.tsx";
import SettingsPage from "../pages/SettingsPage";

export default function AppRouter() {
    return (
        <Routes>

            {/* Root */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Public */}
            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/accept-invitation"
                element={<AcceptInvitation />}
            />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>

                <Route element={<AppLayout />}>

                    <Route
                        path="/reservations"
                        element={<Reservations />}
                    />

                    <Route
                        path="/resource-types"
                        element={<ResourceTypes />}
                    />

                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />

                    <Route
                        path="/resources"
                        element={<Resources />}
                    />

                    <Route
                        path="/membership"
                        element={<MembershipPage />}
                    />

                    <Route
                        path="/settings"
                        element={<SettingsPage />}
                    />

                </Route>

            </Route>

            {/* Unauthorized */}
            <Route
                path="/unauthorized"
                element={<Unauthorized />}
            />

        </Routes>
    );
}