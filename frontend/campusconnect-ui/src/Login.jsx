import React, { useState } from "react";
import api from "./api";

function Login({ onLogin }) {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const response = await api.post("/auth/login", {
                email: email.trim(),
                password
            });

            const data = response.data;

            localStorage.setItem("token", data.token);

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                })
            );

            onLogin(data);

        } catch (err) {

            console.error("Login error:", err);

            const message =
                err.response?.data?.message ||
                "Unable to login. Please check your email and password.";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <div className="login-card">

                <div className="login-brand">
                    <div className="brand-name">
                        CampusConnect <span>AI</span>
                    </div>

                    <p className="login-subtitle">
                        Smart Student Intelligence Platform
                    </p>
                </div>

                <div className="login-heading">
                    <h2>Welcome back</h2>

                    <p>
                        Sign in to continue to your dashboard
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">

                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                    />

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        required
                    />

                    {error && (
                        <div className="login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Login;