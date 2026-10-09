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

export const getMyAdoptionRequests = async (token) => {
    const response = await fetch(
        "http://127.0.0.1:5000/api/adoptions/my",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch adoption requests"
        );
    }

    return data;
};

// Get adoption requests for shelter
export const getShelterAdoptionRequests = async (token) => {
    const response = await fetch(
        "http://127.0.0.1:5000/api/adoptions/shelter",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to fetch shelter requests"
        );
    }

    return data;
};


// Approve or reject an adoption request
export const updateAdoptionRequestStatus = async (
    requestId,
    status,
    token
) => {
    const response = await fetch(
        `http://127.0.0.1:5000/api/adoptions/${requestId}/status`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                status
            })
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.message || "Failed to update adoption request"
        );
    }

    return data;
};