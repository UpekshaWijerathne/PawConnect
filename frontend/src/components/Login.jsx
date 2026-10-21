
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import authDecoration from "../assets/auth-decoration.png";
import "./Login.css";

function Login() {
    const navigate = useNavigate();

    const [isRegister, setIsRegister] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const switchMode = (registerMode) => {
        setIsRegister(registerMode);
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (isRegister && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (isRegister && password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        try {
            setLoading(true);

            if (isRegister) {
                await registerUser(name, email, password);

                setSuccess(
                    "Account created successfully! You can now log in."
                );

                setIsRegister(false);
                setName("");
                setPassword("");
                setConfirmPassword("");
            } else {
                const data = await loginUser(email, password);
                const role = data.user?.role;

                if (role === "shelter" || role === "admin") {
                    navigate("/shelter-dashboard");
                } else {
                    navigate("/");
                }
            }
        } catch (err) {
            setError(
                err.message || "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-layout">
                {/* Decorative image */}
                <aside className="auth-decoration">
                    <img
                        src={authDecoration}
                        alt="Cute PawConnect pet decoration"
                    />
                </aside>

                {/* Login and registration card */}
                <section className="auth-card">
                    <Link to="/" className="auth-brand">
                        <span className="auth-brand-icon">🐾</span>
                        <span>PawConnect</span>
                    </Link>

                    <div className="auth-heading">
                        <p className="auth-eyebrow">
                            YOUR NEW BEST FRIEND AWAITS
                        </p>

                        <h1>
                            {isRegister
                                ? "Create an account"
                                : "Welcome back!"}
                        </h1>

                        <p className="auth-subtitle">
                            {isRegister
                                ? "Join PawConnect and find your perfect companion."
                                : "Log in to continue your pet adoption journey."}
                        </p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {isRegister && (
                            <div className="auth-field">
                                <label htmlFor="name">Full name</label>

                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Enter your full name"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="email">Email address</label>

                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                autoComplete="email"
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>

                            <input
                                id="password"
                                type="password"
                                placeholder={
                                    isRegister
                                        ? "At least 8 characters"
                                        : "Enter your password"
                                }
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                autoComplete={
                                    isRegister
                                        ? "new-password"
                                        : "current-password"
                                }
                                minLength={isRegister ? 8 : undefined}
                                required
                            />
                        </div>

                        {isRegister && (
                            <div className="auth-field">
                                <label htmlFor="confirmPassword">
                                    Confirm password
                                </label>

                                <input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="Enter your password again"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                />
                            </div>
                        )}

                        {error && (
                            <p
                                className="auth-message auth-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        {success && (
                            <p
                                className="auth-message auth-success"
                                role="status"
                            >
                                {success}
                            </p>
                        )}

                        <button
                            className="auth-submit"
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Please wait..."
                                : isRegister
                                    ? "Create Account"
                                    : "Log In"}
                        </button>
                    </form>

                    <div className="auth-switch">
                        {isRegister ? (
                            <>
                                Already have an account?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode(false)}
                                >
                                    Log in
                                </button>
                            </>
                        ) : (
                            <>
                                New to PawConnect?{" "}
                                <button
                                    type="button"
                                    onClick={() => switchMode(true)}
                                >
                                    Create an account
                                </button>
                            </>
                        )}
                    </div>

                    <p className="auth-footer">
                        Made with ♥ for pets waiting for a home.
                    </p>
                </section>
            </div>
        </main>
    );
}

export default Login;
