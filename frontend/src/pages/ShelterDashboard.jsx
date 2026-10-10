
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
    Mail,
    Pencil,
    Trash2
} from "lucide-react";

import {
    getShelterAdoptionRequests,
    updateAdoptionRequestStatus
} from "../services/adoptionService";

import {
    getPets,
    createPet,
    updatePet,
    deletePet
} from "../services/petService";

import "./ShelterDashboard.css";

const emptyPetForm = {
    name: "",
    species: "Dog",
    breed: "",
    age: "",
    gender: "Male",
    vaccinated: false,
    description: "",
    location: "",
    image: null
};

function ShelterDashboard() {
    const navigate = useNavigate();

    const [requests, setRequests] = useState([]);
    const [pets, setPets] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);

    const [petFormOpen, setPetFormOpen] = useState(false);
    const [editingPet, setEditingPet] = useState(null);
    const [petForm, setPetForm] = useState({ ...emptyPetForm });
    const [savingPet, setSavingPet] = useState(false);
    const [updatingRequestId, setUpdatingRequestId] = useState(null);

    const token = localStorage.getItem("token");

    // Load pets and adoption requests
    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            const [requestData, petData] = await Promise.all([
                getShelterAdoptionRequests(token),
                getPets()
            ]);

            setRequests(requestData.requests || []);

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
                err.message || "Failed to load shelter dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }

        loadDashboard();
        // Initial load when the authenticated session is available.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token, navigate]);

    // Open a blank form to add a pet
    const openAddPetForm = () => {
        setEditingPet(null);
        setPetForm({ ...emptyPetForm });
        setError("");
        setPetFormOpen(true);
    };

    // Open the form with existing pet information
    const openEditPetForm = (pet) => {
        setEditingPet(pet);

        setPetForm({
            name: pet.name || "",
            species: pet.species || "Dog",
            breed: pet.breed || "",
            age: pet.age ?? "",
            gender: pet.gender || "Male",
            vaccinated: Boolean(pet.vaccinated),
            description: pet.description || "",
            location: pet.location || "",
            image: null
        });

        setError("");
        setPetFormOpen(true);
    };

    // Handle form input changes
    const handlePetFormChange = (event) => {
        const { name, value, type, checked, files } = event.target;

        setPetForm((previous) => ({
            ...previous,
            [name]:
                type === "checkbox"
                    ? checked
                    : type === "file"
                        ? files?.[0] || null
                        : value
        }));
    };

    // Add a new pet or update an existing pet
    const handlePetSubmit = async (event) => {
        event.preventDefault();

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setSavingPet(true);
            setError("");

            if (editingPet) {
                const {
                    image,
                    ...petData
                } = petForm;

                await updatePet(
                    editingPet._id,
                    petData,
                    token
                );
            } else {
                const formData = new FormData();

                Object.entries(petForm).forEach(([key, value]) => {
                    if (key !== "image" && value !== null) {
                        formData.append(key, String(value));
                    }
                });

                if (petForm.image) {
                    formData.append("image", petForm.image);
                }

                await createPet(formData, token);
            }

            setPetFormOpen(false);
            setEditingPet(null);
            setPetForm({ ...emptyPetForm });

            await loadDashboard();

            alert(
                editingPet
                    ? "Pet updated successfully!"
                    : "Pet added successfully!"
            );
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to save pet.");
        } finally {
            setSavingPet(false);
        }
    };

    // Delete a pet after confirmation
    const handleDeletePet = async (pet) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${pet.name}?`
        );

        if (!confirmed) return;

        try {
            setError("");

            await deletePet(pet._id, token);
            await loadDashboard();

            alert("Pet deleted successfully!");
        } catch (err) {
            console.error(err);
            setError(err.message || "Failed to delete pet.");
        }
    };

    // Approve or reject an adoption request
    const handleStatusUpdate = async (requestId, status) => {
        try {
            setUpdatingRequestId(requestId);
            setError("");

            await updateAdoptionRequestStatus(
                requestId,
                status,
                token
            );

            await loadDashboard();
        } catch (err) {
            alert(
                err.message ||
                "Failed to update adoption request."
            );
        } finally {
            setUpdatingRequestId(null);
        }
    };

    // Log out
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    // Dashboard statistics
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
                        type="button"
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
                        onClick={() => setSidebarOpen(false)}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </Link>

                    <Link
                        to="/pets"
                        className="sidebar-link"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <PawPrint size={20} />
                        Browse Pets
                    </Link>

                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={() => {
                            setSidebarOpen(false);
                            document
                                .getElementById("shelter-pets")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });
                        }}
                    >
                        <PawPrint size={20} />
                        My Pets
                    </button>

                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={() => {
                            setSidebarOpen(false);
                            document
                                .getElementById("adoption-requests")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                });
                        }}
                    >
                        <ClipboardList size={20} />
                        Requests
                    </button>

                    <button
                        type="button"
                        className="sidebar-link"
                        onClick={openAddPetForm}
                    >
                        <PlusCircle size={20} />
                        Add Pet
                    </button>
                </nav>

                <button
                    type="button"
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
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>

                    <div>
                        <PawPrint size={24} />
                        <span>PawConnect</span>
                    </div>
                </header>

                {/* Welcome section */}
                <section className="shelter-welcome">
                    <div>
                        <span className="welcome-label">
                            SHELTER DASHBOARD
                        </span>

                        <h1>Welcome back! 🐾</h1>

                        <p>
                            Manage your pets and review adoption
                            requests from one place.
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

                {/* Dashboard error */}
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
                            <strong>{pendingRequests}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon approved">
                            <CheckCircle size={22} />
                        </div>

                        <div>
                            <span>Approved</span>
                            <strong>{approvedRequests}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon adopted">
                            <PawPrint size={22} />
                        </div>

                        <div>
                            <span>Adopted Pets</span>
                            <strong>{adoptedPets}</strong>
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
                            <span>YOUR PETS</span>
                            <h2>My Pets</h2>
                        </div>

                        <button
                            type="button"
                            className="add-pet-button"
                            onClick={openAddPetForm}
                        >
                            <PlusCircle size={18} />
                            Add Pet
                        </button>
                    </div>

                    {pets.length === 0 ? (
                        <div className="empty-dashboard">
                            <PawPrint size={40} />

                            <h3>No pets added yet</h3>

                            <p>
                                Add your first pet to start receiving
                                adoption requests.
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
                                                <PawPrint size={40} />
                                            </div>
                                        )}

                                        <span
                                            className={`pet-status ${(
                                                pet.status || "Available"
                                            )
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                        >
                                            {pet.status || "Available"}
                                        </span>
                                    </div>

                                    <div className="shelter-pet-info">
                                        <h3>{pet.name}</h3>

                                        <p>
                                            {pet.breed || pet.species}
                                        </p>

                                        <div className="pet-meta">
                                            <span>
                                                <MapPin size={14} />
                                                {pet.location || "Not specified"}
                                            </span>

                                            <span>
                                                {pet.age} years
                                            </span>
                                        </div>
                                    </div>

                                    <div className="pet-management-actions">
                                        <button
                                            type="button"
                                            className="edit-pet-button"
                                            onClick={() =>
                                                openEditPetForm(pet)
                                            }
                                        >
                                            <Pencil size={16} />
                                            Edit
                                        </button>

                                        <button
                                            type="button"
                                            className="delete-pet-button"
                                            onClick={() =>
                                                handleDeletePet(pet)
                                            }
                                        >
                                            <Trash2 size={16} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Add/Edit Pet modal */}
                {petFormOpen && (
                    <div
                        className="pet-modal-overlay"
                        onMouseDown={(event) => {
                            if (event.target === event.currentTarget) {
                                if (!savingPet) {
                                    setPetFormOpen(false);
                                }
                            }
                        }}
                    >
                        <form
                            className="pet-form-modal"
                            onSubmit={handlePetSubmit}
                        >
                            <div className="pet-form-heading">
                                <div>
                                    <h2>
                                        {editingPet
                                            ? "Edit Pet"
                                            : "Add a New Pet"}
                                    </h2>

                                    <p>
                                        Enter the pet's details below.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    className="pet-form-close"
                                    onClick={() =>
                                        setPetFormOpen(false)
                                    }
                                    disabled={savingPet}
                                    aria-label="Close form"
                                >
                                    <X size={22} />
                                </button>
                            </div>

                            <div className="pet-form-grid">
                                <label>
                                    Pet Name *
                                    <input
                                        name="name"
                                        value={petForm.name}
                                        onChange={handlePetFormChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Species *
                                    <select
                                        name="species"
                                        value={petForm.species}
                                        onChange={handlePetFormChange}
                                        required
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Bird">Bird</option>
                                        <option value="Rabbit">Rabbit</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </label>

                                <label>
                                    Breed
                                    <input
                                        name="breed"
                                        value={petForm.breed}
                                        onChange={handlePetFormChange}
                                    />
                                </label>

                                <label>
                                    Age (years) *
                                    <input
                                        type="number"
                                        name="age"
                                        min="0"
                                        value={petForm.age}
                                        onChange={handlePetFormChange}
                                        required
                                    />
                                </label>

                                <label>
                                    Gender *
                                    <select
                                        name="gender"
                                        value={petForm.gender}
                                        onChange={handlePetFormChange}
                                        required
                                    >
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </label>

                                <label>
                                    Location *
                                    <input
                                        name="location"
                                        value={petForm.location}
                                        onChange={handlePetFormChange}
                                        required
                                    />
                                </label>

                                <label className="pet-vaccinated-field">
                                    <input
                                        type="checkbox"
                                        name="vaccinated"
                                        checked={petForm.vaccinated}
                                        onChange={handlePetFormChange}
                                    />
                                    Vaccinated
                                </label>

                                {!editingPet && (
                                    <label className="pet-image-field">
                                        Pet Image
                                        <input
                                            type="file"
                                            name="image"
                                            accept="image/*"
                                            onChange={handlePetFormChange}
                                        />
                                    </label>
                                )}

                                <label className="pet-description-field">
                                    Description
                                    <textarea
                                        name="description"
                                        value={petForm.description}
                                        onChange={handlePetFormChange}
                                        rows={4}
                                        required
                                    />
                                </label>
                            </div>

                            {error && (
                                <div className="dashboard-error">
                                    {error}
                                </div>
                            )}

                            <div className="pet-form-actions">
                                <button
                                    type="button"
                                    className="pet-cancel-button"
                                    onClick={() => {
                                        setPetFormOpen(false);
                                        setError("");
                                    }}
                                    disabled={savingPet}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="add-pet-button"
                                    disabled={savingPet}
                                >
                                    {savingPet
                                        ? "Saving..."
                                        : editingPet
                                            ? "Save Changes"
                                            : "Add Pet"}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Adoption Requests */}
                <section
                    className="dashboard-section"
                    id="adoption-requests"
                >
                    <div className="section-heading">
                        <div>
                            <span>ADOPTION MANAGEMENT</span>
                            <h2>Adoption Requests</h2>
                        </div>

                        <span className="request-count">
                            {requests.length} total
                        </span>
                    </div>

                    {requests.length === 0 ? (
                        <div className="empty-dashboard">
                            <ClipboardList size={40} />

                            <h3>No adoption requests</h3>

                            <p>
                                You don't have any adoption requests yet.
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
                                                alt={request.petId.name || "Pet"}
                                            />
                                        ) : (
                                            <div className="request-no-image">
                                                <PawPrint size={28} />
                                            </div>
                                        )}

                                        <div>
                                            <h3>
                                                {request.petId?.name ||
                                                    "Pet unavailable"}
                                            </h3>

                                            <p>
                                                {request.petId?.breed ||
                                                    request.petId?.species ||
                                                    ""}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="request-adopter">
                                        <div>
                                            <User size={16} />
                                            <span>
                                                {request.userId?.name ||
                                                    "Unknown adopter"}
                                            </span>
                                        </div>

                                        <div>
                                            <Mail size={16} />
                                            <span>
                                                {request.userId?.email ||
                                                    "No email"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="request-status-area">
                                        <span
                                            className={`request-status ${
                                                (request.status || "Pending")
                                                    .toLowerCase()
                                            }`}
                                        >
                                            {request.status}
                                        </span>

                                        {request.status === "Pending" && (
                                            <div className="request-actions">
                                                <button
                                                    type="button"
                                                    className="approve-button"
                                                    disabled={
                                                        updatingRequestId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            request._id,
                                                            "Approved"
                                                        )
                                                    }
                                                >
                                                    <CheckCircle size={17} />
                                                    {updatingRequestId ===
                                                    request._id
                                                        ? "Updating..."
                                                        : "Approve"}
                                                </button>

                                                <button
                                                    type="button"
                                                    className="reject-button"
                                                    disabled={
                                                        updatingRequestId ===
                                                        request._id
                                                    }
                                                    onClick={() =>
                                                        handleStatusUpdate(
                                                            request._id,
                                                            "Rejected"
                                                        )
                                                    }
                                                >
                                                    <XCircle size={17} />
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
