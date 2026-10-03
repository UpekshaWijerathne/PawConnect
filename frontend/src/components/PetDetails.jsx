import { useEffect, useState } from "react";
import { useParams , useNavigate} from "react-router-dom";
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

    useEffect(() => {
        const loadPet = async () => {
            try {
                const data = await getPetById(id);
                setPet(data.pet);
            } catch (error) {
                setError(error.message);
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
            setRequestMessage("");
            setRequestError("");

            await createAdoptionRequest(pet._id, token);

            setRequestMessage(
                "Adoption request submitted successfully!"
            );

        } catch (error) {
            setRequestError(error.message);
        }
    };

    if (loading) {
        return <p>Loading pet details...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!pet) {
        return <p>Pet not found.</p>;
    }

    return (
        <div className="pet-details">

            <div className="pet-details-card">

                <div>
                    {pet.imageURL && (
                        <img
                            className="pet-details-image"
                            src={`http://127.0.0.1:5000${pet.imageURL}`}
                            alt={pet.name}
                        />
                    )}
                </div>

                <div className="pet-details-info">

                    <h1>{pet.name}</h1>

                    <h2>{pet.breed}</h2>

                    <div className="pet-info">
                        <p>🐾 Species: {pet.species}</p>
                        <p>🎂 Age: {pet.age} years</p>
                        <p>⚥ Gender: {pet.gender}</p>
                        <p>📍 Location: {pet.location}</p>

                        <p>
                            💉 Vaccinated:{" "}
                            {pet.vaccinated ? "Yes" : "No"}
                        </p>
                    </div>

                    <span className="pet-status">
                        {pet.status}
                    </span>

                    {pet.status === "Available" && (
                        <button onClick={handleAdoptionRequest}>
                            🐾 Request Adoption
                        </button>
                    )}

                    {requestMessage && (
                        <p>{requestMessage}</p>
                    )}

                    {requestError && (
                        <p>{requestError}</p>
                    )}

                    <h3>Description</h3>

                    <p className="pet-description">
                        {pet.description}
                    </p>

                    <h3>Description</h3>

                    <p className="pet-description">
                        {pet.description}
                    </p>

                </div>

            </div>

        </div>
    );
}

export default PetDetails;