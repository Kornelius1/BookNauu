import { createBrowserRouter } from "react-router-dom";

import AppLayout from "@/components/layout/AppLayout";


import Dashboard from "@/pages/Dashboard";
import Rooms from "@/pages/Rooms";
import Reservation from "@/pages/Reservation";
import NotFound from "@/pages/NotFound";
import Users from "@/pages/Users";
import Login from "@/pages/Login";
import Unauthorized from "@/pages/Unauthorized.tsx";
import ProtectedRoute from "@/routes/ProtectedRoute.tsx";
import Register from "@/pages/Register.tsx";


export const router = createBrowserRouter([
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/unauthorized",
        element: <Unauthorized />,
    },
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <AppLayout />,
                children: [
                    {
                        index: true,
                        element: <Dashboard />,
                    },
                    {
                        path: "dashboard",
                        element: <Dashboard />,
                    },
                    {
                        path: "rooms",
                        element: <Rooms />,
                    },
                    {
                        path: "reservations",
                        element: <Reservation />,
                    },
                    {
                        path: "users",
                        element: <Users />,
                    },
                ],
            },
        ],
    },
    {
        path: "*",
        element: <NotFound />,
    },
]);