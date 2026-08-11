import { FormEvent, useState } from "react";

export default function AcceptInvitation() {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event: FormEvent) => {
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

    if (!token) {
        return (
            <div>
                <h1>Invalid Invitation</h1>
                <p>The invitation link is invalid.</p>
            </div>
        );
    }

    if (success) {
        return (
            <div>
                <h1>Invitation Accepted</h1>
                <p>
                    Your account has been created successfully.
                    You can now login.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1>Accept Invitation</h1>

            <p>
                You have been invited to become an administrator.
            </p>

            {error && (
                <div>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="fullName">
                        Full Name
                    </label>

                    <input
                        id="fullName"
                        type="text"
                        value={fullName}
                        onChange={(event) =>
                            setFullName(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(event) =>
                            setPassword(event.target.value)
                        }
                        minLength={8}
                        required
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Accept Invitation"}
                </button>
            </form>
        </div>
    );
}