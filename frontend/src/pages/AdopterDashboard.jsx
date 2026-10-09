import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    PawPrint,
    Heart,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    ArrowRight,
    LogOut,
    User
} from "lucide-react";

import { getMyAdoptionRequests } from "../services/adoptionService";
import "./AdopterDashboard.css";

function AdopterDashboard() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const data = await getMyAdoptionRequests(token);

            setRequests(data.requests || []);
        } catch (err) {
            console.error(err);
            setError(
                err.message || "Unable to load your adoption requests."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const pendingCount = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approvedCount = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const rejectedCount = requests.filter(
        (request) => request.status === "Rejected"
    ).length;

    const getStatusIcon = (status) => {
        if (status === "Approved") {
            return <CheckCircle size={16} />;
        }

        if (status === "Rejected") {
            return <XCircle size={16} />;
        }

        return <Clock size={16} />;
    };

    return (
        <main className="dashboard-page">

            <div className="dashboard-container">

                {/* ================= SIDEBAR ================= */}

                <aside className="dashboard-sidebar">

                    <Link
                        to="/"
                        className="dashboard-logo"
                    >
                        <div className="dashboard-logo-icon">
                            <PawPrint size={21} />
                        </div>

                        <span>PawConnect</span>
                    </Link>


                    <nav className="dashboard-nav">

                        <Link
                            to="/dashboard"
                            className="dashboard-nav-item active"
                        >
                            <PawPrint size={18} />
                            Dashboard
                        </Link>

                        <Link
                            to="/pets"
                            className="dashboard-nav-item"
                        >
                            <Heart size={18} />
                            Browse Pets
                        </Link>

                        <button
                            className="dashboard-nav-item logout-item"
                            onClick={handleLogout}
                        >
                            <LogOut size={18} />
                            Logout
                        </button>

                    </nav>

                </aside>


                {/* ================= MAIN ================= */}

                <section className="dashboard-main">

                    <header className="dashboard-header">

                        <div>

                            <span className="dashboard-eyebrow">
                                ADOPTER DASHBOARD
                            </span>

                            <h1>
                                Welcome back! 👋
                            </h1>

                            <p>
                                Keep track of your adoption journey
                                and find your perfect companion.
                            </p>

                        </div>

                        <div className="profile-icon">
                            <User size={21} />
                        </div>

                    </header>


                    {/* ================= STATS ================= */}

                    <div className="dashboard-stats">

                        <div className="dashboard-stat">

                            <div className="stat-icon">
                                <PawPrint size={21} />
                            </div>

                            <div>
                                <span>Total Requests</span>
                                <strong>{requests.length}</strong>
                            </div>

                        </div>


                        <div className="dashboard-stat">

                            <div className="stat-icon pending">
                                <Clock size={21} />
                            </div>

                            <div>
                                <span>Pending</span>
                                <strong>{pendingCount}</strong>
                            </div>

                        </div>


                        <div className="dashboard-stat">

                            <div className="stat-icon approved">
                                <CheckCircle size={21} />
                            </div>

                            <div>
                                <span>Approved</span>
                                <strong>{approvedCount}</strong>
                            </div>

                        </div>


                        <div className="dashboard-stat">

                            <div className="stat-icon rejected">
                                <XCircle size={21} />
                            </div>

                            <div>
                                <span>Rejected</span>
                                <strong>{rejectedCount}</strong>
                            </div>

                        </div>

                    </div>


                    {/* ================= REQUESTS ================= */}

                    <section className="requests-section">

                        <div className="section-title-row">

                            <div>
                                <h2>
                                    My Adoption Requests
                                </h2>

                                <p>
                                    Track the status of your applications.
                                </p>
                            </div>

                            <Link
                                to="/pets"
                                className="browse-more"
                            >
                                Browse Pets
                                <ArrowRight size={16} />
                            </Link>

                        </div>


                        {loading && (

                            <div className="dashboard-message">

                                <PawPrint size={30} />

                                <p>
                                    Loading your adoption requests...
                                </p>

                            </div>

                        )}


                        {!loading && error && (

                            <div className="dashboard-message error">

                                <XCircle size={30} />

                                <p>{error}</p>

                                <button onClick={loadRequests}>
                                    Try Again
                                </button>

                            </div>

                        )}


                        {!loading &&
                            !error &&
                            requests.length === 0 && (

                                <div className="empty-dashboard">

                                    <div className="empty-dashboard-icon">
                                        <Heart size={30} />
                                    </div>

                                    <h3>
                                        No adoption requests yet
                                    </h3>

                                    <p>
                                        Find a pet you love and start
                                        your adoption journey.
                                    </p>

                                    <Link
                                        to="/pets"
                                        className="find-pet-button"
                                    >
                                        Find a Pet
                                        <ArrowRight size={17} />
                                    </Link>

                                </div>

                            )}


                        {!loading &&
                            !error &&
                            requests.length > 0 && (

                                <div className="request-list">

                                    {requests.map((request) => {

                                        const pet = request.petId;

                                        return (
                                            <article
                                                className="request-card"
                                                key={request._id}
                                            >

                                                <div className="request-pet-image">

                                                    {pet?.imageURL ? (

                                                        <img
                                                            src={`http://127.0.0.1:5000${pet.imageURL}`}
                                                            alt={pet.name}
                                                        />

                                                    ) : (

                                                        <PawPrint size={35} />

                                                    )}

                                                </div>


                                                <div className="request-pet-info">

                                                    <h3>
                                                        {pet?.name ||
                                                            "Pet"}
                                                    </h3>

                                                    <p>
                                                        {pet?.species}
                                                        {" • "}
                                                        {pet?.breed}
                                                    </p>

                                                    <span>
                                                        <MapPin size={13} />
                                                        {pet?.location ||
                                                            "Location unavailable"}
                                                    </span>

                                                </div>


                                                <div className="request-status">

                                                    <span
                                                        className={`status-badge ${request.status.toLowerCase()}`}
                                                    >
                                                        {getStatusIcon(
                                                            request.status
                                                        )}

                                                        {request.status}
                                                    </span>

                                                    <small>
                                                        Requested{" "}
                                                        {new Date(
                                                            request.requestDate ||
                                                            request.createdAt
                                                        ).toLocaleDateString()}
                                                    </small>

                                                </div>


                                                {pet?._id && (

                                                    <Link
                                                        to={`/pets/${pet._id}`}
                                                        className="request-view"
                                                    >
                                                        <ArrowRight size={18} />
                                                    </Link>

                                                )}

                                            </article>
                                        );
                                    })}

                                </div>

                            )}

                    </section>

                </section>

            </div>

        </main>
    );
}

export default AdopterDashboard;