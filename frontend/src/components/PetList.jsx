import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Search,
    Heart,
    MapPin,
    PawPrint,
    SlidersHorizontal,
    RotateCcw,
    ArrowRight
} from "lucide-react";

import { getPets } from "../services/petService";
import "./PetList.css";

function PetList() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");
    const [vaccinated, setVaccinated] = useState("");
    const [location, setLocation] = useState("");
    const [status, setStatus] = useState("Available");

    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        loadPets();
    }, [search, species, gender, vaccinated, location, status]);

    const loadPets = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getPets({
                search,
                species,
                gender,
                vaccinated,
                location,
                status
            });

            setPets(data.pets || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load pets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const clearFilters = () => {
        setSearch("");
        setSpecies("");
        setGender("");
        setVaccinated("");
        setLocation("");
        setStatus("Available");
    };

    const toggleFavorite = (id) => {
        setFavorites((current) =>
            current.includes(id)
                ? current.filter((item) => item !== id)
                : [...current, id]
        );
    };

    return (
        <main className="browse-page">

            {/* ================= HEADER ================= */}

            <section className="browse-hero">

                <div className="browse-hero-content">

                    <div className="browse-badge">
                        <PawPrint size={16} />
                        FIND YOUR COMPANION
                    </div>

                    <h1>
                        Find Your
                        <span>Perfect Friend</span>
                    </h1>

                    <p>
                        Browse loving pets waiting for a forever home.
                        Your new best friend may be just one click away.
                    </p>

                </div>

            </section>


            {/* ================= SEARCH / FILTER ================= */}

            <section className="browse-container">

                <div className="filter-header">

                    <div>
                        <h2>Browse Pets</h2>

                        <p>
                            Find a companion that matches your heart.
                        </p>
                    </div>

                    <div className="result-count">
                        <PawPrint size={17} />
                        {pets.length} pets found
                    </div>

                </div>


                <div className="filter-box">

                    <div className="filter-title">
                        <SlidersHorizontal size={19} />
                        Search & Filter
                    </div>


                    <div className="filter-grid">

                        {/* Search */}

                        <div className="filter-field search-field">

                            <label>Search</label>

                            <div className="field-input">

                                <Search size={18} />

                                <input
                                    type="text"
                                    placeholder="Name or breed..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Species */}

                        <div className="filter-field">

                            <label>Species</label>

                            <select
                                value={species}
                                onChange={(e) =>
                                    setSpecies(e.target.value)
                                }
                            >
                                <option value="">
                                    All Species
                                </option>

                                <option value="Dog">
                                    Dogs
                                </option>

                                <option value="Cat">
                                    Cats
                                </option>

                                <option value="Rabbit">
                                    Rabbits
                                </option>

                                <option value="Bird">
                                    Birds
                                </option>

                            </select>

                        </div>


                        {/* Gender */}

                        <div className="filter-field">

                            <label>Gender</label>

                            <select
                                value={gender}
                                onChange={(e) =>
                                    setGender(e.target.value)
                                }
                            >
                                <option value="">
                                    All Genders
                                </option>

                                <option value="Male">
                                    Male
                                </option>

                                <option value="Female">
                                    Female
                                </option>

                            </select>

                        </div>


                        {/* Vaccination */}

                        <div className="filter-field">

                            <label>Vaccination</label>

                            <select
                                value={vaccinated}
                                onChange={(e) =>
                                    setVaccinated(e.target.value)
                                }
                            >
                                <option value="">
                                    Any
                                </option>

                                <option value="true">
                                    Vaccinated
                                </option>

                                <option value="false">
                                    Not Vaccinated
                                </option>

                            </select>

                        </div>


                        {/* Location */}

                        <div className="filter-field">

                            <label>Location</label>

                            <div className="field-input">

                                <MapPin size={18} />

                                <input
                                    type="text"
                                    placeholder="e.g. Colombo"
                                    value={location}
                                    onChange={(e) =>
                                        setLocation(e.target.value)
                                    }
                                />

                            </div>

                        </div>


                        {/* Status */}

                        <div className="filter-field">

                            <label>Status</label>

                            <select
                                value={status}
                                onChange={(e) =>
                                    setStatus(e.target.value)
                                }
                            >
                                <option value="">
                                    All Status
                                </option>

                                <option value="Available">
                                    Available
                                </option>

                                <option value="Pending">
                                    Pending
                                </option>

                                <option value="Adopted">
                                    Adopted
                                </option>

                            </select>

                        </div>

                    </div>


                    <button
                        className="clear-filters"
                        onClick={clearFilters}
                    >
                        <RotateCcw size={16} />
                        Clear Filters
                    </button>

                </div>


                {/* ================= PET RESULTS ================= */}

                {loading && (

                    <div className="browse-message">

                        <div className="loading-icon">
                            <PawPrint size={30} />
                        </div>

                        <h3>Finding your companions...</h3>

                        <p>
                            We're looking for pets waiting for
                            their forever homes.
                        </p>

                    </div>

                )}


                {!loading && error && (

                    <div className="browse-message error-message">

                        <h3>Something went wrong</h3>

                        <p>{error}</p>

                        <button onClick={loadPets}>
                            Try Again
                        </button>

                    </div>

                )}


                {!loading && !error && pets.length === 0 && (

                    <div className="browse-message">

                        <div className="empty-icon">
                            <PawPrint size={35} />
                        </div>

                        <h3>No pets found</h3>

                        <p>
                            Try changing your search or filters.
                        </p>

                        <button onClick={clearFilters}>
                            Reset Filters
                        </button>

                    </div>

                )}


                {!loading && !error && pets.length > 0 && (

                    <div className="browse-grid">

                        {pets.map((pet) => (

                            <article
                                className="browse-pet-card"
                                key={pet._id}
                            >

                                {/* Image */}

                                <div className="browse-pet-image">

                                    {pet.imageURL ? (

                                        <img
                                            src={`http://127.0.0.1:5000${pet.imageURL}`}
                                            alt={pet.name}
                                        />

                                    ) : (

                                        <div className="image-placeholder">
                                            <PawPrint size={48} />
                                        </div>

                                    )}


                                    {/* Favorite */}

                                    <button
                                        className={`favorite-btn ${
                                            favorites.includes(pet._id)
                                                ? "favorited"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            toggleFavorite(pet._id)
                                        }
                                        aria-label="Add to favorites"
                                    >
                                        <Heart
                                            size={20}
                                            fill={
                                                favorites.includes(pet._id)
                                                    ? "currentColor"
                                                    : "none"
                                            }
                                        />
                                    </button>


                                    {/* Status */}

                                    <span
                                        className={`pet-status ${pet.status.toLowerCase()}`}
                                    >
                                        {pet.status}
                                    </span>

                                </div>


                                {/* Content */}

                                <div className="browse-pet-content">

                                    <div className="pet-title-row">

                                        <h3>
                                            {pet.name}
                                        </h3>

                                        <span className="pet-gender">
                                            {pet.gender}
                                        </span>

                                    </div>


                                    <p className="breed">
                                        {pet.species} • {pet.breed}
                                    </p>


                                    <div className="pet-details">

                                        <span>
                                            {pet.age}{" "}
                                            {pet.age === 1
                                                ? "year"
                                                : "years"
                                            }
                                        </span>

                                        <span>
                                            <MapPin size={14} />
                                            {pet.location}
                                        </span>

                                    </div>


                                    <Link
                                        to={`/pets/${pet._id}`}
                                        className="details-btn"
                                    >
                                        View Details
                                        <ArrowRight size={16} />
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>

        </main>
    );
}

export default PetList;