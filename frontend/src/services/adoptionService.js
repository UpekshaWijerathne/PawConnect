const API_URL = "http://127.0.0.1:5000/api/adoptions";

export const createAdoptionRequest = async (petId, token) => {
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            petId: petId
        })
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Failed to submit adoption request");
    }

    return data;
};