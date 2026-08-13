import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    CheckCircle2,
    CircleAlert,
    Loader2,
    UserRound,
    LockKeyhole,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AcceptInvitation() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!token) {
            setError("Invalid invitation link.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch(
                "http://localhost:8080/api/v1/business/team/invitations/accept",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        token,
                        fullName,
                        password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to accept invitation."
                );
            }

            setSuccess(true);
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Something went wrong."
            );
        } finally {
            setLoading(false);
        }
    };

    /*
     * Invalid invitation
     */
    if (!token) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
                <div className="w-full max-w-md text-center">
                    <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                        <CircleAlert size={28} />
                    </div>

                    <h1 className="text-2xl font-semibold">
                        Invalid Invitation
                    </h1>

                    <p className="mt-2 text-sm text-zinc-400">
                        This invitation link is invalid or incomplete.
                    </p>

                    <Button
                        className="mt-6 bg-white text-black hover:bg-zinc-200"
                    >
                        <Link to="/login">
                            Back to Login
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    /*
     * Success
     */
    if (success) {
        return (
            <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">
                <div className="w-full max-w-md">
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-8 text-center shadow-2xl">
                        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                            <CheckCircle2 size={30} />
                        </div>

                        <h1 className="text-2xl font-semibold">
                            Invitation Accepted
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-zinc-400">
                            Your administrator account has been created
                            successfully.
                        </p>

                        <p className="mt-1 text-sm text-zinc-400">
                            You can now sign in to BookNauu.
                        </p>

                        <Button
                            className="mt-7 h-11 w-full bg-white text-black hover:bg-zinc-200"
                        >
                            <Link to="/login">
                                Go to Login
                            </Link>
                        </Button>
                    </div>

                    <p className="mt-6 text-center text-xs text-zinc-600">
                        © {new Date().getFullYear()} BookNauu
                    </p>
                </div>
            </div>
        );
    }

    /*
     * Main invitation page
     */
    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="flex min-h-screen items-center justify-center px-4 py-12">
                <div className="w-full max-w-md">

                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-black shadow-lg">
                            <CalendarDays size={26} />
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight">
                            BookNauu
                        </h1>

                        <p className="mt-2 text-sm text-zinc-400">
                            Team invitation
                        </p>
                    </div>

                    {/* Card */}
                    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/70 p-6 shadow-2xl sm:p-8">

                        {/* Header */}
                        <div className="mb-7">
                            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                                <UserRound size={20} />
                            </div>

                            <h2 className="text-xl font-semibold">
                                Accept Invitation
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                You have been invited to join a BookNauu
                                business as an administrator.
                            </p>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-5 flex gap-3 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                                <CircleAlert
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <p>{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                        >
                            {/* Full name */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="fullName"
                                    className="text-sm font-medium text-zinc-200"
                                >
                                    Full Name
                                </label>

                                <Input
                                    id="fullName"
                                    type="text"
                                    placeholder="John Doe"
                                    value={fullName}
                                    onChange={(event) =>
                                        setFullName(event.target.value)
                                    }
                                    disabled={loading}
                                    required
                                    className="h-11 border-zinc-800 bg-zinc-950 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium text-zinc-200"
                                >
                                    Password
                                </label>

                                <div className="relative">
                                    <LockKeyhole
                                        size={17}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600"
                                    />

                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Create a password"
                                        value={password}
                                        onChange={(event) =>
                                            setPassword(event.target.value)
                                        }
                                        minLength={8}
                                        disabled={loading}
                                        required
                                        className="h-11 border-zinc-800 bg-zinc-950 pl-10 text-white placeholder:text-zinc-600 focus-visible:ring-blue-500"
                                    />
                                </div>

                                <p className="text-xs text-zinc-600">
                                    Password must be at least 8 characters.
                                </p>
                            </div>

                            {/* Submit */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="h-11 w-full bg-white text-black hover:bg-zinc-200"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={17}
                                            className="mr-2 animate-spin"
                                        />
                                        Creating account...
                                    </>
                                ) : (
                                    "Accept Invitation"
                                )}
                            </Button>
                        </form>
                    </div>

                    {/* Footer */}
                    <p className="mt-6 text-center text-xs text-zinc-600">
                        By creating an account, you agree to BookNauu's
                        terms and privacy policy.
                    </p>
                </div>
            </div>
        </div>
    );
}