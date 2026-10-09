import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    MapPin,
    PawPrint,
    ShieldCheck,
    CalendarDays,
    VenusAndMars,
    CheckCircle,
    AlertCircle
} from "lucide-react";

import { getPetById } from "../services/petService";
import { createAdoptionRequest } from "../services/adoptionService";

import "./PetDetails.css";

function PetDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [pet, setPet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [requestMessage, setRequestMessage] = useState("");
    const [requestError, setRequestError] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [favorite, setFavorite] = useState(false);

    useEffect(() => {
        const loadPet = async () => {
            try {
                setLoading(true);
                setError("");

                const data = await getPetById(id);
                setPet(data.pet);
            } catch (err) {
                console.error(err);
                setError("Unable to load pet details.");
            } finally {
                setLoading(false);
            }
        };

        loadPet();
    }, [id]);

    const handleAdoptionRequest = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setSubmitting(true);
            setRequestMessage("");
            setRequestError("");

            await createAdoptionRequest(pet._id, token);

            setRequestMessage(
                "Your adoption request has been submitted successfully!"
            );

        } catch (err) {
            setRequestError(
                err.message || "Unable to submit adoption request."
            );
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <main className="details-page-state">
                <div className="state-icon">
                    <PawPrint size={32} />
                </div>

                <h2>Loading pet details...</h2>
                <p>Please wait while we find your companion.</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="details-page-state error-state">

                <div className="state-icon">
                    <AlertCircle size={32} />
                </div>

                <h2>Something went wrong</h2>
                <p>{error}</p>

                <Link to="/pets" className="back-button">
                    <ArrowLeft size={17} />
                    Back to Pets
                </Link>

            </main>
        );
    }

    if (!pet) {
        return (
            <main className="details-page-state">

                <div className="state-icon">
                    <PawPrint size={32} />
                </div>

                <h2>Pet not found</h2>

                <Link to="/pets" className="back-button">
                    <ArrowLeft size={17} />
                    Back to Pets
                </Link>

            </main>
        );
    }

    return (
        <main className="pet-details-page">

            {/* ================= BACK ================= */}

            <div className="details-container">

                <Link to="/pets" className="back-link">
                    <ArrowLeft size={18} />
                    Back to Browse Pets
                </Link>


                {/* ================= MAIN CARD ================= */}

                <section className="pet-details-card">

                    {/* IMAGE */}

                    <div className="details-image-wrapper">

                        {pet.imageURL ? (

                            <img
                                className="pet-details-image"
                                src={`http://127.0.0.1:5000${pet.imageURL}`}
                                alt={pet.name}
                            />

                        ) : (

                            <div className="details-image-placeholder">
                                <PawPrint size={70} />
                            </div>

                        )}

                        <button
                            className={`details-favorite ${
                                favorite ? "active" : ""
                            }`}
                            onClick={() => setFavorite(!favorite)}
                            aria-label="Add to favorites"
                        >
                            <Heart
                                size={23}
                                fill={
                                    favorite
                                        ? "currentColor"
                                        : "none"
                                }
                            />
                        </button>

                        <span
                            className={`details-status ${pet.status.toLowerCase()}`}
                        >
                            {pet.status}
                        </span>

                    </div>


                    {/* INFORMATION */}

                    <div className="pet-details-info">

                        <span className="details-species">
                            {pet.species}
                        </span>

                        <h1>{pet.name}</h1>

                        <p className="details-breed">
                            {pet.breed}
                        </p>


                        {/* Quick Info */}

                        <div className="quick-info">

                            <div className="quick-info-item">

                                <CalendarDays size={19} />

                                <div>
                                    <span>Age</span>
                                    <strong>
                                        {pet.age}{" "}
                                        {pet.age === 1
                                            ? "year"
                                            : "years"}
                                    </strong>
                                </div>

                            </div>


                            <div className="quick-info-item">

                                <VenusAndMars size={19} />

                                <div>
                                    <span>Gender</span>
                                    <strong>
                                        {pet.gender}
                                    </strong>
                                </div>

                            </div>


                            <div className="quick-info-item">

                                <MapPin size={19} />

                                <div>
                                    <span>Location</span>
                                    <strong>
                                        {pet.location}
                                    </strong>
                                </div>

                            </div>


                            <div className="quick-info-item">

                                <ShieldCheck size={19} />

                                <div>
                                    <span>Vaccinated</span>
                                    <strong>
                                        {pet.vaccinated
                                            ? "Yes"
                                            : "No"}
                                    </strong>
                                </div>

                            </div>

                        </div>


                        {/* Description */}

                        <div className="description-section">

                            <h2>About {pet.name}</h2>

                            <p>
                                {pet.description}
                            </p>

                        </div>


                        {/* Adoption */}

                        {pet.status === "Available" && (

                            <div className="adoption-section">

                                <div className="adoption-text">

                                    <PawPrint size={21} />

                                    <div>
                                        <strong>
                                            Give {pet.name} a loving home
                                        </strong>

                                        <span>
                                            Submit an adoption request
                                            to get started.
                                        </span>
                                    </div>

                                </div>

                                <button
                                    className="adopt-button"
                                    onClick={handleAdoptionRequest}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : `Adopt ${pet.name}`}
                                </button>

                            </div>

                        )}


                        {/* Success */}

                        {requestMessage && (

                            <div className="request-message success">

                                <CheckCircle size={20} />

                                <span>
                                    {requestMessage}
                                </span>

                            </div>

                        )}


                        {/* Error */}

                        {requestError && (

                            <div className="request-message failure">

                                <AlertCircle size={20} />

                                <span>
                                    {requestError}
                                </span>

                            </div>

                        )}


                        {/* Non Available */}

                        {pet.status !== "Available" && (

                            <div className="unavailable-message">

                                <AlertCircle size={19} />

                                <span>
                                    This pet is currently{" "}
                                    <strong>
                                        {pet.status.toLowerCase()}
                                    </strong>
                                    .
                                </span>

                            </div>

                        )}

                    </div>

                </section>

            </div>

        </main>
    );
}

export default PetDetails;