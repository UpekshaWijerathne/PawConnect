import { Link } from "react-router-dom";
import { Heart, Menu, X } from "lucide-react";
import { useState } from "react";
import "./Navbar.css";

function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const dashboardPath =
        user?.role === "shelter"
            ? "/shelter-dashboard"
            : "/dashboard";

    return (
        <header className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <Link
                    to="/"
                    className="navbar-logo"
                    onClick={() => setMenuOpen(false)}
                >
                    <div className="logo-icon">
                        <Heart size={22} fill="currentColor" />
                    </div>
                    <span>PawConnect</span>
                </Link>

                {/* Navigation */}
                <nav className={`nav-links ${menuOpen ? "active" : ""}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>
                        Home
                    </Link>

                    <Link to="/pets" onClick={() => setMenuOpen(false)}>
                        Browse Pets
                    </Link>

                    <a
                        href="/#how-it-works"
                        onClick={() => setMenuOpen(false)}
                    >
                        How It Works
                    </a>

                    <a
                        href="/#about"
                        onClick={() => setMenuOpen(false)}
                    >
                        About
                    </a>

                    {user ? (
                        <Link
                            to={dashboardPath}
                            className="nav-login"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            to="/login"
                            className="nav-login"
                            onClick={() => setMenuOpen(false)}
                        >
                            Login
                        </Link>
                    )}

                    <Link
                        to="/pets"
                        className="nav-adopt"
                        onClick={() => setMenuOpen(false)}
                    >
                        Adopt a Pet
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="mobile-menu"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    {menuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>

            </div>
        </header>
    );
}

export default Navbar;