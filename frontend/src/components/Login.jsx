import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService";
import authDecoration from "../assets/auth-decoration.png";
import "./Login.css";

/* Small reusable paw icon (inherits colour from CSS `color`) */
function Paw({ className = "" }) {
    return (
        <svg
            className={className}
            viewBox="0 0 64 64"
            fill="currentColor"
            aria-hidden="true"
        >
            <ellipse cx="13" cy="29" rx="6.5" ry="9" transform="rotate(-22 13 29)" />
            <ellipse cx="26" cy="15" rx="6.5" ry="9" transform="rotate(-8 26 15)" />
            <ellipse cx="40" cy="15" rx="6.5" ry="9" transform="rotate(8 40 15)" />
            <ellipse cx="53" cy="29" rx="6.5" ry="9" transform="rotate(22 53 29)" />
            <path d="M32 31c-9 0-18 9-18 18 0 6 5 8.5 10 7.5 3-.6 5-1.8 8-1.8s5 1.2 8 1.8c5 1 10-1.5 10-7.5 0-9-9-18-18-18z" />
        </svg>
    );
}

function MailIcon() {
    return (
        <svg className="field-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="currentColor" />
            <path
                d="M3.5 7.5 12 13.5l8.5-6"
                stroke="#fbf6f1"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg className="field-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
                d="M7.5 10.5V8a4.5 4.5 0 0 1 9 0v2.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
            <rect x="4.5" y="10" width="15" height="11" rx="2.5" fill="currentColor" />
            <circle cx="12" cy="15" r="1.6" fill="#fbf6f1" />
        </svg>
    );
}

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

                setSuccess("Account created successfully! You can now log in.");

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
                    navigate("/adopter-dashboard");
                }
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            {/* Background decorations */}
            <div className="page-decorations" aria-hidden="true">
                <span className="blob blob-one" />
                <span className="blob blob-two" />
                <span className="blob blob-three" />
                <span className="blob blob-four" />

                <Paw className="deco deco-paw deco-paw-one" />
                <Paw className="deco deco-paw deco-paw-two" />
                <Paw className="deco deco-paw deco-paw-three" />

                <span className="deco deco-heart deco-heart-one">♥</span>
                <span className="deco deco-heart deco-heart-two">♥</span>
                <span className="deco deco-heart deco-heart-three">♥</span>
                <span className="deco deco-heart-outline">♡</span>
            </div>

            <div className="auth-layout">
                {/* Poster card */}
                <aside className="auth-decoration">
                    <img
                        src={authDecoration}
                        alt="A golden retriever puppy and a kitten with the message: Be the reason for a brighter tomorrow"
                    />
                </aside>

                {/* Login / register card */}
                <section className="auth-card">
                    <Link to="/" className="auth-brand">
                        <span className="auth-brand-icon">
                            <Paw />
                        </span>
                        <span className="auth-brand-name">PawConnect</span>
                    </Link>

                    <div className="auth-heading">
                        <p className="auth-eyebrow">Your new best friend awaits</p>

                        <h1>{isRegister ? "Create an account" : "Welcome back!"}</h1>

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
                                <div className="input-wrap">
                                    <input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        autoComplete="name"
                                        className="no-icon"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        <div className="auth-field">
                            <label htmlFor="email">Email address</label>
                            <div className="input-wrap">
                                <MailIcon />
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="password">Password</label>
                            <div className="input-wrap">
                                <LockIcon />
                                <input
                                    id="password"
                                    type="password"
                                    placeholder={
                                        isRegister
                                            ? "At least 8 characters"
                                            : "Enter your password"
                                    }
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete={
                                        isRegister ? "new-password" : "current-password"
                                    }
                                    minLength={isRegister ? 8 : undefined}
                                    required
                                />
                            </div>
                        </div>

                        {isRegister && (
                            <div className="auth-field">
                                <label htmlFor="confirmPassword">Confirm password</label>
                                <div className="input-wrap">
                                    <LockIcon />
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="Enter your password again"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        autoComplete="new-password"
                                        minLength={8}
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {error && (
                            <p className="auth-message auth-error" role="alert">
                                {error}
                            </p>
                        )}

                        {success && (
                            <p className="auth-message auth-success" role="status">
                                {success}
                            </p>
                        )}

                        <button className="auth-submit" type="submit" disabled={loading}>
                            {loading
                                ? "Please wait..."
                                : isRegister
                                    ? "Create Account"
                                    : "Log In"}
                        </button>
                    </form>

                    <p className="auth-switch">
                        {isRegister ? (
                            <>
                                Already have an account?{" "}
                                <button type="button" onClick={() => switchMode(false)}>
                                    Log in
                                </button>
                            </>
                        ) : (
                            <>
                                New to PawConnect?{" "}
                                <button type="button" onClick={() => switchMode(true)}>
                                    Create an account
                                </button>
                            </>
                        )}
                    </p>

                    <div className="auth-divider" aria-hidden="true">
                        <span>♥</span>
                    </div>

                    <p className="auth-footer">
                        Made with <span className="footer-heart">♥</span> for pets waiting
                        for a home.
                    </p>
                </section>
            </div>
        </main>
    );
}

export default Login;