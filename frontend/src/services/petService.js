const API_URL = "http://127.0.0.1:5000/api/pets";

export const getPets = async (filters = {}) => {
    const query = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value !== "" && value !== undefined) {
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