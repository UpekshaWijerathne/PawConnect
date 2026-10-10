
const API_URL = "http://127.0.0.1:5000/api/pets";

export const getPets = async (filters = {}) => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined && value !== null) {
            query.append(key, value);
        }
    });

    const url = query.toString()
        ? `${API_URL}?${query.toString()}`
        : API_URL;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Failed to fetch pets");
    }

    return response.json();
};

export const getPetById = async (id) => {
    const response = await fetch(`${API_URL}/${id}`);

    if (!response.ok) {
        throw new Error("Failed to fetch pet");
    }

    return response.json();
};

// Add a new pet, including an optional image.
export const createPet = async (petData, token) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: petData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to add pet");
    }

    return data;
};

// Update an existing pet.
export const updatePet = async (id, petData, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(petData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update pet");
    }

    return data;
};

// Delete an existing pet.
export const deletePet = async (id, token) => {
    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to delete pet");
    }

    return data;
};
