const express = require("express");
const Pet = require("../models/Pet");
const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();

// CREATE a pet
router.post(
    "/",
    authMiddleware,
    roleMiddleware("shelter", "admin"),
    async (req, res) => {
        try {
            const pet = await Pet.create({
                ...req.body,
                ownerId: req.user.userId
            });

            res.status(201).json({
                message: "Pet added successfully",
                pet
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to add pet",
                error: error.message
            });
        }
    }
);

// GET all pets
router.get("/", async (req, res) => {
    try {
        const pets = await Pet.find();

        res.status(200).json({
            count: pets.length,
            pets
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch pets",
            error: error.message
        });
    }
});

// GET one pet by ID
router.get("/:id", async (req, res) => {
    try {
        const pet = await Pet.findById(req.params.id);

        if (!pet) {
            return res.status(404).json({
                message: "Pet not found"
            });
        }

        res.status(200).json({
            pet
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch pet",
            error: error.message
        });
    }
});

// UPDATE a pet
router.put(
    "/:id",
    authMiddleware,
    roleMiddleware("shelter", "admin"),
    async (req, res) => {
        try {
            const pet = await Pet.findById(req.params.id);

            if (!pet) {
                return res.status(404).json({
                    message: "Pet not found"
                });
            }

            if (
                req.user.role !== "admin" &&
                pet.ownerId.toString() !== req.user.userId
            ) {
                return res.status(403).json({
                    message: "You can only update your own pets"
                });
            }

            const updatedPet = await Pet.findByIdAndUpdate(
                req.params.id,
                req.body,
                { new: true, runValidators: true }
            );

            res.status(200).json({
                message: "Pet updated successfully",
                pet: updatedPet
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to update pet",
                error: error.message
            });
        }
    }
);

// DELETE a pet
router.delete(
    "/:id",
    authMiddleware,
    roleMiddleware("shelter", "admin"),
    async (req, res) => {
        try {
            const pet = await Pet.findById(req.params.id);

            if (!pet) {
                return res.status(404).json({
                    message: "Pet not found"
                });
            }

            if (
                req.user.role !== "admin" &&
                pet.ownerId.toString() !== req.user.userId
            ) {
                return res.status(403).json({
                    message: "You can only delete your own pets"
                });
            }

            await Pet.findByIdAndDelete(req.params.id);

            res.status(200).json({
                message: "Pet deleted successfully"
            });
        } catch (error) {
            res.status(500).json({
                message: "Failed to delete pet",
                error: error.message
            });
        }
    }
);

module.exports = router;