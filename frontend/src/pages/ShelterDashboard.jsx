import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    PawPrint,
    ClipboardList,
    PlusCircle,
    LogOut,
    CheckCircle,
    XCircle,
    Clock,
    Menu,
    X,
    MapPin,
    User,
    Mail
} from "lucide-react";

import {
    getShelterAdoptionRequests,
    updateAdoptionRequestStatus
} from "../services/adoptionService";

import { getPets } from "../services/petService";

import "./ShelterDashboard.css";

function ShelterDashboard() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [pets, setPets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();
    }, [token, navigate]);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [requestData, petData] = await Promise.all([
                getShelterAdoptionRequests(token),
                getPets()
            ]);

            setRequests(requestData.requests || []);

            // Only display pets owned by this shelter.
            // The backend pet API currently returns all pets,
            // so we identify the shelter's pets using ownerId.
            const user = JSON.parse(
                localStorage.getItem("user") || "{}"
            );

            const shelterPets = (petData.pets || []).filter(
                (pet) =>
                    pet.ownerId &&
                    user.id &&
                    pet.ownerId.toString() === user.id.toString()
            );

            setPets(shelterPets);

        } catch (err) {
            console.error(err);
            setError(
                err.message || "Failed to load shelter dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (requestId, status) => {
        try {
            await updateAdoptionRequestStatus(
                requestId,
                status,
                token
            );

            await loadDashboard();

        } catch (err) {
            alert(
                err.message ||
                "Failed to update adoption request"
            );
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    const pendingRequests = requests.filter(
        (request) => request.status === "Pending"
    ).length;

    const approvedRequests = requests.filter(
        (request) => request.status === "Approved"
    ).length;

    const adoptedPets = pets.filter(
        (pet) => pet.status === "Adopted"
    ).length;

    if (loading) {
        return (
            <div className="shelter-loading">
                <div className="loading-spinner"></div>
                <p>Loading shelter dashboard...</p>
            </div>
        );
    }

    return (
        <div className="shelter-dashboard">

            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`shelter-sidebar ${
                    sidebarOpen ? "open" : ""
                }`}
            >
                <div className="sidebar-logo">
                    <PawPrint size={28} />
                    <span>PawConnect</span>

                    <button
                        className="close-sidebar"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={22} />
                    </button>
                </div>

                <div className="sidebar-role">
                    Shelter Panel
                </div>

                <nav className="sidebar-nav">

                    <Link
                        to="/shelter-dashboard"
                        className="sidebar-link active"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link
                        to="/pets"
                        className="sidebar-link"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >
                        <PawPrint size={20} />
                        Browse Pets
                    </Link>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            document
                                .getElementById(
                                    "shelter-pets"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        <PawPrint size={20} />
                        My Pets
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            document
                                .getElementById(
                                    "adoption-requests"
                                )
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        <ClipboardList size={20} />
                        Requests
                    </button>

                    <button
                        className="sidebar-link"
                        onClick={() =>
                            alert(
                                "Add Pet form will be added next."
                            )
                        }
                    >
                        <PlusCircle size={20} />
                        Add Pet
                    </button>

                </nav>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    <LogOut size={20} />
                    Logout
                </button>
            </aside>


            {/* Main content */}
            <main className="shelter-main">

                {/* Mobile header */}
                <header className="mobile-dashboard-header">

                    <button
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >
                        <Menu size={24} />
                    </button>

                    <div>
                        <PawPrint size={24} />
                        <span>PawConnect</span>
                    </div>

                </header>


                {/* Top section */}
                <section className="shelter-welcome">

                    <div>
                        <span className="welcome-label">
                            SHELTER DASHBOARD
                        </span>

                        <h1>
                            Welcome back! 🐾
                        </h1>

                        <p>
                            Manage your pets and review
                            adoption requests from one place.
                        </p>
                    </div>

                    <Link
                        to="/pets"
                        className="browse-button"
                    >
                        <PawPrint size={18} />
                        Browse Pets
                    </Link>

                </section>


                {/* Error */}
                {error && (
                    <div className="dashboard-error">
                        {error}
                    </div>
                )}


                {/* Statistics */}
                <section className="shelter-stats">

                    <div className="stat-card">
                        <div className="stat-icon pets">
                            <PawPrint size={22} />
                        </div>

                        <div>
                            <span>My Pets</span>
                            <strong>{pets.length}</strong>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <Clock size={22} />
                        </div>

                        <div>
                            <span>Pending Requests</span>
                            <strong>
                                {pendingRequests}
                            </strong>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon approved">
                            <CheckCircle size={22} />
                        </div>

                        <div>
                            <span>Approved</span>
                            <strong>
                                {approvedRequests}
                            </strong>
                        </div>
                    </div>


                    <div className="stat-card">
                        <div className="stat-icon adopted">
                            <PawPrint size={22} />
                        </div>

                        <div>
                            <span>Adopted Pets</span>
                            <strong>
                                {adoptedPets}
                            </strong>
                        </div>
                    </div>

                </section>


                {/* My Pets */}
                <section
                    className="dashboard-section"
                    id="shelter-pets"
                >

                    <div className="section-heading">

                        <div>
                            <span>
                                YOUR PETS
                            </span>

                            <h2>
                                My Pets
                            </h2>
                        </div>

                        <button
                            className="add-pet-button"
                            onClick={() =>
                                alert(
                                    "Add Pet form will be added next."
                                )
                            }
                        >
                            <PlusCircle size={18} />
                            Add Pet
                        </button>

                    </div>


                    {pets.length === 0 ? (

                        <div className="empty-dashboard">
                            <PawPrint size={40} />

                            <h3>
                                No pets added yet
                            </h3>

                            <p>
                                Add your first pet to start
                                receiving adoption requests.
                            </p>

                        </div>

                    ) : (

                        <div className="shelter-pet-grid">

                            {pets.map((pet) => (

                                <div
                                    className="shelter-pet-card"
                                    key={pet._id}
                                >

                                    <div className="pet-image-wrapper">

                                        {pet.imageURL ? (
                                            <img
                                                src={`http://127.0.0.1:5000${pet.imageURL}`}
                                                alt={pet.name}
                                            />
                                        ) : (
                                            <div className="no-pet-image">
                                                <PawPrint
                                                    size={40}
                                                />
                                            </div>
                                        )}

                                        <span
                                            className={`pet-status ${pet.status
                                                .toLowerCase()
                                                .replace(
                                                    " ",
                                                    "-"
                                                )}`}
                                        >
                                            {pet.status}
                                        </span>

                                    </div>


                                    <div className="shelter-pet-info">

                                        <h3>
                                            {pet.name}
                                        </h3>

                                        <p>
                                            {pet.breed ||
                                                pet.species}
                                        </p>

                                        <div className="pet-meta">

                                            <span>
                                                <MapPin
                                                    size={14}
                                                />
                                                {pet.location}
                                            </span>

                                            <span>
                                                {pet.age} years
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>


                {/* Adoption Requests */}
                <section
                    className="dashboard-section"
                    id="adoption-requests"
                >

                    <div className="section-heading">

                        <div>
                            <span>
                                ADOPTION MANAGEMENT
                            </span>

                            <h2>
                                Adoption Requests
                            </h2>
                        </div>

                        <span className="request-count">
                            {requests.length} total
                        </span>

                    </div>


                    {requests.length === 0 ? (

                        <div className="empty-dashboard">

                            <ClipboardList
                                size={40}
                            />

                            <h3>
                                No adoption requests
                            </h3>

                            <p>
                                You don't have any adoption
                                requests yet.
                            </p>

                        </div>

                    ) : (

                        <div className="requests-list">

                            {requests.map((request) => (

                                <div
                                    className="request-card"
                                    key={request._id}
                                >

                                    <div className="request-pet">

                                        {request.petId?.imageURL ? (
                                            <img
                                                src={`http://127.0.0.1:5000${request.petId.imageURL}`}
                                                alt={
                                                    request.petId
                                                        .name
                                                }
                                            />
                                        ) : (
                                            <div className="request-no-image">
                                                <PawPrint
                                                    size={28}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <h3>
                                                {
                                                    request
                                                        .petId
                                                        ?.name
                                                }
                                            </h3>

                                            <p>
                                                {
                                                    request
                                                        .petId
                                                        ?.breed
                                                }
                                            </p>
                                        </div>

                                    </div>


                                    <div className="request-adopter">

                                        <div>
                                            <User size={16} />

                                            <span>
                                                {
                                                    request
                                                        .userId
                                                        ?.name ||
                                                    "Unknown adopter"
                                                }
                                            </span>
                                        </div>

                                        <div>
                                            <Mail size={16} />

                                            <span>
                                                {
                                                    request
                                                        .userId
                                                        ?.email ||
                                                    "No email"
                                                }
                                            </span>
                                        </div>

                                    </div>


                                    <div className="request-status-area">

                                        <span
                                            className={`request-status ${request.status.toLowerCase()}`}
                                        >
                                            {request.status}
                                        </span>


                                        {request.status ===
                                            "Pending" && (

                                            <div className="request-actions">

                                                <button
                                                    className="approve-button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            request._id,
                                                            "Approved"
                                                        )
                                                    }
                                                >
                                                    <CheckCircle
                                                        size={17}
                                                    />
                                                    Approve
                                                </button>

                                                <button
                                                    className="reject-button"
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            request._id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    <XCircle
                                                        size={17}
                                                    />
                                                    Reject
                                                </button>

                                            </div>

                                        )}

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default ShelterDashboard;