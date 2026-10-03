import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPets } from "../services/petService";
import "./PetList.css";

function PetList() {
    const navigate = useNavigate();

    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");
    const [vaccinated, setVaccinated] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("");

    useEffect(() => {
        const loadPets = async () => {
            try {
                const data = await getPets({
                    search: search,
                    species: species,
                    gender: gender,
                    vaccinated: vaccinated,
                    location: location,
                    status: status
                });

                setPets(data.pets);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        loadPets();
    }, [search, species, gender, vaccinated, location, status]);

    if (loading) {
        return <p>Loading pets...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className="pet-list">
            <h2>Available Pets</h2>
            
            <div className="filters">

                <input
                    type="text"
                    placeholder="Search pets..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={species}
                    onChange={(e) => setSpecies(e.target.value)}
                >
                    <option value="">All Species</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                </select>

                <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                >
                    <option value="">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <select
                    value={vaccinated}
                    onChange={(e) => setVaccinated(e.target.value)}
                >
                    <option value="">Vaccination: All</option>
                    <option value="true">Vaccinated</option>
                    <option value="false">Not Vaccinated</option>
                </select>

                <input
                    type="text"
                    placeholder="Location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                />

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="">All Status</option>
                    <option value="Available">Available</option>
                    <option value="Pending">Pending</option>
                    <option value="Adopted">Adopted</option>
                </select>

                <button
                    onClick={() => {
                        setSearch("");
                        setSpecies("");
                        setGender("");
                        setVaccinated("");
                        setLocation("");
                        setStatus("");
                    }}
                >
                    Clear Filters
                </button>

            </div>      

            {pets.length === 0 ? (
                <p>No pets available.</p>
            ) : (
                <div className="pet-grid">
                    {pets.map((pet) => (
                        <div 
                            className="pet-card" 
                            key={pet._id}
                            onClick={() => navigate(`/pets/${pet._id}`)}
                        >

                            {pet.imageURL && (
                                <img
                                    src={`http://127.0.0.1:5000${pet.imageURL}`}
                                    alt={pet.name}
                                />
                            )}

                            <div className="pet-card-content">

                                <h3>{pet.name}</h3>
                                <p>🐾 {pet.species} • {pet.breed}</p>
                                <p>Age: {pet.age} years</p>
                                <p>Gender: {pet.gender}</p>
                                <p>📍 {pet.location}</p>
                                <span className="status">
                                    {pet.status}
                                </span>

                            </div>
                        </div>
                    ))}
             </div>
            )}
        </div>
    );
}

export default PetList;