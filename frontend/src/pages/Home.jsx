import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    ArrowRight,
    Heart,
    Search,
    PawPrint,
    MapPin
} from "lucide-react";

import { getPets } from "../services/petService";
import "./Home.css";

function Home() {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [species, setSpecies] = useState("");
    const [location, setLocation] = useState("");

    useEffect(() => {
        loadFeaturedPets();
    }, []);

    const loadFeaturedPets = async (filters = {}) => {
        try {
            setLoading(true);
            setError("");

            const data = await getPets({
                status: "Available",
                ...filters
            });

            setPets(data.pets || []);
        } catch (err) {
            console.error(err);
            setError("Unable to load pets. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();

        loadFeaturedPets({
            search,
            species,
            location
        });
    };

    return (
        <main>

            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-content">

                    <div className="hero-badge">
                        <PawPrint size={16} />
                        Every Pet Deserves a Loving Home
                    </div>

                    <h1>
                        Connect Hearts
                        <span>Change Lives</span>
                    </h1>

                    <p>
                        Find your perfect companion and give a loving pet
                        the forever home they deserve.
                    </p>

                    <div className="hero-buttons">

                        <Link to="/pets" className="primary-button">
                            Browse Pets
                            <ArrowRight size={18} />
                        </Link>

                        <a href="#how-it-works" className="secondary-button">
                            Learn More
                        </a>

                    </div>

                </div>

                <div className="hero-image">
                    <img
                        src="/src/assets/hero.png"
                        alt="Happy pets"
                    />
                </div>

            </section>


            {/* ================= STATS ================= */}

            <section className="stats-section">

                <div className="stat-card">
                    <strong>200+</strong>
                    <span>Pets Adopted</span>
                </div>

                <div className="stat-card">
                    <strong>150+</strong>
                    <span>Partner Shelters</span>
                </div>

                <div className="stat-card">
                    <strong>500+</strong>
                    <span>Happy Families</span>
                </div>

                <div className="stat-card">
                    <strong>1000+</strong>
                    <span>Lives Impacted</span>
                </div>

            </section>


            {/* ================= SEARCH ================= */}

            <section className="pet-search-section">

                <div className="section-heading">
                    <span>FIND YOUR COMPANION</span>

                    <h2>
                        Find Your Perfect Companion
                    </h2>

                    <p>
                        Search through loving pets waiting for their
                        forever homes.
                    </p>
                </div>

                <form
                    className="pet-search"
                    onSubmit={handleSearch}
                >

                    <div className="search-input">
                        <Search size={20} />

                        <input
                            type="text"
                            placeholder="Search by name or breed..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        value={species}
                        onChange={(e) => setSpecies(e.target.value)}
                    >
                        <option value="">All Pets</option>
                        <option value="Dog">Dogs</option>
                        <option value="Cat">Cats</option>
                        <option value="Rabbit">Rabbits</option>
                        <option value="Bird">Birds</option>
                    </select>

                    <div className="location-input">

                        <MapPin size={19} />

                        <input
                            type="text"
                            placeholder="Location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />

                    </div>

                    <button type="submit">
                        Search
                    </button>

                </form>

            </section>


            {/* ================= FEATURED PETS ================= */}

            <section className="featured-section">

                <div className="featured-header">

                    <div>
                        <span>MEET YOUR NEW BEST FRIEND</span>

                        <h2>
                            Featured Pets
                        </h2>
                    </div>

                    <Link to="/pets" className="view-all">
                        View All Pets
                        <ArrowRight size={18} />
                    </Link>

                </div>


                {loading && (
                    <div className="pets-message">
                        Loading adorable pets...
                    </div>
                )}


                {error && (
                    <div className="pets-message error">
                        {error}
                    </div>
                )}


                {!loading && !error && pets.length === 0 && (
                    <div className="pets-message">
                        No available pets found.
                    </div>
                )}


                {!loading && pets.length > 0 && (

                    <div className="featured-pets">

                        {pets.slice(0, 4).map((pet) => (

                            <article
                                className="pet-card"
                                key={pet._id}
                            >

                                <div className="pet-image">

                                    {pet.imageURL ? (
                                        <img
                                            src={`http://127.0.0.1:5000${pet.imageURL}`}
                                            alt={pet.name}
                                        />
                                    ) : (
                                        <div className="pet-image-placeholder">
                                            <PawPrint size={45} />
                                        </div>
                                    )}

                                    <button
                                        className="favorite-button"
                                        aria-label={`Favorite ${pet.name}`}
                                    >
                                        <Heart size={19} />
                                    </button>

                                    <span className="available-badge">
                                        Available
                                    </span>

                                </div>


                                <div className="pet-card-content">

                                    <div className="pet-name-row">

                                        <h3>
                                            {pet.name}
                                        </h3>

                                        <span>
                                            {pet.gender}
                                        </span>

                                    </div>

                                    <p className="pet-breed">
                                        {pet.breed || "Unknown breed"}
                                    </p>

                                    <div className="pet-meta">

                                        <span>
                                            {pet.age} {pet.age === 1 ? "year" : "years"}
                                        </span>

                                        <span>
                                            <MapPin size={14} />
                                            {pet.location}
                                        </span>

                                    </div>

                                    <Link
                                        to={`/pets/${pet._id}`}
                                        className="view-pet-button"
                                    >
                                        View Pet
                                        <ArrowRight size={16} />
                                    </Link>

                                </div>

                            </article>

                        ))}

                    </div>

                )}

            </section>


            {/* ================= HOW IT WORKS ================= */}

            <section
                className="how-it-works"
                id="how-it-works"
            >

                <div className="section-heading">

                    <span>HOW IT WORKS</span>

                    <h2>
                        Your Journey to Adoption
                    </h2>

                    <p>
                        We've made the adoption process simple and
                        meaningful.
                    </p>

                </div>


                <div className="steps">

                    <div className="step">
                        <div className="step-number">01</div>
                        <PawPrint size={28} />
                        <h3>Find a Pet</h3>
                        <p>
                            Browse our available pets and find
                            the one that steals your heart.
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">02</div>
                        <Heart size={28} />
                        <h3>Submit a Request</h3>
                        <p>
                            Send an adoption request to the
                            shelter or pet owner.
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">03</div>
                        <Search size={28} />
                        <h3>Meet Your Companion</h3>
                        <p>
                            Connect with the shelter and meet
                            your potential new companion.
                        </p>
                    </div>

                    <div className="step">
                        <div className="step-number">04</div>
                        <Heart size={28} />
                        <h3>Give Them a Home</h3>
                        <p>
                            Complete the adoption and begin
                            your beautiful journey together.
                        </p>
                    </div>

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="home-cta" id="about">

                <div>
                    <PawPrint size={35} />

                    <h2>
                        Ready to Change a Life?
                    </h2>

                    <p>
                        Your new best friend may be waiting for you.
                    </p>
                </div>

                <Link to="/pets" className="cta-button">
                    Find My Pet
                    <ArrowRight size={18} />
                </Link>

            </section>

        </main>
    );
}

export default Home;