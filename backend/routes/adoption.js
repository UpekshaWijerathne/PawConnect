const express = require("express");
const AdoptionRequest = require("../models/AdoptionRequest");
const Pet = require("../models/Pet");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE an adoption request
router.post(
    "/",
    authMiddleware,
    roleMiddleware("adopter"),
    async (req, res) => {
        try {
            const { petId } = req.body;

            if (!petId) {
                return res.status(400).json({
                    message: "Pet ID is required"
                });
            }

            const pet = await Pet.findById(petId);

            if (!pet) {
                return res.status(404).json({
                    message: "Pet not found"
                });
            }

            if (pet.status !== "Available") {
                return res.status(400).json({
                    message: "This pet is not available for adoption"
                });
            }

            const existingRequest = await AdoptionRequest.findOne({
                petId: petId,
                userId: req.user.userId,
                status: "Pending"
            });

            if (existingRequest) {
                return res.status(400).json({
                    message: "You already have a pending request for this pet"
                });
            }

            const adoptionRequest = await AdoptionRequest.create({
                petId: petId,
                userId: req.user.userId
            });

            res.status(201).json({
                message: "Adoption request submitted successfully",
                adoptionRequest
            });

        } catch (error) {
            res.status(500).json({
                message: "Failed to submit adoption request",
                error: error.message
            });
        }
    }
);

module.exports = router;